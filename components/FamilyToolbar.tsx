"use client";

import { Search, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FamilyToolbarProps {
  familyName: string;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  onSearch: (query: string) => void;
  onAddRelative: () => void;
}

export default function FamilyToolbar({
  familyName,
  zoom,
  onZoomChange,
  onSearch,
  onAddRelative,
}: FamilyToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const zoomLevels = [50, 75, 100, 125, 150, 175, 200];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <div className="bg-white border-b border-border">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Nom de la famille */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-4 h-4 text-primary"
              >
                <path
                  d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-text-primary">
              {familyName}
            </h1>
          </div>

          {/* Barre de recherche */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Rechercher un membre..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Zoom et bouton ajout */}
          <div className="flex items-center gap-3">
            {/* Sélecteur de zoom */}
            <div className="relative">
              <select
                value={zoom}
                onChange={(e) => onZoomChange(Number(e.target.value))}
                className="appearance-none pl-4 pr-10 py-2 bg-background border border-border rounded-xl text-sm font-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
              >
                {zoomLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}%
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
            </div>

            {/* Bouton ajouter un proche */}
            <button
              onClick={onAddRelative}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              Ajouter un proche
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
