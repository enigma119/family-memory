import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";
import { Node, Edge } from "@xyflow/react";
import { PersonWithRole, Relationship } from "./types";
import { getChildren, getSpouses } from "./family-relations";

const elk = new ELK();

const elkOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.spacing.nodeNode": "80",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.edgeNode": "40",
  "elk.spacing.edgeEdge": "20",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
};

// Structure pour stocker les couples avec enfants
interface Couple {
  parent1Id: string;
  parent2Id: string;
  childrenIds: string[];
}

// Trouver tous les couples avec leurs enfants
function findCouples(
  people: PersonWithRole[],
  relationships: Relationship[]
): Couple[] {
  const couples: Couple[] = [];
  const processedSpouses = new Set<string>();

  relationships.forEach((rel) => {
    if (rel.type === "spouse") {
      const coupleKey = [rel.personId, rel.relatedPersonId].sort().join("-");
      if (processedSpouses.has(coupleKey)) return;
      processedSpouses.add(coupleKey);

      // Trouver les enfants communs de ce couple
      const children1 = getChildren(rel.personId, relationships);
      const children2 = getChildren(rel.relatedPersonId, relationships);
      const commonChildren = children1.filter((c) => children2.includes(c));

      if (commonChildren.length > 0) {
        couples.push({
          parent1Id: rel.personId,
          parent2Id: rel.relatedPersonId,
          childrenIds: commonChildren,
        });
      }
    }
  });

  return couples;
}

// Créer les nœuds avec les nœuds de connexion invisibles
export function createNodesWithJunctions(
  people: PersonWithRole[],
  couples: Couple[]
): Node[] {
  const nodes: Node[] = [];
  const peopleIds = new Set(people.filter((p) => !p.isPlaceholder).map((p) => p.id));

  // Ajouter tous les nœuds de personnes
  people
    .filter((p) => !p.isPlaceholder)
    .forEach((person) => {
      nodes.push({
        id: person.id,
        type: "person",
        position: { x: 0, y: 0 },
        data: person as unknown as Record<string, unknown>,
        width: 160,
        height: 220,
      });
    });

  // Ajouter les nœuds de connexion invisibles pour chaque couple avec enfants
  couples.forEach((couple, index) => {
    if (peopleIds.has(couple.parent1Id) && peopleIds.has(couple.parent2Id)) {
      nodes.push({
        id: `junction-${couple.parent1Id}-${couple.parent2Id}`,
        type: "junction",
        position: { x: 0, y: 0 },
        data: { type: "junction" },
        width: 1,
        height: 1,
      });
    }
  });

  return nodes;
}

// Créer les edges avec la logique d'arbre généalogique
export function createEdgesWithJunctions(
  relationships: Relationship[],
  people: PersonWithRole[],
  couples: Couple[]
): Edge[] {
  const edges: Edge[] = [];
  const peopleIds = new Set(people.filter((p) => !p.isPlaceholder).map((p) => p.id));
  const childrenWithCoupleParents = new Set<string>();

  // 1. Créer les edges entre conjoints (horizontal)
  relationships.forEach((rel) => {
    if (rel.type === "spouse") {
      if (!peopleIds.has(rel.personId) || !peopleIds.has(rel.relatedPersonId)) {
        return;
      }

      const existingEdge = edges.find(
        (e) =>
          (e.source === rel.personId && e.target === rel.relatedPersonId) ||
          (e.source === rel.relatedPersonId && e.target === rel.personId)
      );

      if (!existingEdge) {
        edges.push({
          id: `spouse-${rel.personId}-${rel.relatedPersonId}`,
          source: rel.personId,
          target: rel.relatedPersonId,
          sourceHandle: "right",
          targetHandle: "left",
          type: "straight",
          style: {
            strokeWidth: 2,
            stroke: "#D1D5DB",
            strokeDasharray: "5,5",
          },
          animated: false,
        });
      }
    }
  });

  // 2. Pour chaque couple avec enfants
  couples.forEach((couple) => {
    if (!peopleIds.has(couple.parent1Id) || !peopleIds.has(couple.parent2Id)) {
      return;
    }

    const junctionId = `junction-${couple.parent1Id}-${couple.parent2Id}`;

    // Edge du couple vers le nœud de connexion (du milieu du couple)
    // On choisit arbitrairement parent1 comme source
    edges.push({
      id: `couple-to-junction-${junctionId}`,
      source: couple.parent1Id,
      target: junctionId,
      sourceHandle: "bottom",
      targetHandle: "top",
      type: "smoothstep",
      style: {
        strokeWidth: 2,
        stroke: "#9CA3AF",
      },
      animated: false,
    });

    // Edges du nœud de connexion vers chaque enfant
    couple.childrenIds.forEach((childId) => {
      if (peopleIds.has(childId)) {
        childrenWithCoupleParents.add(childId);
        edges.push({
          id: `junction-to-child-${junctionId}-${childId}`,
          source: junctionId,
          target: childId,
          sourceHandle: "bottom",
          targetHandle: "top",
          type: "smoothstep",
          style: {
            strokeWidth: 2,
            stroke: "#9CA3AF",
          },
          animated: false,
        });
      }
    });
  });

  // 3. Pour les enfants qui n'ont qu'un seul parent (parent solo)
  relationships.forEach((rel) => {
    if (rel.type === "parent") {
      if (!peopleIds.has(rel.personId) || !peopleIds.has(rel.relatedPersonId)) {
        return;
      }

      // Si cet enfant n'est pas déjà géré par un couple
      if (!childrenWithCoupleParents.has(rel.relatedPersonId)) {
        edges.push({
          id: `${rel.personId}-${rel.relatedPersonId}`,
          source: rel.personId,
          target: rel.relatedPersonId,
          sourceHandle: "bottom",
          targetHandle: "top",
          type: "smoothstep",
          style: {
            strokeWidth: 2,
            stroke: "#9CA3AF",
          },
          animated: false,
        });
      }
    }
  });

  return edges;
}

// Calculer la disposition avec ELK
export async function getLayoutWithJunctions(
  nodes: Node[],
  edges: Edge[]
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const graph: ElkNode = {
    id: "root",
    layoutOptions: elkOptions,
    children: nodes.map((node) => ({
      id: node.id,
      width: node.width || 1,
      height: node.height || 1,
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  try {
    const layoutedGraph = await elk.layout(graph);

    const layoutedNodes = nodes.map((node) => {
      const layoutedNode = layoutedGraph.children?.find((n) => n.id === node.id);
      return {
        ...node,
        position: {
          x: layoutedNode?.x || 0,
          y: layoutedNode?.y || 0,
        },
      };
    });

    return {
      nodes: layoutedNodes,
      edges,
    };
  } catch (error) {
    console.error("Error during layout:", error);
    return { nodes, edges };
  }
}

// Fonction principale qui combine tout
export async function createFamilyTreeLayout(
  people: PersonWithRole[],
  relationships: Relationship[]
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  // 1. Trouver les couples avec enfants
  const couples = findCouples(people, relationships);

  // 2. Créer les nœuds (personnes + junctions)
  const nodes = createNodesWithJunctions(people, couples);

  // 3. Créer les edges avec la logique d'arbre
  const edges = createEdgesWithJunctions(relationships, people, couples);

  // 4. Calculer la disposition
  const layout = await getLayoutWithJunctions(nodes, edges);

  return layout;
}
