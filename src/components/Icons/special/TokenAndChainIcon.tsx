import TokenIcon from "./TokenIcon";
import ChainIcon from "./ChainIcon";
import { SupportedChainId } from "@/utils/types";

interface TokenAndChainIconProps {
  chainId: SupportedChainId;
  tokenSymbol: string;
  tokenImgSrc: string | null;
  size: number;
}

export function TokenAndChainIcon({ chainId, tokenSymbol, tokenImgSrc, size }: TokenAndChainIconProps) {
  return (
    <div className="relative h-fit w-fit" style={{ paddingRight: size / 8 }}>
      <TokenIcon symbol={tokenSymbol} imgSrc={tokenImgSrc} size={size} />
      <ChainIcon
        chainId={chainId}
        className="absolute bottom-0 right-0"
        style={{ width: Math.floor(size / 2.66), height: Math.floor(size / 2.66) }}
      />
    </div>
  );
}
