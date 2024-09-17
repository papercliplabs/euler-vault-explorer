import { Address } from "viem";
import { SupportedChainId } from "./types";
import { CHAIN_CONFIGS } from "@/config";

export function etherscanLink(chainId: SupportedChainId, address: Address): string {
  return `${CHAIN_CONFIGS[chainId].publicClient.chain?.blockExplorers?.default.url}/address/${address}`;
}
