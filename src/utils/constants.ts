import { OracleType, VaultType } from "./types";

export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;
export const SECONDS_PER_WEEK = SECONDS_PER_DAY * 7;
export const SECONDS_PER_MONTH = SECONDS_PER_DAY * 30;

export const VAULT_TYPE_MATCH_ORDER: VaultType[] = [
  "escrowedCollateral",
  "governed",
  "ungoverned-0x",
  "ungoverned-nzx",
  "factory",
];

export const VAULT_TYPE_INFO_MAPPING: Record<VaultType, { name: string; shortName: string }> = {
  escrowedCollateral: { name: "Escrow", shortName: "Escrow" },
  governed: { name: "Governed", shortName: "Governed" },
  "ungoverned-0x": { name: "Ungoverned", shortName: "Ungoverned" },
  "ungoverned-nzx": { name: "Ungoverned", shortName: "Ungoverned" },
  factory: { name: "Unverified", shortName: "Unverified" },
};

export const ORACLE_TYPE_INFO_MAPPING: Record<OracleType, { name: string }> = {
  EulerRouter: { name: "Euler" },
  ChainlinkOracle: { name: "Chainlink" },
  ChronicleOracle: { name: "Chronicle" },
  LidoOracle: { name: "Lido" },
  LidoFundamentalOracle: { name: "Lido" },
  PythOracle: { name: "Pyth" },
  RedstoneCoreOracle: { name: "Redstone" },
  UniswapV3Oracle: { name: "UniswapV3" },
  CrossAdapter: { name: "Cross Adapter" },
};

export const U256_MAX: bigint = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
