"use client";

import { Handle, Position } from "@xyflow/react";

// Nœud de connexion invisible entre un couple et leurs enfants
export default function JunctionNode() {
  return (
    <div style={{ width: 1, height: 1, position: "relative" }}>
      {/* Handle en haut - reçoit la connexion du couple */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ opacity: 0, width: 1, height: 1 }}
      />

      {/* Handle en bas - envoie les connexions vers les enfants */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ opacity: 0, width: 1, height: 1 }}
      />
    </div>
  );
}
