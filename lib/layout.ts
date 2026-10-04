import ELK, { ElkNode } from "elkjs/lib/elk.bundled.js";
import { Node, Edge } from "@xyflow/react";
import { PersonWithRole, Relationship } from "./types";
import { getChildren, getSpouses } from "./family-relations";

const elk = new ELK();

// Configuration pour la disposition ELK
const elkOptions = {
  "elk.algorithm": "layered",
  "elk.direction": "DOWN",
  "elk.spacing.nodeNode": "80",
  "elk.layered.spacing.nodeNodeBetweenLayers": "100",
  "elk.spacing.edgeNode": "40",
  "elk.spacing.edgeEdge": "20",
  "elk.layered.nodePlacement.strategy": "NETWORK_SIMPLEX",
};

// Convertir les personnes en nœuds React Flow
export function createNodesFromPeople(people: PersonWithRole[]): Node[] {
  return people
    .filter((p) => !p.isPlaceholder) // Ne pas afficher les placeholders
    .map((person) => ({
      id: person.id,
      type: "person",
      position: { x: 0, y: 0 }, // Position sera calculée par ELK
      data: person as unknown as Record<string, unknown>,
      width: 160,
      height: 220,
    }));
}

// Convertir les relations en edges React Flow
export function createEdgesFromRelationships(
  relationships: Relationship[],
  people: PersonWithRole[]
): Edge[] {
  const edges: Edge[] = [];
  const peopleIds = new Set(people.filter((p) => !p.isPlaceholder).map((p) => p.id));

  relationships.forEach((rel) => {
    // Ne pas afficher les edges vers/depuis les placeholders
    if (!peopleIds.has(rel.personId) || !peopleIds.has(rel.relatedPersonId)) {
      return;
    }

    if (rel.type === "parent") {
      edges.push({
        id: `${rel.personId}-${rel.relatedPersonId}`,
        source: rel.personId,
        target: rel.relatedPersonId,
        sourceHandle: "bottom", // Toujours du bas du parent
        targetHandle: "top",    // Toujours vers le haut de l'enfant
        type: "smoothstep",
        style: {
          strokeWidth: 2,
          stroke: "#9CA3AF"
        },
        animated: false,
      });
    } else if (rel.type === "spouse") {
      // Éviter les doublons pour les couples
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
          sourceHandle: "right",  // Toujours de droite vers gauche
          targetHandle: "left",   // pour les connexions horizontales
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

  return edges;
}

// Calculer la disposition automatique avec ELK
export async function getLayoutedElements(
  nodes: Node[],
  edges: Edge[]
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const graph: ElkNode = {
    id: "root",
    layoutOptions: elkOptions,
    children: nodes.map((node) => ({
      id: node.id,
      width: node.width || 160,
      height: node.height || 220,
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
