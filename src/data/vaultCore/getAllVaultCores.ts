"use server";
import { SupportedChainId, VaultCore, VaultType } from "@/utils/types";
import { getAllVaultTypesAndAddresses } from "./helpers/getVaultAddresses";
import { SECONDS_PER_HOUR, VAULT_TYPE_MATCH_ORDER } from "@/utils/constants";
import { Address, ReadContractReturnType } from "viem";
import { multicall } from "viem/actions";
import { CHAIN_CONFIGS } from "@/config";
import { vaultLensAbi } from "@/abis/vaultLensAbi";
import { mapInfoToVaultCore } from "./helpers/mapInfoToVaultCore";
import { cache } from "react";
import { safeUnstableCache } from "@/utils/safeFetch";

export type GetVaultInfoFullContractParams = {
  abi: typeof vaultLensAbi;
  address: Address;
  functionName: "getVaultInfoFull";
  args: [Address];
};

export type GetVaultInfoFullReturnType = ReadContractReturnType<typeof vaultLensAbi, "getVaultInfoFull">;

async function getVaultCoresForChainIdUncached(
  chainId: SupportedChainId,
  vaultTypeToAddresses: Record<VaultType, Address[]>
): Promise<VaultCore[]> {
  console.log("CACHE MISS: getVaultCoresForChainIdUncached");
  const multiInputs: { type: VaultType; address: Address }[] = [];

  const set: Set<Address> = new Set();
  for (const type of VAULT_TYPE_MATCH_ORDER) {
    const addresses = vaultTypeToAddresses[type];
    for (const address of addresses) {
      if (!set.has(address)) {
        // Makes sure each vault is only considered once, and the type is the first in the match order
        set.add(address);
        multiInputs.push({ type, address });
      }
    }
  }

  const vaultInfo = await multicall(CHAIN_CONFIGS[chainId as any as SupportedChainId].publicClient, {
    contracts: multiInputs.map(({ address }) => ({
      abi: vaultLensAbi,
      address: CHAIN_CONFIGS[chainId as any as SupportedChainId].addresses.lenses.vault,
      functionName: "getVaultInfoFull",
      args: [address],
    })) as GetVaultInfoFullContractParams[],
    allowFailure: false,
  });

  const vaultCores: VaultCore[] = [];
  for (const [i, info] of vaultInfo.entries()) {
    // Ignore vaults with no underlying asset symbol
    if (info.assetSymbol != "") {
      const inputs = multiInputs[i];

      vaultCores.push(mapInfoToVaultCore(chainId, inputs.address, inputs.type, info));
    }
  }

  return vaultCores;
}

const getVaultCoresForChainId = cache(
  safeUnstableCache(getVaultCoresForChainIdUncached, ["get-vault-cores-for-chain-id"], { revalidate: SECONDS_PER_HOUR })
);

export async function getAllVaultCores(): Promise<VaultCore[]> {
  const allVaultTypesAndAddresses = await getAllVaultTypesAndAddresses();

  const promises: Promise<VaultCore[] | null>[] = [];
  for (const [chainId, record] of Object.entries(allVaultTypesAndAddresses)) {
    const chainIdCasted = Number(chainId) as any as SupportedChainId;
    promises.push(getVaultCoresForChainId(chainIdCasted, record));
  }

  const vaultResp = await Promise.all(promises);
  return vaultResp.flat().filter((v) => v != null) as VaultCore[];
}
