"use client";

import { User } from "lucide-react";

export default function Header() {
  const navItems = [
    { name: "Family", active: true, available: true },
    { name: "Activity", active: false, available: false },
    { name: "Memories", active: false, available: false },
    { name: "Events", active: false, available: false },
    { name: "Files", active: false, available: false },
  ];

  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-[1600px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6 text-white"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  fill="currentColor"
                />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-text-primary">
              Family Memory
            </span>
          </div>

          {/* Navigation pilule */}
          <nav className="flex items-center gap-2 bg-background px-2 py-2 rounded-full">
            {navItems.map((item) => (
              <button
                key={item.name}
                className={`
                  px-5 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    item.active
                      ? "bg-white text-primary shadow-sm"
                      : item.available
                      ? "text-text-secondary hover:text-text-primary"
                      : "text-text-muted cursor-not-allowed"
                  }
                `}
                disabled={!item.available}
              >
                {item.name}
                {!item.available && (
                  <span className="ml-2 text-xs bg-background px-2 py-0.5 rounded-full">
                    Bientôt
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User profile */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gen-lavender rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <span className="text-sm font-medium text-text-primary">
              Malik Martin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
