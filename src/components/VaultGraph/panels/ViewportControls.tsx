"use client";
import { Panel, useReactFlow } from "@xyflow/react";
import { Fit, Minus, Plus } from "../../Icons";

export default function ViewportControls() {
  const reactFlow = useReactFlow<any>();

  const items: { icon: React.ReactNode; onClick: () => void }[] = [
    { icon: <Minus />, onClick: () => reactFlow.zoomOut() },
    { icon: <Plus />, onClick: () => reactFlow.zoomIn() },
    { icon: <Fit />, onClick: () => reactFlow.fitView() },
  ];

  return (
    <Panel position="top-right" className="bg-background-base flex overflow-hidden rounded-full border">
      {items.map((item, i) => (
        <button
          onClick={() => item.onClick()}
          className="hover:bg-background-component flex h-12 w-12 items-center justify-center border-r"
          key={i}
        >
          {item.icon}
        </button>
      ))}
    </Panel>
  );
}
