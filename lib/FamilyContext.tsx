"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Person, Relationship, PersonWithRole } from "./types";
import { mockPeople, mockRelationships, FOCAL_PERSON_ID } from "./mock-data";
import { enrichPeopleWithRoles } from "./family-relations";

interface FamilyContextType {
  people: Person[];
  relationships: Relationship[];
  focalPersonId: string;
  enrichedPeople: PersonWithRole[];

  // Actions
  addPerson: (person: Omit<Person, "id" | "createdAt" | "updatedAt">) => string;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  deletePerson: (id: string) => void;
  addRelationship: (relationship: Omit<Relationship, "id">) => void;
  setFocalPerson: (personId: string) => void;
}

const FamilyContext = createContext<FamilyContextType | undefined>(undefined);

export function FamilyProvider({ children }: { children: React.ReactNode }) {
  const [people, setPeople] = useState<Person[]>(mockPeople);
  const [relationships, setRelationships] = useState<Relationship[]>(mockRelationships);
  const [focalPersonId, setFocalPersonId] = useState<string>(FOCAL_PERSON_ID);

  // Enrichir les personnes avec leurs rôles
  const enrichedPeople = React.useMemo(
    () => enrichPeopleWithRoles(people, focalPersonId, relationships),
    [people, focalPersonId, relationships]
  );

  // Ajouter une personne
  const addPerson = useCallback((personData: Omit<Person, "id" | "createdAt" | "updatedAt">) => {
    const newId = `person-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPerson: Person = {
      ...personData,
      id: newId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setPeople((prev) => [...prev, newPerson]);
    return newId;
  }, []);

  // Modifier une personne
  const updatePerson = useCallback((id: string, updates: Partial<Person>) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === id
          ? { ...person, ...updates, updatedAt: new Date() }
          : person
      )
    );
  }, []);

  // Supprimer une personne (et ses relations)
  const deletePerson = useCallback((id: string) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setRelationships((prev) =>
      prev.filter((r) => r.personId !== id && r.relatedPersonId !== id)
    );
  }, []);

  // Ajouter une relation
  const addRelationship = useCallback((relationshipData: Omit<Relationship, "id">) => {
    const newId = `rel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRelationship: Relationship = {
      ...relationshipData,
      id: newId,
    };

    setRelationships((prev) => [...prev, newRelationship]);
  }, []);

  const value: FamilyContextType = {
    people,
    relationships,
    focalPersonId,
    enrichedPeople,
    addPerson,
    updatePerson,
    deletePerson,
    addRelationship,
    setFocalPerson: setFocalPersonId,
  };

  return (
    <FamilyContext.Provider value={value}>{children}</FamilyContext.Provider>
  );
}

export function useFamily() {
  const context = useContext(FamilyContext);
  if (context === undefined) {
    throw new Error("useFamily must be used within a FamilyProvider");
  }
  return context;
}
