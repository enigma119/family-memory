"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  NodeProps,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import PersonCard from "./PersonCard";
import { PersonWithRole } from "@/lib/types";
import { createSimpleLayout } from "@/lib/simple-layout";

interface FamilyTreeProps {
  people: PersonWithRole[];
  relationships: any[];
  selectedPersonId?: string;
  onPersonSelect: (personId: string) => void;
  zoom: number;
}

// Custom node component with handles
function PersonNode({ data, selected }: NodeProps) {
  return (
    <>
      {/* Handle en haut - pour recevoir des connexions des parents */}
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        style={{ background: "#7C5CFC", opacity: 0 }}
      />

      <PersonCard
        person={data as unknown as PersonWithRole}
        isSelected={selected ?? false}
        onClick={() => {}}
      />

      {/* Handle en bas - pour envoyer des connexions vers les enfants */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        style={{ background: "#7C5CFC", opacity: 0 }}
      />

      {/* Handle à gauche - pour connexions entre conjoints */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{ background: "#7C5CFC", opacity: 0 }}
      />

      {/* Handle à droite - pour connexions entre conjoints */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{ background: "#7C5CFC", opacity: 0 }}
      />
    </>
  );
}

const nodeTypes = {
  person: PersonNode,
};

export default function FamilyTreeSimple({
  people,
  relationships,
  selectedPersonId,
  onPersonSelect,
  zoom,
}: FamilyTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [isReady, setIsReady] = useState(false);

  // Initialiser les nœuds et edges avec layout simple
  useEffect(() => {
    const { nodes: simpleNodes, edges: simpleEdges } = createSimpleLayout(
      people,
      relationships
    );

    setNodes(simpleNodes);
    setEdges(simpleEdges);
    setIsReady(true);
  }, [people, relationships, setNodes, setEdges]);

  // Gérer le clic sur un nœud
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onPersonSelect(node.id);
    },
    [onPersonSelect]
  );

  // Mettre à jour la sélection
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: node.id === selectedPersonId,
      }))
    );
  }, [selectedPersonId, setNodes]);

  if (!isReady) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-secondary">Chargement de l'arbre familial...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          style: { strokeWidth: 3, stroke: "#6B7280" },
        }}
      >
        <Background color="#E5E7EB" gap={16} />
        <Controls
          showInteractive={false}
          className="!bg-white !border !border-border !rounded-xl !shadow-lg"
        />
      </ReactFlow>
    </div>
  );
}
