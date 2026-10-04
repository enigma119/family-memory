"use client";

import { ReactFlow, Node, Edge, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Test ultra-simple avec 3 nœuds et 2 edges hardcodés
const nodes: Node[] = [
  {
    id: "1",
    type: "default",
    position: { x: 100, y: 100 },
    data: { label: "Personne 1" },
  },
  {
    id: "2",
    type: "default",
    position: { x: 300, y: 100 },
    data: { label: "Personne 2" },
  },
  {
    id: "3",
    type: "default",
    position: { x: 200, y: 300 },
    data: { label: "Personne 3" },
  },
];

const edges: Edge[] = [
  {
    id: "e1-3",
    source: "1",
    target: "3",
    type: "smoothstep",
    style: { strokeWidth: 3, stroke: "#FF0000" }, // Rouge vif pour être bien visible
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "smoothstep",
    style: { strokeWidth: 3, stroke: "#0000FF" }, // Bleu vif
  },
];

export default function TestFlowPage() {
  console.log("🧪 TEST PAGE - Nodes:", nodes);
  console.log("🧪 TEST PAGE - Edges:", edges);

  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="bg-white border-b p-4">
        <h1 className="text-xl font-bold">Test React Flow - Edges</h1>
        <p className="text-sm text-gray-600">
          Vous devriez voir 3 boîtes et 2 lignes (rouge et bleue)
        </p>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      <div className="bg-gray-100 p-4 border-t">
        <p className="text-sm">
          <strong>Test dans la console :</strong>
          <code className="bg-gray-200 px-2 py-1 ml-2 rounded">
            document.querySelectorAll('.react-flow__edge').length
          </code>
        </p>
        <p className="text-sm mt-2">
          Résultat attendu : <strong>2</strong>
        </p>
      </div>
    </div>
  );
}
