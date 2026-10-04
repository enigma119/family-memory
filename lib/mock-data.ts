import { Person, Relationship } from "./types";

// Données fictives pour tester l'interface
// 15 personnes sur 4 générations avec divers cas de données incomplètes

export const mockPeople: Person[] = [
  // Génération 0 (arrière-grands-parents)
  {
    id: "1",
    familyId: "family-1",
    firstName: "Ibrahim",
    lastName: "Diallo",
    gender: "male",
    birthYear: 1925,
    birthApprox: true,
    isDeceased: true,
    deathYear: 1998,
    isPlaceholder: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    familyId: "family-1",
    label: "Mère d'Aminata", // Cas: pas de nom, seulement un libellé
    gender: "female",
    isDeceased: true,
    // Pas de dates connues
    isPlaceholder: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Génération 1 (grands-parents)
  {
    id: "3",
    familyId: "family-1",
    firstName: "Aminata",
    lastName: "Diallo",
    gender: "female",
    birthYear: 1950,
    birthPlace: "Dakar, Sénégal",
    isDeceased: false,
    isPlaceholder: false,
    notes: "Professeure de mathématiques à la retraite",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    familyId: "family-1",
    firstName: "Moussa",
    lastName: "Sarr",
    gender: "male",
    birthYear: 1948,
    isDeceased: true,
    deathYear: 2015,
    deathMonth: 7,
    isPlaceholder: false,
    notes: "Médecin, fondateur d'une clinique à Dakar",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Génération 2 (parents)
  {
    id: "5",
    familyId: "family-1",
    firstName: "Fatou",
    lastName: "Sarr",
    gender: "female",
    birthYear: 1975,
    birthMonth: 3,
    birthDay: 15,
    birthPlace: "Dakar, Sénégal",
    isDeceased: false,
    isPlaceholder: false,
    notes: "Architecte, passionnée de photographie",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    familyId: "family-1",
    firstName: "Jean",
    lastName: "Martin",
    gender: "male",
    birthYear: 1972,
    // Pas de photo
    isDeceased: false,
    isPlaceholder: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "7",
    familyId: "family-1",
    firstName: "Ibrahima",
    lastName: "Sarr",
    gender: "male",
    birthYear: 1978,
    isDeceased: false,
    isPlaceholder: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "8",
    familyId: "family-1",
    firstName: "Sophie",
    lastName: "Sarr",
    gender: "female",
    birthYear: 1980,
    isDeceased: false,
    isPlaceholder: false,
    notes: "Première épouse d'Ibrahima",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "9",
    familyId: "family-1",
    firstName: "Aïcha",
    lastName: "Sarr",
    gender: "female",
    birthYear: 1985,
    isDeceased: false,
    isPlaceholder: false,
    notes: "Seconde épouse d'Ibrahima (remariage)",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Génération 3 (enfants / "Vous")
  {
    id: "10",
    familyId: "family-1",
    firstName: "Malik",
    lastName: "Martin",
    gender: "male",
    birthYear: 2000,
    birthMonth: 8,
    birthDay: 22,
    birthPlace: "Paris, France",
    isDeceased: false,
    isPlaceholder: false,
    notes: "Étudiant en informatique - C'est moi!",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "11",
    familyId: "family-1",
    firstName: "Léa",
    lastName: "Martin",
    gender: "female",
    birthYear: 2003,
    isDeceased: false,
    isPlaceholder: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "12",
    familyId: "family-1",
    firstName: "Omar",
    lastName: "Sarr",
    gender: "male",
    birthYear: 2005,
    isDeceased: false,
    isPlaceholder: false,
    notes: "Fils d'Ibrahima et Sophie",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "13",
    familyId: "family-1",
    firstName: "Yasmine",
    lastName: "Sarr",
    gender: "female",
    birthYear: 2012,
    isDeceased: false,
    isPlaceholder: false,
    notes: "Fille d'Ibrahima et Aïcha",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Cas spécial: enfant avec frère/sœur (Marie et Aminata sont sœurs)
  {
    id: "14",
    familyId: "family-1",
    firstName: "Marie",
    lastName: "Diallo",
    gender: "female",
    birthYear: 1952,
    isDeceased: false,
    isPlaceholder: false,
    notes: "Sœur d'Aminata (tante de Fatou)",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const mockRelationships: Relationship[] = [
  // Génération 0 -> Génération 1
  { id: "r1", familyId: "family-1", personId: "1", relatedPersonId: "3", type: "parent" },
  { id: "r2", familyId: "family-1", personId: "2", relatedPersonId: "3", type: "parent" },
  { id: "r1b", familyId: "family-1", personId: "1", relatedPersonId: "14", type: "parent" },
  { id: "r2b", familyId: "family-1", personId: "2", relatedPersonId: "14", type: "parent" },

  // Couple génération 0
  { id: "r3", familyId: "family-1", personId: "1", relatedPersonId: "2", type: "spouse" },

  // Génération 1 -> Génération 2
  { id: "r6", familyId: "family-1", personId: "3", relatedPersonId: "5", type: "parent" },
  { id: "r7", familyId: "family-1", personId: "4", relatedPersonId: "5", type: "parent" },
  { id: "r8", familyId: "family-1", personId: "3", relatedPersonId: "7", type: "parent" },
  { id: "r9", familyId: "family-1", personId: "4", relatedPersonId: "7", type: "parent" },

  // Couple génération 1
  { id: "r10", familyId: "family-1", personId: "3", relatedPersonId: "4", type: "spouse" },

  // Génération 2 -> Génération 3
  { id: "r11", familyId: "family-1", personId: "5", relatedPersonId: "10", type: "parent" },
  { id: "r12", familyId: "family-1", personId: "6", relatedPersonId: "10", type: "parent" },
  { id: "r13", familyId: "family-1", personId: "5", relatedPersonId: "11", type: "parent" },
  { id: "r14", familyId: "family-1", personId: "6", relatedPersonId: "11", type: "parent" },

  // Enfants d'Ibrahima avec Sophie
  { id: "r15", familyId: "family-1", personId: "7", relatedPersonId: "12", type: "parent" },
  { id: "r16", familyId: "family-1", personId: "8", relatedPersonId: "12", type: "parent" },

  // Enfant d'Ibrahima avec Aïcha
  { id: "r17", familyId: "family-1", personId: "7", relatedPersonId: "13", type: "parent" },
  { id: "r18", familyId: "family-1", personId: "9", relatedPersonId: "13", type: "parent" },

  // Couples génération 2
  { id: "r19", familyId: "family-1", personId: "5", relatedPersonId: "6", type: "spouse" },
  { id: "r20", familyId: "family-1", personId: "7", relatedPersonId: "8", type: "spouse" },
  { id: "r21", familyId: "family-1", personId: "7", relatedPersonId: "9", type: "spouse" },
];

// ID de la personne focale ("Vous") - Malik
export const FOCAL_PERSON_ID = "10";

// Fonction helper pour récupérer une personne par ID
export function getPersonById(id: string): Person | undefined {
  return mockPeople.find((p) => p.id === id);
}

// Fonction helper pour récupérer les relations d'une personne
export function getPersonRelationships(personId: string): Relationship[] {
  return mockRelationships.filter(
    (r) => r.personId === personId || r.relatedPersonId === personId
  );
}
