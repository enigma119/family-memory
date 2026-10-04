"use client";

import { PersonWithRole, GENERATION_COLORS } from "@/lib/types";
import { User } from "lucide-react";

interface PersonCardProps {
  person: PersonWithRole;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function PersonCard({
  person,
  isSelected = false,
  onClick,
}: PersonCardProps) {
  // Fonction pour obtenir le nom complet ou le libellé
  const getDisplayName = () => {
    if (person.firstName || person.lastName) {
      return `${person.firstName || ""} ${person.lastName || ""}`.trim();
    }
    return person.label || "Membre de la famille";
  };

  // Fonction pour obtenir les initiales
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
    if (person.label) {
      const words = person.label.split(" ");
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return person.label.substring(0, 2).toUpperCase();
    }
    return "?";
  };

  // Fonction pour formater les dates
  const formatDateRange = () => {
    const birthStr = person.birthYear
      ? `${person.birthApprox ? "vers " : ""}${person.birthYear}`
      : "";
    const deathStr =
      person.isDeceased && person.deathYear ? `${person.deathYear}` : "";

    if (birthStr && deathStr) {
      return `${birthStr} – ${deathStr}`;
    }
    if (birthStr && person.isDeceased) {
      return `${birthStr} –`;
    }
    if (deathStr && !birthStr) {
      return `– ${deathStr}`;
    }
    if (birthStr) {
      return birthStr;
    }
    return null;
  };

  // Obtenir la couleur de génération
  const genColor = GENERATION_COLORS[person.generation % GENERATION_COLORS.length];

  const displayName = getDisplayName();
  const dateRange = formatDateRange();
  const hasName = person.firstName || person.lastName;

  return (
    <div
      onClick={onClick}
      className={`
        relative bg-white rounded-2xl overflow-hidden cursor-pointer
        transition-all duration-200 hover:shadow-lg
        ${isSelected ? "ring-2 ring-primary shadow-xl" : "shadow-sm hover:shadow-md"}
      `}
      style={{ width: 160 }}
    >
      {/* Photo ou initiales */}
      <div className="relative w-full aspect-square">
        {person.photoPath ? (
          <img
            src={person.photoPath}
            alt={displayName}
            className={`w-full h-full object-cover ${
              person.isDeceased ? "grayscale opacity-80" : ""
            }`}
          />
        ) : (
          <div
            className={`w-full h-full flex items-center justify-center ${genColor}`}
          >
            {hasName || person.label ? (
              <span className="text-3xl font-semibold text-primary/60">
                {getInitials()}
              </span>
            ) : (
              <User className="w-12 h-12 text-text-muted" />
            )}
          </div>
        )}

        {/* Indicateur décédé */}
        {person.isDeceased && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center">
            <span className="text-xs text-text-muted">✝</span>
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="p-3 text-center">
        {/* Nom */}
        <div
          className={`font-semibold text-sm ${
            hasName ? "text-text-primary" : "text-text-muted italic"
          }`}
        >
          {displayName}
        </div>

        {/* Rôle (pastille colorée) */}
        <div className="mt-2 flex justify-center">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${genColor} text-primary`}
          >
            {person.role}
          </span>
        </div>

        {/* Dates */}
        {dateRange && (
          <div className="mt-2 text-xs text-text-secondary">{dateRange}</div>
        )}
      </div>
    </div>
  );
}
