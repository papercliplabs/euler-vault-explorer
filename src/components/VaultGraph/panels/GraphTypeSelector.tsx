import { Panel } from "@xyflow/react";
import clsx from "clsx";

export type GraphType = "collateralExposure" | "rehypothecation";

interface GraphTypeSelectorProps {
  graphType: GraphType;
  setGraphType: (graphType: GraphType) => void;
  disableCollateralExpose?: boolean;
}

export default function GraphTypeSelector({
  graphType,
  setGraphType,
  disableCollateralExpose,
}: GraphTypeSelectorProps) {
  const items: Record<string, { title: string; description: string }> = {
    ...(!disableCollateralExpose
      ? {
          collateralExposure: {
            title: "Collateral Exposure",
            description: "Collateral vaults to which this vault is exposed",
          },
        }
      : {}),
    rehypothecation: {
      title: "Using This Vault",
      description: "Vaults which accept this vault as collateral",
    },
  };

  return (
    <Panel className="bg-background-base left-0 right-0 m-4 flex w-[calc(100%-32px)] flex-col gap-1 rounded-2xl border p-2 md:w-fit">
      {Object.entries(items).map(([type, { title, description }], i) => (
        <button
          key={i}
          className={clsx(
            "body-xs flex flex-col gap-1 rounded-[8px] border px-3 py-2.5 text-start",
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
