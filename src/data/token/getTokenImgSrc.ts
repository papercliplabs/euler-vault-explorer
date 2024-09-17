"use server";
import { SupportedChainId } from "@/utils/types";
import { Address, isAddressEqual } from "viem";
import { getCoinGeckoTokenImgSrc } from "./helpers/coinGecko";
import { CHAIN_CONFIGS } from "@/config";

export async function getTokenImgSrc(chainId: SupportedChainId, address: Address): Promise<string | null> {
  const config = CHAIN_CONFIGS[chainId];
  if (isAddressEqual(config.addresses.wrappedNativeAsset, address)) {
    return config.nativeTokenImgSrc;
  }

  return getCoinGeckoTokenImgSrc(chainId, address);
}
