import { Node, Edge } from "@xyflow/react";
import { PersonWithRole, Relationship } from "./types";

// Disposition simple sans elkjs (pour debug)
export function createSimpleLayout(
  people: PersonWithRole[],
  relationships: Relationship[]
): { nodes: Node[]; edges: Edge[] } {

  // Grouper par génération
  const generations = new Map<number, PersonWithRole[]>();
  people.forEach((person) => {
    if (!person.isPlaceholder) {
      const gen = person.generation;
      if (!generations.has(gen)) {
        generations.set(gen, []);
      }
      generations.get(gen)!.push(person);
    }
  });

  // Créer les nœuds avec positions fixes
  const nodes: Node[] = [];
  const sortedGens = Array.from(generations.keys()).sort((a, b) => a - b);

  sortedGens.forEach((gen, genIndex) => {
    const peopleInGen = generations.get(gen)!;
    const genY = genIndex * 300; // Espacement vertical entre générations

    peopleInGen.forEach((person, personIndex) => {
      const x = personIndex * 200 - (peopleInGen.length * 100); // Centrer
      nodes.push({
        id: person.id,
        type: "person",
        position: { x, y: genY },
        data: person as unknown as Record<string, unknown>,
        width: 160,
        height: 220,
      });
    });
  });

  // Créer les edges
  const edges: Edge[] = [];
  const peopleIds = new Set(people.filter((p) => !p.isPlaceholder).map((p) => p.id));

  relationships.forEach((rel) => {
    if (!peopleIds.has(rel.personId) || !peopleIds.has(rel.relatedPersonId)) {
      return;
    }

    if (rel.type === "parent") {
      edges.push({
        id: `edge-${rel.personId}-${rel.relatedPersonId}`,
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
      const existingEdge = edges.find(
        (e) =>
          (e.source === rel.personId && e.target === rel.relatedPersonId) ||
          (e.source === rel.relatedPersonId && e.target === rel.personId)
      );
      if (!existingEdge) {
        edges.push({
          id: `edge-spouse-${rel.personId}-${rel.relatedPersonId}`,
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

  return { nodes, edges };
}
