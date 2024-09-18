"use server";
import { SECONDS_PER_DAY, SECONDS_PER_HOUR } from "@/utils/constants";
import { OffchainVaultLabel, SupportedChainId } from "@/utils/types";
import { Address } from "viem";

const BASE_LABEL_URL = "https://raw.githubusercontent.com/euler-xyz/euler-labels/master";

interface RawEulerVaultLabel {
  name: string;
  description: string;
  entity: string | string[];
}

async function getRawEulerVaultLabels(
  chainId: SupportedChainId
): Promise<Record<Address, RawEulerVaultLabel | undefined>> {
  const resp = await fetch(`${BASE_LABEL_URL}/${chainId}/vaults.json`, {
    next: { revalidate: SECONDS_PER_HOUR },
  });
  const data = (await resp.json()) as Record<Address, RawEulerVaultLabel>;
  return data;
}

interface RawEulerEntityLabel {
  name: string;
  logo?: string;
  description?: string;
}

async function getRawEulerEntityLabels(
  chainId: SupportedChainId
): Promise<Record<string, RawEulerEntityLabel | undefined>> {
  const resp = await fetch(`${BASE_LABEL_URL}/${chainId}/entities.json`, { next: { revalidate: SECONDS_PER_DAY } });
  const data = (await resp.json()) as Record<string, RawEulerEntityLabel>;
  return data;
}

export async function getOffchainVaultLabel(
  chainId: SupportedChainId,
  vaultAddress: Address
): Promise<OffchainVaultLabel | undefined> {
  const vaultLabels = await getRawEulerVaultLabels(chainId);
  const vaultLabel = vaultLabels[vaultAddress];

  if (!vaultLabel) {
    return undefined;
  }

  const entity = typeof vaultLabel.entity == "string" ? vaultLabel.entity : vaultLabel.entity[0];
  const entityLabels = await getRawEulerEntityLabels(chainId);
  const entityLabel = entityLabels[entity];

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
