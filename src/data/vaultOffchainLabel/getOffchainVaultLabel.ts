"use server";
import { SECONDS_PER_DAY } from "@/utils/constants";
import { safeUnstableCache } from "@/utils/safeFetch";
import { OffchainVaultLabel, SupportedChainId } from "@/utils/types";
import { cache } from "react";
import { Address } from "viem";

const BASE_LABEL_URL = "https://raw.githubusercontent.com/euler-xyz/euler-labels/master";

interface RawEulerVaultLabel {
  name: string;
  description: string;
  entity: string | string[];
}

async function getRawEulerVaultLabelsUncached(
  chainId: SupportedChainId
): Promise<Record<Address, RawEulerVaultLabel | undefined>> {
  const resp = await fetch(`${BASE_LABEL_URL}/${chainId}/vaults.json`, {
    cache: "no-cache",
  });
  const data = (await resp.json()) as Record<Address, RawEulerVaultLabel>;
  return data;
}

const getRawEulerVaultLabels = cache(
  safeUnstableCache(getRawEulerVaultLabelsUncached, ["get-euler-vault-labels"], { revalidate: SECONDS_PER_DAY })
);

interface RawEulerEntityLabel {
  name: string;
  logo?: string;
  description?: string;
}

async function getRawEulerEntityLabelsUncached(
  chainId: SupportedChainId
): Promise<Record<string, RawEulerEntityLabel | undefined>> {
  const resp = await fetch(`${BASE_LABEL_URL}/${chainId}/entities.json`, { cache: "no-cache" });
  const data = (await resp.json()) as Record<string, RawEulerEntityLabel>;
  return data;
}

const getRawEulerEntityLabels = cache(
  safeUnstableCache(getRawEulerEntityLabelsUncached, ["get-euler-entity-labels"], { revalidate: SECONDS_PER_DAY })
);

export async function getOffchainVaultLabel(
  chainId: SupportedChainId,
  vaultAddress: Address
): Promise<OffchainVaultLabel | undefined> {
  const vaultLabels = await getRawEulerVaultLabels(chainId);
  const vaultLabel = vaultLabels?.[vaultAddress];

  if (!vaultLabel) {
    return undefined;
  }

  const entity = typeof vaultLabel.entity == "string" ? vaultLabel.entity : vaultLabel.entity[0];
  const entityLabels = await getRawEulerEntityLabels(chainId);
  const entityLabel = entityLabels?.[entity];

  if (!entityLabel) {
    return undefined;
  }

  return {
    name: vaultLabel.name,
    description: vaultLabel.description,

    entityName: entityLabel.name,
    entityLogo: entityLabel.logo ? `${BASE_LABEL_URL}/logo/${entityLabel.logo}` : undefined,
    entityDescription: entityLabel?.description,
  };
}
