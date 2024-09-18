"use server";
import { vaultLensAbi } from "@/abis/vaultLensAbi";
import { CHAIN_CONFIGS } from "@/config";
import { Oracle, OracleType, SupportedChainId, VaultCore, VaultType } from "@/utils/types";
import { Address, formatUnits, isAddressEqual, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { getVaultType } from "../vaultAddresses/getVaultAddresses";
import { SECONDS_PER_HOUR, U256_MAX } from "@/utils/constants";
import currencyCodes from "currency-codes";
import { decodeEulerRouterOracle, decodeOracleInfo } from "./helpers/oracle";
import { unstable_cache } from "next/cache";
import { cache } from "react";

const IRM_DECIMALS = 27;
const CONFIG_SCALE_DECIMALS = 4;

function inferUnitOfAccountSymbol(
  unitOfAccount: Address,
  providedUnitOfAccountSymbol: string
): { unitOfAccountSymbol: string; unitOfAccountIsFiat: boolean } {
  if (providedUnitOfAccountSymbol != "") {
    return { unitOfAccountSymbol: providedUnitOfAccountSymbol, unitOfAccountIsFiat: false };
  } else {
    if (isAddressEqual(unitOfAccount, zeroAddress)) {
      return { unitOfAccountSymbol: "ETH", unitOfAccountIsFiat: false };
    } else {
      const currencyCode = currencyCodes.number(parseInt(unitOfAccount, 16).toString())?.code;
      if (currencyCode) {
        return { unitOfAccountSymbol: currencyCode, unitOfAccountIsFiat: true };
      } else {
        return { unitOfAccountSymbol: "UNKNOWN", unitOfAccountIsFiat: false };
      }
    }
  }
}

async function getVaultCoreWithKnownTypeUncached(
  chainId: SupportedChainId,
  address: Address,
  type: VaultType
): Promise<VaultCore | null> {
  console.log("CACHE MISS - getVaultCoreWithKnownTypeUncached", address);
  const chainConfig = CHAIN_CONFIGS[chainId];
  const vaultLensAddress = chainConfig.addresses.lenses.vault;

  const vaultInfo = await readContract(chainConfig.publicClient, {
    abi: vaultLensAbi,
    address: vaultLensAddress,
    functionName: "getVaultInfoFull",
    args: [address],
  });

  const { unitOfAccountSymbol, unitOfAccountIsFiat } = inferUnitOfAccountSymbol(
    vaultInfo.unitOfAccount,
    vaultInfo.unitOfAccountSymbol
  );

  let underlyingAssetOracle: Oracle | undefined = undefined;
  let collateralOracles: Oracle[] | undefined = undefined; // Same order as collateral
  if (vaultInfo.oracleInfo.name == "EulerRouter") {
    const oracles = decodeEulerRouterOracle(vaultInfo.oracleInfo.oracleInfo);
    if (oracles.length == vaultInfo.collateralPriceInfo.length + 1) {
      underlyingAssetOracle = oracles[0];
      collateralOracles = oracles.slice(1);
    } else {
      console.error("Wrong number of oracles");
    }
  } else {
    underlyingAssetOracle = decodeOracleInfo(vaultInfo.oracleInfo.name as OracleType, vaultInfo.oracleInfo.oracleInfo);
  }

  const totalSupplied = Number(formatUnits(vaultInfo.totalAssets, Number(vaultInfo.assetDecimals)));
  const totalBorrowed = Number(formatUnits(vaultInfo.totalBorrowed, Number(vaultInfo.assetDecimals)));

  let underlyingAssetToUnitOfAccountPrice: number | undefined = undefined;
  const liabilityPriceInfo = vaultInfo.liabilityPriceInfo;
  if (!liabilityPriceInfo.queryFailure) {
    underlyingAssetToUnitOfAccountPrice = Number(
      formatUnits(
        (BigInt(10 ** Number(vaultInfo.assetDecimals)) / liabilityPriceInfo.amountIn) * liabilityPriceInfo.amountOutMid,
        Number(vaultInfo.unitOfAccountDecimals)
      )
    );
  }

  return {
    chainId,
    type,
    address,

    name: vaultInfo.vaultName,
    symbol: vaultInfo.vaultSymbol,
    id: vaultInfo.vaultSymbol.split("-").pop()?.padStart(3, "0") ?? "",

    underlyingAssetAddress: vaultInfo.asset,
    underlyingAssetName: vaultInfo.assetName,
    underlyingAssetSymbol: vaultInfo.assetSymbol,
    underlyingAssetDecimals: Number(vaultInfo.assetDecimals),
    underlyingAssetToUnitOfAccountPrice,

    unitOfAccountAddress: vaultInfo.unitOfAccount,
    unitOfAccountSymbol,
    unitOfAccountIsFiat,
    unitOfAccountDecimals: Number(vaultInfo.unitOfAccountDecimals),

    debtTokenAddress: vaultInfo.dToken,

    governor: vaultInfo.governorAdmin,
    // upgradable: vaultInfo.,

    oracleAddress: vaultInfo.oracle,
    underlyingAssetOracle,

    interestRateModelAddress: vaultInfo.interestRateModel,

    collateral: vaultInfo.collateralLTVInfo.map((entry, i) => ({
      chainId,
      collateralVaultAddress: entry.collateral,
      borrowLoanToValue: Number(formatUnits(entry.borrowLTV, CONFIG_SCALE_DECIMALS)),
      liquidationLoanToValue: Number(formatUnits(entry.liquidationLTV, CONFIG_SCALE_DECIMALS)),
      oracle: collateralOracles?.[i],
    })),

    vaultFee: Number(formatUnits(vaultInfo.interestFee ?? 0, CONFIG_SCALE_DECIMALS)),
    maxLiquidationDiscount: Number(formatUnits(vaultInfo.maxLiquidationDiscount ?? 0, CONFIG_SCALE_DECIMALS)),

    supplyCap:
      vaultInfo.supplyCap == U256_MAX
        ? undefined
        : Number(formatUnits(vaultInfo.supplyCap, Number(vaultInfo.assetDecimals))),
    borrowCap:
      vaultInfo.borrowCap == U256_MAX
        ? undefined
        : Number(formatUnits(vaultInfo.borrowCap, Number(vaultInfo.assetDecimals))),

    totalSupplied,
    totalBorrowed,

    utilization: totalSupplied == 0 ? 0 : totalBorrowed / totalSupplied,

    shares: Number(formatUnits(vaultInfo.totalShares, Number(vaultInfo.vaultDecimals))),

    supplyApy: Number(formatUnits(vaultInfo.irmInfo.interestRateInfo[0]?.supplyAPY ?? 0, IRM_DECIMALS)),
    borrowApy: Number(formatUnits(vaultInfo.irmInfo.interestRateInfo[0]?.borrowAPY ?? 0, IRM_DECIMALS)),
  };
}

export const getVaultCoreWithKnownType = cache(
  unstable_cache(getVaultCoreWithKnownTypeUncached, ["get-vault-core-with-known-type"], {
    revalidate: SECONDS_PER_HOUR,
  })
);

export async function getVaultCore(chainId: SupportedChainId, address: Address): Promise<VaultCore | null> {
  const type = await getVaultType(chainId, address);
  if (!type) {
    return null;
  }

  return getVaultCoreWithKnownType(chainId, address, type);
}
