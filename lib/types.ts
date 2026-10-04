// Types pour Family Memory

export type Gender = "male" | "female" | "unknown";

export type RelationshipType = "parent" | "spouse";

export interface Person {
  id: string;
  familyId: string;
  firstName?: string;
  lastName?: string;
  label?: string; // "Mère de Mamadou", etc.
  gender: Gender;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  birthApprox?: boolean;
  birthPlace?: string;
  isDeceased: boolean;
  deathYear?: number;
  deathMonth?: number;
  deathDay?: number;
  photoPath?: string;
  notes?: string;
  isPlaceholder: boolean; // parent "inconnu" auto-créé
  createdAt: Date;
  updatedAt: Date;
}

export interface Relationship {
  id: string;
  familyId: string;
  personId: string; // parent ou conjoint
  relatedPersonId: string; // enfant ou conjoint
  type: RelationshipType;
}

// Types pour l'affichage
export interface PersonWithRelations extends Person {
  parents: Person[];
  children: Person[];
  spouses: Person[];
  siblings: Person[];
}

// Types pour les rôles calculés
export type FamilyRole =
  | "Moi"
  | "Père"
  | "Mère"
  | "Parent"
  | "Fils"
  | "Fille"
  | "Enfant"
  | "Frère"
  | "Sœur"
  | "Conjoint"
  | "Conjointe"
  | "Grand-père"
  | "Grand-mère"
  | "Grand-parent"
  | "Petit-fils"
  | "Petite-fille"
  | "Petit-enfant"
  | "Oncle"
  | "Tante"
  | "Neveu"
  | "Nièce"
  | "Cousin"
  | "Cousine"
  | "Beau-père"
  | "Belle-mère"
  | "Beau-parent"
  | "Beau-fils"
  | "Belle-fille"
  | "Beau-frère"
  | "Belle-sœur"
  | "Famille";

export interface PersonWithRole extends Person {
  role: FamilyRole;
  generation: number; // pour les couleurs pastels
}

// Couleurs par génération
export const GENERATION_COLORS = [
  "bg-gen-pink",
  "bg-gen-yellow",
  "bg-gen-turquoise",
  "bg-gen-lavender",
] as const;

// Type pour le formulaire d'ajout
export interface AddPersonForm {
  relationshipType: "parent" | "child" | "spouse" | "sibling";
  relativeTo?: string; // ID de la personne de référence
  firstName?: string;
  lastName?: string;
  gender: Gender;
  birthYear?: number;
  birthMonth?: number;
  birthDay?: number;
  birthApprox?: boolean;
  birthPlace?: string;
  isDeceased: boolean;
  deathYear?: number;
  deathMonth?: number;
  deathDay?: number;
  photo?: File;
  notes?: string;
}
