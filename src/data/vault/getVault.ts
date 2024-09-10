"use server";
import { vaultLensAbi } from "@/abis/vaultLensAbi";
import { CHAIN_CONFIGS } from "@/config";
import { Oracle, OracleType, SupportedChainId, Vault, VaultType } from "@/utils/types";
import { Address, formatUnits, isAddressEqual, zeroAddress } from "viem";
import { readContract } from "viem/actions";
import { getVaultType } from "./helpers/getVaultAddresses";
import { U256_MAX } from "@/utils/constants";
import currencyCodes from "currency-codes";
import { decodeEulerRouterOracle, decodeOracleInfo } from "./helpers/oracle";

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

export async function getVaultWithKnownType(
  chainId: SupportedChainId,
  address: Address,
  type: VaultType
): Promise<Vault | null> {
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

  return {
    chainId,
    type,
    address,

    name: vaultInfo.vaultName,
    symbol: vaultInfo.vaultSymbol,

    underlyingAssetAddress: vaultInfo.asset,
    underlyingAssetName: vaultInfo.assetName,
    underlyingAssetSymbol: vaultInfo.assetSymbol,

    unitOfAccountAddress: vaultInfo.unitOfAccount,
    unitOfAccountSymbol,
    unitOfAccountIsFiat,

    debtTokenAddress: vaultInfo.dToken,

    governor: vaultInfo.governorAdmin,
    // upgradable: vaultInfo.,

    oracleAddress: vaultInfo.oracle,
    underlyingAssetOracle,

    interestRateModelAddress: vaultInfo.interestRateModel,

    collateral: vaultInfo.collateralLTVInfo.map((entry, i) => ({
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

    // TODO: need another oracle for this overwise
    totalSuppliedUsd: unitOfAccountSymbol == "USD" ? totalSupplied : undefined,
    totalBorrowedUsd: unitOfAccountSymbol == "USD" ? totalBorrowed : undefined,

    utilization: totalSupplied == 0 ? 0 : totalBorrowed / totalSupplied,

    shares: Number(formatUnits(vaultInfo.totalShares, Number(vaultInfo.vaultDecimals))),

    supplyApy: Number(formatUnits(vaultInfo.irmInfo.interestRateInfo[0]?.supplyAPY ?? 0, IRM_DECIMALS)),
    borrowApy: Number(formatUnits(vaultInfo.irmInfo.interestRateInfo[0]?.borrowAPY ?? 0, IRM_DECIMALS)),
  };
}

export async function getVault(chainId: SupportedChainId, address: Address): Promise<Vault | null> {
  const type = await getVaultType(chainId, address);
  if (!type) {
    return null;
  }

  return getVaultWithKnownType(chainId, address, type);
}
