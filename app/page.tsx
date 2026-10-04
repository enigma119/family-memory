"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import FamilyToolbar from "@/components/FamilyToolbar";
import FamilyTree from "@/components/FamilyTree";
import PersonPanel from "@/components/PersonPanel";
import AddPersonForm from "@/components/AddPersonForm";
import EditPersonForm from "@/components/EditPersonForm";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import { useFamily } from "@/lib/FamilyContext";

export default function Home() {
  const { enrichedPeople, relationships, focalPersonId, setFocalPerson } = useFamily();

  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");

  // États pour les modals
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [addFormRelativeTo, setAddFormRelativeTo] = useState<string | undefined>(undefined);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [editingPersonId, setEditingPersonId] = useState<string>("");
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deletingPersonId, setDeletingPersonId] = useState<string>("");

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

  const handleAddRelative = (relativeToId?: string) => {
    setAddFormRelativeTo(relativeToId);
    setIsAddFormOpen(true);
  };

  const handleEdit = (personId: string) => {
    setEditingPersonId(personId);
    setIsEditFormOpen(true);
  };

  const handleDelete = (personId: string) => {
    setDeletingPersonId(personId);
    setIsDeleteConfirmOpen(true);
  };

  const handleViewAsRoot = (personId: string) => {
    setFocalPerson(personId);
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
          relationships={relationships}
          selectedPersonId={selectedPersonId ?? undefined}
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

      {/* Modals */}
      <AddPersonForm
        isOpen={isAddFormOpen}
        onClose={() => {
          setIsAddFormOpen(false);
          setAddFormRelativeTo(undefined);
        }}
        relativeTo={addFormRelativeTo}
      />

      {editingPersonId && (
        <EditPersonForm
          isOpen={isEditFormOpen}
          onClose={() => {
            setIsEditFormOpen(false);
            setEditingPersonId("");
          }}
          personId={editingPersonId}
        />
      )}

      {deletingPersonId && (
        <DeleteConfirmation
          isOpen={isDeleteConfirmOpen}
          onClose={() => {
            setIsDeleteConfirmOpen(false);
            setDeletingPersonId("");
          }}
          personId={deletingPersonId}
        />
      )}
    </div>
  );
}
