"use server";
import { SupportedChainId, Vault } from "@/utils/types";
import { Address } from "viem";
import { getAllVaults } from "./getAllVaults";

export async function getVault(chainId: SupportedChainId, address: Address): Promise<Vault | null> {
  const allVaults = await getAllVaults();
  return allVaults.find((vault) => Number(vault.chainId) === Number(chainId) && vault.address === address) ?? null;
}
