"use client";

import { useFamily } from "@/lib/FamilyContext";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

interface DeleteConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  personId: string;
}

export default function DeleteConfirmation({
  isOpen,
  onClose,
  personId,
}: DeleteConfirmationProps) {
  const { deletePerson, people, relationships } = useFamily();

  const person = people.find((p) => p.id === personId);

  const handleDelete = () => {
    deletePerson(personId);
    onClose();
  };

  if (!person) return null;

  const displayName = person.firstName || person.lastName || "Membre de la famille";

  // Compter les relations
  const relatedRelationships = relationships.filter(
    (r) => r.personId === personId || r.relatedPersonId === personId
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmer la suppression"
      size="md"
    >
      <div className="px-6 py-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-text-primary mb-2">
              Supprimer {displayName} ?
            </h3>
            <p className="text-sm text-text-secondary mb-3">
              Cette action est irréversible. La personne et toutes ses relations
              seront définitivement supprimées.
            </p>
            {relatedRelationships.length > 0 && (
              <p className="text-sm text-text-secondary">
                <span className="font-medium text-text-primary">
                  {relatedRelationships.length}
                </span>{" "}
                relation{relatedRelationships.length > 1 ? "s" : ""} sera
                {relatedRelationships.length > 1 ? "ont" : ""} supprimée
                {relatedRelationships.length > 1 ? "s" : ""}.
              </p>
            )}
          </div>
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
          type="button"
          onClick={handleDelete}
          className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
        >
          Supprimer
        </button>
      </div>
    </Modal>
  );
}
