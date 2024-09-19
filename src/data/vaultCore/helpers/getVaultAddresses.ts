"use server";
import { perspectiveAbi } from "@/abis/perspectiveAbi";
import { CHAIN_CONFIGS } from "@/config";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { SupportedChainId, VaultType } from "@/utils/types";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { Address } from "viem";
import { readContract } from "viem/actions";

async function getVaultAddressesForTypeUncached(chainId: SupportedChainId, type: VaultType): Promise<Address[]> {
  const chainConfig = CHAIN_CONFIGS[chainId];
  const perspectiveAddress = chainConfig.addresses.perspectives[type];

  const addresses = await readContract(chainConfig.publicClient, {
    abi: perspectiveAbi,
    address: perspectiveAddress,
    functionName: "verifiedArray",
  });

  return addresses as Address[];
}

const getVaultAddressesForType = cache(
  unstable_cache(getVaultAddressesForTypeUncached, ["get-vault-addresses-for-type"], {
    revalidate: SECONDS_PER_DAY,
  })
);

async function getVaultTypesAndAddresses(chainId: SupportedChainId): Promise<Record<VaultType, Address[]>> {
  const chainConfig = CHAIN_CONFIGS[chainId];

  const addressPromises = Object.keys(chainConfig.addresses.perspectives).map(async (type) => {
    const addresses = await getVaultAddressesForType(chainId, type as VaultType);
    return { type: type as VaultType, addresses };
  });

  const resolvedAddresses = await Promise.all(addressPromises);

  return resolvedAddresses.reduce(
    (acc, { type, addresses }) => {
      acc[type] = addresses;
      return acc;
    },
    {} as Record<VaultType, Address[]>
  );
}

export async function getAllVaultTypesAndAddresses(): Promise<Record<SupportedChainId, Record<VaultType, Address[]>>> {
  const promises = Object.values(CHAIN_CONFIGS).map(async (config) => {
    return { chainId: config.chainId, addresses: await getVaultTypesAndAddresses(config.chainId) };
  });

  const resolvedAddresses = await Promise.all(promises);

  return resolvedAddresses.reduce(
    (acc, { chainId, addresses }) => {
      acc[chainId] = addresses;
      return acc;
    },
    {} as Record<SupportedChainId, Record<VaultType, Address[]>>
  );
}
