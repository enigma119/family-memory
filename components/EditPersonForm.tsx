"use client";

import { useState, useEffect } from "react";
import { Gender } from "@/lib/types";
import { useFamily } from "@/lib/FamilyContext";
import Modal from "./Modal";

interface EditPersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string;
}

export default function EditPersonForm({
  isOpen,
  onClose,
  personId,
}: EditPersonFormProps) {
  const { updatePerson, people } = useFamily();

  const person = people.find((p) => p.id === personId);

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

  // Charger les données de la personne quand la modal s'ouvre
  useEffect(() => {
    if (person && isOpen) {
      setFormData({
        firstName: person.firstName || "",
        lastName: person.lastName || "",
        gender: person.gender || "unknown",
        birthYear: person.birthYear?.toString() || "",
        birthMonth: person.birthMonth?.toString() || "",
        birthDay: person.birthDay?.toString() || "",
        birthApprox: person.birthApprox || false,
        birthPlace: person.birthPlace || "",
        isDeceased: person.isDeceased || false,
        deathYear: person.deathYear?.toString() || "",
        deathMonth: person.deathMonth?.toString() || "",
        deathDay: person.deathDay?.toString() || "",
        notes: person.notes || "",
      });
    }
  }, [person, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation minimum : prénom OU nom
    if (!formData.firstName.trim() && !formData.lastName.trim()) {
      alert("Veuillez saisir au moins un prénom ou un nom");
      return;
    }

    // Mettre à jour la personne
    updatePerson(personId, {
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
    });

    // Fermer
    onClose();
  };

  if (!person) return null;

  const displayName = person.firstName || person.lastName || "Membre de la famille";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Modifier ${displayName}`}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div className="px-6 py-6 space-y-6">
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
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl font-medium transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </Modal>
  );
}
