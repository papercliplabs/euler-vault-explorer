"use client";
import { Panel, useReactFlow } from "@xyflow/react";
import { Fit, Minus, Plus } from "@/components/Icons";
import clsx from "clsx";

export default function ViewportControls() {
  const reactFlow = useReactFlow();

  const items: { icon: React.ReactNode; onClick: () => void }[] = [
    { icon: <Minus />, onClick: () => reactFlow.zoomOut() },
    { icon: <Plus />, onClick: () => reactFlow.zoomIn() },
    { icon: <Fit />, onClick: () => reactFlow.fitView({ padding: 0.3, minZoom: 0.5 }) },
  ];

  return (
    <Panel position="bottom-right" className="bg-background-base m-4 flex overflow-hidden rounded-full border">
      {items.map((item, i) => (
        <button
          onClick={() => item.onClick()}
          className={clsx(
            "hover:bg-background-component flex h-12 w-12 items-center justify-center border-r",
            i != 2 && "hidden md:flex"
          )}
          key={i}
        >
          {item.icon}
        </button>
      ))}
    </Panel>
  );
}
