import { Panel } from "@xyflow/react";
import clsx from "clsx";

export type GraphType = "collateralExposure" | "rehypothecation";

interface GraphTypeSelectorProps {
  graphType: GraphType;
  setGraphType: (graphType: GraphType) => void;
}

export default function GraphTypeSelector({ graphType, setGraphType }: GraphTypeSelectorProps) {
  const items: Record<GraphType, { title: string; description: string }> = {
    collateralExposure: {
      title: "Collateral Exposure",
      description: "Collateral vaults to which this vault is exposed",
    },
    rehypothecation: {
      title: "Rehypothecation",
      description: "Vaults which accept this vault as collateral",
    },
  };

  return (
    <Panel className="bg-background-base flex flex-col gap-1 rounded-2xl border p-2">
      {Object.entries(items).map(([type, { title, description }], i) => (
        <button
          key={i}
          className={clsx(
            "body-xs flex flex-col gap-1 rounded-[8px] border px-3 py-2.5",
            type == graphType
              ? "bg-background-component border-border-base"
              : "hover:bg-background-subtle border-transparent"
          )}
          onClick={() => setGraphType(type as GraphType)}
        >
          <span className="font-medium">{title}</span>
          <span className="text-foreground-subtle">{description}</span>
        </button>
      ))}
    </Panel>
  );
}
