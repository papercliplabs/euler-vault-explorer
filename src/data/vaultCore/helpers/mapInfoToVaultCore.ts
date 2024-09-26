import { Oracle, OracleType, SupportedChainId, VaultCore, VaultType } from "@/utils/types";
import { Address, formatUnits, isAddressEqual, zeroAddress } from "viem";
import { GetVaultInfoFullReturnType } from "../getAllVaultCores";
import currencyCodes from "currency-codes";
import { decodeEulerRouterOracle, decodeOracleInfo } from "./oracle";
import { U256_MAX } from "@/utils/constants";

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

export function mapInfoToVaultCore(
  chainId: SupportedChainId,
  address: Address,
  type: VaultType,
  vaultInfo: GetVaultInfoFullReturnType
): VaultCore {
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
    underlyingAssetOracle = decodeOracleInfo(
      vaultInfo.oracleInfo.name as OracleType,
      vaultInfo.oracleInfo.oracle,
      vaultInfo.oracleInfo.oracleInfo
    )?.[0];
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
    vaultDecimals: Number(vaultInfo.vaultDecimals),

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

    governor: isAddressEqual(vaultInfo.governorAdmin, zeroAddress) ? undefined : vaultInfo.governorAdmin,

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
