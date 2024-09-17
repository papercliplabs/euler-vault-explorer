import { Address } from "viem";

export type BigIntString = string;

export type VaultType = "escrowedCollateral" | "ungoverned-0x" | "ungoverned-nzx" | "governed" | "factory";

export type OracleType =
  | "EulerRouter"
  | "ChainlinkOracle"
  | "ChronicleOracle"
  | "LidoOracle"
  | "LidoFundamentalOracle"
  | "PythOracle"
  | "RedstoneCoreOracle"
  | "UniswapV3Oracle"
  | "CrossAdapter";

export type SupportedChainId = 1;

export interface Oracle extends Record<string, any> {
  type: OracleType;
  sourceAddress: Address; // Contract where price comes from (feed or pool)
  //   baseAddress: Address;
  //   quoteAddress: Address;
}

export interface Collateral {
  chainId: SupportedChainId;
  collateralVaultAddress: Address;

  borrowLoanToValue: number; // %
  liquidationLoanToValue: number; // %

  oracle?: Oracle;
}

// Offchain label
export interface OffchainVaultLabel {
  name: string;
  description: string;

  entityName: string;
  entityLogo?: string;
  entityDescription?: string;
}

export interface Vault {
  chainId: SupportedChainId;
  type: VaultType;
  address: Address;

  name: string;
  symbol: string;
  id: string;
  offchainLabel?: OffchainVaultLabel;

  underlyingAssetAddress: Address;
  underlyingAssetName: string;
  underlyingAssetSymbol: string;
  underlyingAssetImgSrc: string | null;

  unitOfAccountAddress: Address;
  unitOfAccountSymbol: string;
  unitOfAccountIsFiat: boolean;

  debtTokenAddress: Address;

  governor?: Address;
  upgradable?: boolean; // TODO: not in VaultInfoFull

  oracleAddress: Address;
  underlyingAssetOracle?: Oracle;

  interestRateModelAddress: Address;

  collateral: Collateral[];

  vaultFee: number; // %
  maxLiquidationDiscount: number; // %

  supplyCap?: number; // In underlying asset, undefined if no cap
  borrowCap?: number; // In underlying asset, undefined if no cap

  // State
  totalSupplied: number; // In underlying asset
  totalBorrowed: number; // In underlying asset

  totalSuppliedUsd?: number;
  totalBorrowedUsd?: number;

  utilization: number;

  shares: number;

  supplyApy: number;
  borrowApy: number;
}
