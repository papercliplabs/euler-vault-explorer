"use server";
import { SupportedChainId } from "@/utils/types";
import { Address } from "viem";
import { getCoinGeckoTokenImgSrc } from "./helpers/coinGecko";

export async function getTokenImgSrc(chainId: SupportedChainId, address: Address): Promise<string | null> {
  return getCoinGeckoTokenImgSrc(chainId, address);
}
