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
import JunctionNode from "./JunctionNode";
import { PersonWithRole } from "@/lib/types";
import { createFamilyTreeLayout } from "@/lib/family-tree-layout";

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
        person={data as PersonWithRole}
        isSelected={selected}
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
  junction: JunctionNode,
};

export default function FamilyTree({
  people,
  relationships,
  selectedPersonId,
  onPersonSelect,
  zoom,
}: FamilyTreeProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isLayouting, setIsLayouting] = useState(true);

  // Initialiser les nœuds et edges avec la logique d'arbre généalogique
  useEffect(() => {
    const initializeLayout = async () => {
      setIsLayouting(true);

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        await createFamilyTreeLayout(people, relationships);

      setNodes(layoutedNodes);
      setEdges(layoutedEdges);
      setIsLayouting(false);
    };

    initializeLayout();
  }, [people, relationships, setNodes, setEdges]);

  // Gérer le clic sur un nœud (ignorer les junctions)
  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      if (node.type !== "junction") {
        onPersonSelect(node.id);
      }
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

  if (isLayouting) {
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
        defaultViewport={{ x: 0, y: 0, zoom: zoom / 100 }}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{
          style: { strokeWidth: 2, stroke: "#9CA3AF" },
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
