import TokenIcon from "./TokenIcon";
import ChainIcon from "./ChainIcon";
import { Vault } from "@/utils/types";
import Image from "next/image";

interface VaultIconProps {
  vault: Vault;
  size: number;
  badgeType?: "chain" | "entity";
}

export function VaultIcon({ vault, size, badgeType }: VaultIconProps) {
  return (
    <div className="relative h-fit w-fit shrink-0" style={{ paddingRight: badgeType ? size / 4 : 0 }}>
      <TokenIcon symbol={vault.underlyingAssetSymbol} imgSrc={vault.underlyingAssetImgSrc} size={size} />
      {badgeType === "chain" && (
        <ChainIcon
          chainId={vault.chainId}
          className="absolute bottom-0 right-0"
          style={{ width: Math.floor(size / 2), height: Math.floor(size / 2) }}
        />
      )}
      {badgeType === "entity" && vault.offchainLabel?.entityLogo && (
        <Image
          src={vault.offchainLabel.entityLogo}
          width={Math.floor(size / 2)}
          height={Math.floor(size / 2)}
          className="bg-background-base absolute bottom-0 right-0 shrink-0 rounded-full p-[1px]"
          alt=""
        />
      )}
    </div>
  );
}
