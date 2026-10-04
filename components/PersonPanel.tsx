"use client";

import { PersonWithRole, GENERATION_COLORS } from "@/lib/types";
import { X, MapPin, Calendar, Edit, Trash2, Plus, User as UserIcon } from "lucide-react";

interface PersonPanelProps {
  person: PersonWithRole | null;
  onClose: () => void;
  onEdit?: (personId: string) => void;
  onDelete?: (personId: string) => void;
  onAddRelative?: (relativeToId?: string) => void;
  onViewAsRoot?: (personId: string) => void;
  relatedPeople?: Array<{ id: string; name: string; role: string }>;
}

export default function PersonPanel({
  person,
  onClose,
  onEdit,
  onDelete,
  onAddRelative,
  onViewAsRoot,
  relatedPeople = [],
}: PersonPanelProps) {
  if (!person) return null;

  const getDisplayName = () => {
    if (person.firstName || person.lastName) {
      return `${person.firstName || ""} ${person.lastName || ""}`.trim();
    }
    return person.label || "Membre de la famille";
  };

  const getInitials = () => {
    if (person.firstName && person.lastName) {
      return `${person.firstName[0]}${person.lastName[0]}`.toUpperCase();
    }
    if (person.firstName) {
      return person.firstName.substring(0, 2).toUpperCase();
    }
    if (person.lastName) {
      return person.lastName.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  const formatFullDate = (year?: number, month?: number, day?: number, approx?: boolean) => {
    if (!year) return null;
    const parts = [];
    if (day) parts.push(day);
    if (month) {
      const monthNames = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
      ];
      parts.push(monthNames[month - 1]);
    }
    parts.push(year);
    return (approx ? "vers " : "") + parts.join(" ");
  };

  const genColor = GENERATION_COLORS[person.generation % GENERATION_COLORS.length];
  const hasName = person.firstName || person.lastName;

  return (
    <div className="fixed right-0 top-0 h-full w-[400px] bg-white shadow-2xl flex flex-col z-50 animate-slide-in-right">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-text-primary">
          Détails du membre
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg hover:bg-background flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5 text-text-muted" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Photo et nom */}
          <div className="text-center">
            <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden mb-4">
              {person.photoPath ? (
                <img
                  src={person.photoPath}
                  alt={getDisplayName()}
                  className={`w-full h-full object-cover ${
                    person.isDeceased ? "grayscale opacity-80" : ""
                  }`}
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center ${genColor}`}
                >
                  {hasName || person.label ? (
                    <span className="text-4xl font-semibold text-primary/60">
                      {getInitials()}
                    </span>
                  ) : (
                    <UserIcon className="w-16 h-16 text-text-muted" />
                  )}
                </div>
              )}
            </div>

            <h3
              className={`text-xl font-semibold mb-2 ${
                hasName ? "text-text-primary" : "text-text-muted italic"
              }`}
            >
              {getDisplayName()}
            </h3>

            <div className="inline-block">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-medium ${genColor} text-primary`}
              >
                {person.role}
              </span>
            </div>
          </div>

          {/* Informations */}
          <div className="space-y-4">
            {/* Naissance */}
            {(person.birthYear || person.birthPlace) && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-text-muted mb-1">Naissance</div>
                  <div className="text-sm text-text-primary">
                    {formatFullDate(
                      person.birthYear,
                      person.birthMonth,
                      person.birthDay,
                      person.birthApprox
                    )}
                  </div>
                  {person.birthPlace && (
                    <div className="text-sm text-text-secondary mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {person.birthPlace}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Décès */}
            {person.isDeceased && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center flex-shrink-0">
                  <span className="text-text-muted">✝</span>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-text-muted mb-1">Décès</div>
                  <div className="text-sm text-text-primary">
                    {person.deathYear
                      ? formatFullDate(person.deathYear, person.deathMonth, person.deathDay)
                      : "Date inconnue"}
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {person.notes && (
              <div className="p-4 bg-background rounded-xl">
                <div className="text-xs text-text-muted mb-2">Notes</div>
                <div className="text-sm text-text-primary whitespace-pre-line">
                  {person.notes}
                </div>
              </div>
            )}
          </div>

          {/* Proches */}
          {relatedPeople.length > 0 && (
            <div>
              <div className="text-sm font-semibold text-text-primary mb-3">
                Proches
              </div>
              <div className="space-y-2">
                {relatedPeople.map((related) => (
                  <button
                    key={related.id}
                    className="w-full flex items-center justify-between p-3 bg-background hover:bg-border/50 rounded-lg transition-colors text-left"
                  >
                    <div>
                      <div className="text-sm font-medium text-text-primary">
                        {related.name}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {related.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-border space-y-2">
        <button
          onClick={() => onEdit?.(person.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-all"
        >
          <Edit className="w-4 h-4" />
          Modifier
        </button>

        <button
          onClick={() => onAddRelative?.(person.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-background hover:bg-border text-text-primary rounded-xl text-sm font-medium transition-all"
        >
          <Plus className="w-4 h-4" />
          Ajouter un proche
        </button>

        <button
          onClick={() => onViewAsRoot?.(person.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-background hover:bg-border text-text-primary rounded-xl text-sm font-medium transition-all"
        >
          Voir l'arbre depuis cette personne
        </button>

        <button
          onClick={() => onDelete?.(person.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl text-sm font-medium transition-all"
        >
          <Trash2 className="w-4 h-4" />
          Supprimer
        </button>
      </div>
    </div>
  );
}
