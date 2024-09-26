"use server";
import { getAllVaultCores } from "../vaultCore/getAllVaultCores";
import { Vault } from "@/utils/types";
import { getVaultForVaultCore } from "./helpers/getVaultForVaultCore";
import { getTokenImgSrcs } from "../token/getTokenImgSrc";
import { getTokenPrices } from "../token/getTokenPrices";

export async function getAllVaults(): Promise<Vault[]> {
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

  const vaults = await Promise.all(promises);

  return vaults.filter((entry) => entry !== null);
}
