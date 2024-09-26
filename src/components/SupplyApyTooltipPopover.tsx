import { SupplyRewards } from "@/utils/types";
import TooltipPopover from "./ui/tooltipPopover";
import { formatNumber } from "@/utils/format";
import Stars from "./Icons/core/Stars";
import Image from "next/image";

interface SupplyApyTooltipPopoverProps {
  supplyApy: number;
  rewards: SupplyRewards[];
}

export default function SupplyApyTooltipPopover({ supplyApy, rewards }: SupplyApyTooltipPopoverProps) {
  const netSupplyApy = supplyApy + rewards.reduce((acc, reward) => acc + reward.apy, 0);
  return (
    <TooltipPopover
      trigger={
        <div className="flex items-center gap-2">
          <span className="border-border-strong hocus:border-foreground-muted border-b border-dashed">
            {formatNumber({ input: netSupplyApy, unit: "%" })}
          </span>
          <Stars className="fill-foreground-muted h-[15px] w-[15px] p-0" />
        </div>
      }
    >
      <div className="body-md flex w-[272px] flex-col gap-3">
        <span className="body-lg font-medium">Rate and rewards</span>
        <div className="flex justify-between">
          <span className="text-foreground-subtle">Base rate</span>
          <span>{formatNumber({ input: supplyApy, unit: "%" })}</span>
        </div>
        {rewards.map((reward, i) => (
          <div className="flex items-center justify-between" key={i}>
            <div className="flex items-center gap-2">
              <span className="text-foreground-subtle">{reward.tokenSymbol}</span>
              <Image
                src={reward.tokenImgSrc}
                width={24}
                height={24}
                className="h-[24px] w-[24px] shrink-0 rounded-full"
                alt=""
              />
            </div>
            <span className="text-semantic-accent">
              {formatNumber({ input: reward.apy, unit: "%", forceSign: true })}
            </span>
          </div>
        ))}
        <div className="text-semantic-accent flex justify-between border-t pt-3">
          <span>Net Supply APY</span>
          <span>= {formatNumber({ input: netSupplyApy, unit: "%" })}</span>
        </div>
      </div>
    </TooltipPopover>
  );
}
