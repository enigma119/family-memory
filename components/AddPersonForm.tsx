"use client";

import { useState } from "react";
import { Gender } from "@/lib/types";
import { useFamily } from "@/lib/FamilyContext";
import Modal from "./Modal";

interface AddPersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  relativeTo?: string; // ID de la personne de référence
}

type RelationType = "parent" | "child" | "spouse" | "sibling";

export default function AddPersonForm({
  isOpen,
  onClose,
  relativeTo,
}: AddPersonFormProps) {
  const { addPerson, addRelationship, people } = useFamily();

  // Étape 1 : Type de relation
  const [relationType, setRelationType] = useState<RelationType | null>(null);

  // Étape 2 : Données de la personne
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "unknown" as Gender,
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthApprox: false,
    birthPlace: "",
    isDeceased: false,
    deathYear: "",
    deathMonth: "",
    deathDay: "",
    notes: "",
  });

  const relativeToName = relativeTo
    ? people.find((p) => p.id === relativeTo)?.firstName || "cette personne"
    : "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation minimum : prénom OU nom
    if (!formData.firstName.trim() && !formData.lastName.trim()) {
      alert("Veuillez saisir au moins un prénom ou un nom");
      return;
    }

    // Créer la nouvelle personne
    const newPersonId = addPerson({
      familyId: "family-1",
      firstName: formData.firstName.trim() || undefined,
      lastName: formData.lastName.trim() || undefined,
      gender: formData.gender,
      birthYear: formData.birthYear ? parseInt(formData.birthYear) : undefined,
      birthMonth: formData.birthMonth ? parseInt(formData.birthMonth) : undefined,
      birthDay: formData.birthDay ? parseInt(formData.birthDay) : undefined,
      birthApprox: formData.birthApprox,
      birthPlace: formData.birthPlace.trim() || undefined,
      isDeceased: formData.isDeceased,
      deathYear: formData.deathYear ? parseInt(formData.deathYear) : undefined,
      deathMonth: formData.deathMonth ? parseInt(formData.deathMonth) : undefined,
      deathDay: formData.deathDay ? parseInt(formData.deathDay) : undefined,
      notes: formData.notes.trim() || undefined,
      isPlaceholder: false,
    });

    // Créer les relations si nécessaire
    if (relativeTo && relationType) {
      if (relationType === "parent") {
        // La nouvelle personne est le parent de relativeTo
        addRelationship({
          familyId: "family-1",
          personId: newPersonId,
          relatedPersonId: relativeTo,
          type: "parent",
        });
      } else if (relationType === "child") {
        // relativeTo est le parent de la nouvelle personne
        addRelationship({
          familyId: "family-1",
          personId: relativeTo,
          relatedPersonId: newPersonId,
          type: "parent",
        });
      } else if (relationType === "spouse") {
        addRelationship({
          familyId: "family-1",
          personId: relativeTo,
          relatedPersonId: newPersonId,
          type: "spouse",
        });
      } else if (relationType === "sibling") {
        // Pour les frères/sœurs, on a besoin d'un parent commun
        // Pour l'instant, on ne crée pas de relation automatique
        // TODO: Gérer les frères/sœurs
      }
    }

    // Réinitialiser et fermer
    handleClose();
  };

  const handleClose = () => {
    setRelationType(null);
    setFormData({
      firstName: "",
      lastName: "",
      gender: "unknown",
      birthYear: "",
      birthMonth: "",
      birthDay: "",
      birthApprox: false,
      birthPlace: "",
      isDeceased: false,
      deathYear: "",
      deathMonth: "",
      deathDay: "",
      notes: "",
    });
    onClose();
  };

  const relationLabels: Record<RelationType, string> = {
    parent: "Parent",
    child: "Enfant",
    spouse: "Conjoint(e)",
    sibling: "Frère/Sœur",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={`Ajouter un proche${relativeTo ? ` de ${relativeToName}` : ""}`}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-6 space-y-6">
          {/* Étape 1 : Choisir le type de relation */}
          {relativeTo && !relationType && (
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Type de relation avec {relativeToName}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(["parent", "child", "spouse", "sibling"] as RelationType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRelationType(type)}
                    className="p-4 border-2 border-border hover:border-primary rounded-xl text-left transition-colors"
                  >
                    <div className="font-medium text-text-primary">
                      {relationLabels[type]}
                    </div>
                    <div className="text-xs text-text-secondary mt-1">
                      {type === "parent" && `Vous ajoutez un parent de ${relativeToName}`}
                      {type === "child" && `Vous ajoutez un enfant de ${relativeToName}`}
                      {type === "spouse" && `Vous ajoutez le/la conjoint(e) de ${relativeToName}`}
                      {type === "sibling" && `Vous ajoutez un frère/sœur de ${relativeToName}`}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Étape 2 : Formulaire de la personne */}
          {(!relativeTo || relationType) && (
            <>
              {/* Nom et Prénom */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Prénom"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Nom"
                  />
                </div>
              </div>

              {/* Genre */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Sexe
                </label>
                <div className="flex gap-3">
                  {[
                    { value: "male" as Gender, label: "Homme" },
                    { value: "female" as Gender, label: "Femme" },
                    { value: "unknown" as Gender, label: "Non précisé" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, gender: option.value })}
                      className={`flex-1 py-2 px-4 rounded-xl border-2 transition-colors ${
                        formData.gender === option.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border text-text-secondary hover:border-primary/50"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Naissance */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Naissance
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="number"
                    value={formData.birthDay}
                    onChange={(e) => setFormData({ ...formData, birthDay: e.target.value })}
                    className="px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Jour"
                    min="1"
                    max="31"
                  />
                  <input
                    type="number"
                    value={formData.birthMonth}
                    onChange={(e) => setFormData({ ...formData, birthMonth: e.target.value })}
                    className="px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Mois"
                    min="1"
                    max="12"
                  />
                  <input
                    type="number"
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                    className="px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="Année"
                    min="1800"
                    max="2100"
                  />
                </div>
                <label className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    checked={formData.birthApprox}
                    onChange={(e) => setFormData({ ...formData, birthApprox: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm text-text-secondary">Date approximative ("vers")</span>
                </label>
              </div>

              {/* Lieu de naissance */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Lieu de naissance
                </label>
                <input
                  type="text"
                  value={formData.birthPlace}
                  onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  placeholder="Paris, France"
                />
              </div>

              {/* Décédé */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isDeceased}
                    onChange={(e) => setFormData({ ...formData, isDeceased: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-text-primary">
                    Personne décédée
                  </span>
                </label>

                {formData.isDeceased && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    <input
                      type="number"
                      value={formData.deathDay}
                      onChange={(e) => setFormData({ ...formData, deathDay: e.target.value })}
                      className="px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Jour"
                      min="1"
                      max="31"
                    />
                    <input
                      type="number"
                      value={formData.deathMonth}
                      onChange={(e) => setFormData({ ...formData, deathMonth: e.target.value })}
                      className="px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Mois"
                      min="1"
                      max="12"
                    />
                    <input
                      type="number"
                      value={formData.deathYear}
                      onChange={(e) => setFormData({ ...formData, deathYear: e.target.value })}
                      className="px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      placeholder="Année"
                      min="1800"
                      max="2100"
                    />
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  rows={3}
                  placeholder="Informations supplémentaires..."
                />
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {(!relativeTo || relationType) && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-colors"
            >
              Ajouter
            </button>
          </div>
        )}
      </form>
    </Modal>
  );
}
