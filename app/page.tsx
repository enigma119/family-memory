"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import FamilyToolbar from "@/components/FamilyToolbar";
import FamilyTree from "@/components/FamilyTree";
import PersonPanel from "@/components/PersonPanel";
import {
  mockPeople,
  mockRelationships,
  FOCAL_PERSON_ID,
  getPersonById,
} from "@/lib/mock-data";
import { enrichPeopleWithRoles } from "@/lib/family-relations";
import { PersonWithRole } from "@/lib/types";

export default function Home() {
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [focalPersonId, setFocalPersonId] = useState<string>(FOCAL_PERSON_ID);
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");

  // Enrichir les personnes avec leurs rôles
  const enrichedPeople = useMemo(
    () => enrichPeopleWithRoles(mockPeople, focalPersonId, mockRelationships),
    [focalPersonId]
  );

  // Filtrer les personnes selon la recherche
  const filteredPeople = useMemo(() => {
    if (!searchQuery.trim()) return enrichedPeople;

    const query = searchQuery.toLowerCase();
    return enrichedPeople.filter((person) => {
      const firstName = person.firstName?.toLowerCase() || "";
      const lastName = person.lastName?.toLowerCase() || "";
      const label = person.label?.toLowerCase() || "";
      return (
        firstName.includes(query) ||
        lastName.includes(query) ||
        label.includes(query)
      );
    });
  }, [enrichedPeople, searchQuery]);

  const selectedPerson = useMemo(() => {
    if (!selectedPersonId) return null;
    return enrichedPeople.find((p) => p.id === selectedPersonId) || null;
  }, [selectedPersonId, enrichedPeople]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Si un seul résultat, le sélectionner automatiquement
    if (query.trim()) {
      const results = enrichedPeople.filter((person) => {
        const q = query.toLowerCase();
        return (
          person.firstName?.toLowerCase().includes(q) ||
          person.lastName?.toLowerCase().includes(q) ||
          person.label?.toLowerCase().includes(q)
        );
      });
      if (results.length === 1) {
        setSelectedPersonId(results[0].id);
      }
    }
  };

  const handleAddRelative = () => {
    console.log("Ajouter un proche");
    // TODO: Ouvrir le formulaire d'ajout
  };

  const handleEdit = (personId: string) => {
    console.log("Modifier la personne:", personId);
    // TODO: Ouvrir le formulaire de modification
  };

  const handleDelete = (personId: string) => {
    console.log("Supprimer la personne:", personId);
    // TODO: Confirmation et suppression
  };

  const handleViewAsRoot = (personId: string) => {
    setFocalPersonId(personId);
    setSelectedPersonId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      <Header />
      <FamilyToolbar
        familyName="Famille Martin-Sarr"
        zoom={zoom}
        onZoomChange={setZoom}
        onSearch={handleSearch}
        onAddRelative={handleAddRelative}
      />

      <div className="flex-1 relative overflow-hidden">
        <FamilyTree
          people={searchQuery ? filteredPeople : enrichedPeople}
          relationships={mockRelationships}
          selectedPersonId={selectedPersonId}
          onPersonSelect={setSelectedPersonId}
          zoom={zoom}
        />

        {selectedPerson && (
          <PersonPanel
            person={selectedPerson}
            onClose={() => setSelectedPersonId(null)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddRelative={handleAddRelative}
            onViewAsRoot={handleViewAsRoot}
          />
        )}
      </div>
    </div>
  );
}
