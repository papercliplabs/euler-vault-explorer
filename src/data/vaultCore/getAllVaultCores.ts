"use server";
import { SupportedChainId, VaultCore } from "@/utils/types";
import { getAllVaultTypesAndAddresses } from "../vaultAddresses/getVaultAddresses";
import { VAULT_TYPE_MATCH_ORDER } from "@/utils/constants";
import { Address } from "viem";
import { getVaultCoreWithKnownType } from "./getVaultCore";

export async function getAllVaultCores(): Promise<VaultCore[]> {
  const allVaultTypesAndAddresses = await getAllVaultTypesAndAddresses();

  const set: Set<Address> = new Set();
  const promises: Promise<VaultCore | null>[] = [];
  for (const [chainId, record] of Object.entries(allVaultTypesAndAddresses)) {
    for (const type of VAULT_TYPE_MATCH_ORDER) {
      const addresses = record[type];
      for (const address of addresses) {
        if (!set.has(address)) {
          // Makes sure each vault is only considered once, and the type is the first in the match order
          set.add(address);
          promises.push(getVaultCoreWithKnownType(Number(chainId) as SupportedChainId, address, type));
        }
      }
    }
  }

  return (await Promise.all(promises)).filter((entry) => entry !== null);
}
