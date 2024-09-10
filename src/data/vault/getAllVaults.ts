"use server";
import { SupportedChainId, Vault } from "@/utils/types";
import { getAllVaultTypesAndAddresses } from "./helpers/getVaultAddresses";
import { getVaultWithKnownType } from "./getVault";
import { VAULT_TYPE_MATCH_ORDER } from "@/utils/constants";
import { Address } from "viem";
import { allVaultsOfflineData } from "./offline/allVaultsData";

export async function getAllVaults(): Promise<Vault[]> {
  const allVaultTypesAndAddresses = await getAllVaultTypesAndAddresses();

  const set: Set<Address> = new Set();
  const promises: Promise<Vault | null>[] = [];
  for (const [chainId, record] of Object.entries(allVaultTypesAndAddresses)) {
    for (const type of VAULT_TYPE_MATCH_ORDER) {
      const addresses = record[type];
      for (const address of addresses) {
        if (!set.has(address)) {
          // Makes sure each vault is only considered once, and the type is the first in the match order
          set.add(address);
          promises.push(getVaultWithKnownType(Number(chainId) as SupportedChainId, address, type));
        }
      }
    }
  }

  return (await Promise.all(promises)).filter((entry) => entry !== null);
}

export async function getAllVaultsOffline(): Promise<Vault[]> {
  return allVaultsOfflineData;
}
