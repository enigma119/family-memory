import { Person, Relationship, FamilyRole, PersonWithRole } from "./types";

// Helper pour obtenir les parents d'une personne
export function getParents(
  personId: string,
  relationships: Relationship[]
): string[] {
  return relationships
    .filter((r) => r.type === "parent" && r.relatedPersonId === personId)
    .map((r) => r.personId);
}

// Helper pour obtenir les enfants d'une personne
export function getChildren(
  personId: string,
  relationships: Relationship[]
): string[] {
  return relationships
    .filter((r) => r.type === "parent" && r.personId === personId)
    .map((r) => r.relatedPersonId);
}

// Helper pour obtenir le(s) conjoint(s) d'une personne
export function getSpouses(
  personId: string,
  relationships: Relationship[]
): string[] {
  return relationships
    .filter((r) => r.type === "spouse")
    .filter((r) => r.personId === personId || r.relatedPersonId === personId)
    .map((r) => (r.personId === personId ? r.relatedPersonId : r.personId));
}

// Helper pour obtenir les frères et sœurs (via parents communs)
export function getSiblings(
  personId: string,
  relationships: Relationship[]
): string[] {
  const parents = getParents(personId, relationships);
  if (parents.length === 0) return [];

  const siblings = new Set<string>();
  parents.forEach((parentId) => {
    const children = getChildren(parentId, relationships);
    children.forEach((childId) => {
      if (childId !== personId) {
        siblings.add(childId);
      }
    });
  });

  return Array.from(siblings);
}

// Calculer le rôle d'une personne par rapport à la personne focale
export function calculateRole(
  targetPerson: Person,
  focalPersonId: string,
  allPeople: Person[],
  relationships: Relationship[]
): FamilyRole {
  if (targetPerson.id === focalPersonId) {
    return "Moi";
  }

  const peopleMap = new Map(allPeople.map((p) => [p.id, p]));

  // Parents directs
  const focalParents = getParents(focalPersonId, relationships);
  if (focalParents.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Père";
    if (targetPerson.gender === "female") return "Mère";
    return "Parent";
  }

  // Enfants directs
  const focalChildren = getChildren(focalPersonId, relationships);
  if (focalChildren.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Fils";
    if (targetPerson.gender === "female") return "Fille";
    return "Enfant";
  }

  // Conjoint(s)
  const focalSpouses = getSpouses(focalPersonId, relationships);
  if (focalSpouses.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Conjoint";
    if (targetPerson.gender === "female") return "Conjointe";
    return "Conjoint";
  }

  // Frères et sœurs
  const focalSiblings = getSiblings(focalPersonId, relationships);
  if (focalSiblings.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Frère";
    if (targetPerson.gender === "female") return "Sœur";
    return "Frère";
  }

  // Grands-parents (parents des parents)
  const grandparents: string[] = [];
  focalParents.forEach((parentId) => {
    const parentsOfParent = getParents(parentId, relationships);
    grandparents.push(...parentsOfParent);
  });
  if (grandparents.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Grand-père";
    if (targetPerson.gender === "female") return "Grand-mère";
    return "Grand-parent";
  }

  // Petits-enfants (enfants des enfants)
  const grandchildren: string[] = [];
  focalChildren.forEach((childId) => {
    const childrenOfChild = getChildren(childId, relationships);
    grandchildren.push(...childrenOfChild);
  });
  if (grandchildren.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Petit-fils";
    if (targetPerson.gender === "female") return "Petite-fille";
    return "Petit-enfant";
  }

  // Oncles et tantes (frères et sœurs des parents)
  const unclesAunts: string[] = [];
  focalParents.forEach((parentId) => {
    const siblingsOfParent = getSiblings(parentId, relationships);
    unclesAunts.push(...siblingsOfParent);
  });
  if (unclesAunts.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Oncle";
    if (targetPerson.gender === "female") return "Tante";
    return "Oncle";
  }

  // Neveux et nièces (enfants des frères et sœurs)
  const nephewsNieces: string[] = [];
  focalSiblings.forEach((siblingId) => {
    const childrenOfSibling = getChildren(siblingId, relationships);
    nephewsNieces.push(...childrenOfSibling);
  });
  if (nephewsNieces.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Neveu";
    if (targetPerson.gender === "female") return "Nièce";
    return "Neveu";
  }

  // Cousins (enfants des oncles et tantes)
  const cousins: string[] = [];
  unclesAunts.forEach((uncleAuntId) => {
    const childrenOfUncleAunt = getChildren(uncleAuntId, relationships);
    cousins.push(...childrenOfUncleAunt);
  });
  if (cousins.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Cousin";
    if (targetPerson.gender === "female") return "Cousine";
    return "Cousin";
  }

  // Beaux-parents (parents du conjoint)
  const inLaws: string[] = [];
  focalSpouses.forEach((spouseId) => {
    const parentsOfSpouse = getParents(spouseId, relationships);
    inLaws.push(...parentsOfSpouse);
  });
  if (inLaws.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Beau-père";
    if (targetPerson.gender === "female") return "Belle-mère";
    return "Beau-parent";
  }

  // Beaux-enfants (enfants du conjoint)
  const stepChildren: string[] = [];
  focalSpouses.forEach((spouseId) => {
    const childrenOfSpouse = getChildren(spouseId, relationships);
    stepChildren.push(...childrenOfSpouse);
  });
  if (stepChildren.includes(targetPerson.id) && !focalChildren.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Beau-fils";
    if (targetPerson.gender === "female") return "Belle-fille";
    return "Beau-fils";
  }

  // Beaux-frères et belles-sœurs (frères/sœurs du conjoint ou conjoints des frères/sœurs)
  const siblingsInLaw: string[] = [];
  focalSpouses.forEach((spouseId) => {
    const siblingsOfSpouse = getSiblings(spouseId, relationships);
    siblingsInLaw.push(...siblingsOfSpouse);
  });
  focalSiblings.forEach((siblingId) => {
    const spousesOfSibling = getSpouses(siblingId, relationships);
    siblingsInLaw.push(...spousesOfSibling);
  });
  if (siblingsInLaw.includes(targetPerson.id)) {
    if (targetPerson.gender === "male") return "Beau-frère";
    if (targetPerson.gender === "female") return "Belle-sœur";
    return "Beau-frère";
  }

  return "Famille";
}

// Calculer la génération d'une personne par rapport à la personne focale
export function calculateGeneration(
  personId: string,
  focalPersonId: string,
  relationships: Relationship[]
): number {
  if (personId === focalPersonId) return 0;

  // BFS pour trouver la distance générationnelle
  const visited = new Set<string>();
  const queue: Array<{ id: string; generation: number }> = [
    { id: focalPersonId, generation: 0 },
  ];

  while (queue.length > 0) {
    const { id, generation } = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);

    if (id === personId) return generation;

    // Parents (génération -1)
    const parents = getParents(id, relationships);
    parents.forEach((parentId) => {
      if (!visited.has(parentId)) {
        queue.push({ id: parentId, generation: generation - 1 });
      }
    });

    // Enfants (génération +1)
    const children = getChildren(id, relationships);
    children.forEach((childId) => {
      if (!visited.has(childId)) {
        queue.push({ id: childId, generation: generation + 1 });
      }
    });

    // Conjoints (même génération)
    const spouses = getSpouses(id, relationships);
    spouses.forEach((spouseId) => {
      if (!visited.has(spouseId)) {
        queue.push({ id: spouseId, generation });
      }
    });
  }

  return 0; // Par défaut, même génération
}

// Enrichir les personnes avec leur rôle et génération
export function enrichPeopleWithRoles(
  people: Person[],
  focalPersonId: string,
  relationships: Relationship[]
): PersonWithRole[] {
  return people.map((person) => ({
    ...person,
    role: calculateRole(person, focalPersonId, people, relationships),
    generation: calculateGeneration(person.id, focalPersonId, relationships),
  }));
}
