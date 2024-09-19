"use server";
import { getAllVaultCores } from "../vaultCore/getAllVaultCores";
import { Vault } from "@/utils/types";
import { getVaultForVaultCore } from "./getVaultForVaultCore";
import { getTokenImgSrcs } from "../token/getTokenImgSrc";
import { getTokenPrices } from "../token/getTokenPrices";
import { allVaultsOffline } from "./offlineData";

export async function getAllVaults(): Promise<Vault[]> {
  // TODO: remove this, for dev only
  // return allVaultsOffline;

  const allVaultCores = await getAllVaultCores();

  const underlyingSymbols = allVaultCores.map((vaultCore) => vaultCore.underlyingAssetSymbol);
  const unitOfAccountSymbols = allVaultCores.map((vaultCore) => vaultCore.unitOfAccountSymbol);

  const [imgSrcs, underlyingPrices, unitOfAccountPrices] = await Promise.all([
    getTokenImgSrcs(underlyingSymbols),
    getTokenPrices(underlyingSymbols),
    getTokenPrices(unitOfAccountSymbols),
  ]);

  const promises: Promise<Vault | null>[] = [];
  for (let [i, vaultCore] of allVaultCores.entries()) {
    promises.push(getVaultForVaultCore(vaultCore, imgSrcs[i], underlyingPrices[i], unitOfAccountPrices[i]));
  }

  return (await Promise.all(promises)).filter((entry) => entry !== null);
}
