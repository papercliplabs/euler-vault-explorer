import { OracleType, VaultType } from "./types";

export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_DAY = SECONDS_PER_HOUR * 24;
export const SECONDS_PER_WEEK = SECONDS_PER_DAY * 7;
export const SECONDS_PER_MONTH = SECONDS_PER_DAY * 30;
export const SECONDS_PER_YEAR = SECONDS_PER_DAY * 365;

export const VAULT_TYPE_MATCH_ORDER: VaultType[] = [
  "escrowedCollateral",
  "governed",
  "ungoverned-0x",
  "ungoverned-nzx",
  "factory",
];

export const VAULT_TYPE_INFO_MAPPING: Record<VaultType, { name: string; shortName: string; description: string }> = {
  escrowedCollateral: {
    name: "Escrow",
    shortName: "Escrow",
    description:
      "Escrow vaults hold deposits that can be used as collateral for loans from other vaults. They don't earn interest or allow borrowing for depositors. These vaults are ungoverned.",
  },
  governed: {
    name: "Governed",
    shortName: "Governed",
    description:
      "Governed vaults allow deposits to be used as collateral and borrowed, earning depositors additional yield. A manager, such as a DAO or individual, controls the vault's settings. Suited for passive lenders who trust the governor's management.",
  },
  "ungoverned-0x": {
    name: "Ungoverned",
    shortName: "Ungoverned",
    description:
      "Ungoverned vaults allow deposits to be used as collateral and borrowed, earning depositors additional yield. These vaults have fixed parameters with no active governor to manage risk. Suited for more active lenders who prefer to manage their own risk.",
  },
  "ungoverned-nzx": {
    name: "Ungoverned",
    shortName: "Ungoverned",
    description:
      "Ungoverned vaults allow deposits to be used as collateral and borrowed, earning depositors additional yield. These vaults have fixed parameters with no active governor to manage risk. Suited for more active lenders who prefer to manage their own risk.",
  },
  factory: {
    name: "Unverified",
    shortName: "Unverified",
    description:
      "Unverified vaults have no distinguishing characteristics, except they are created using the Euler Vault Kit (EVK) smart contract. They offer minimal guarantees about how they work. They are intended for advanced users only.",
  },
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
  RateProviderOracle: { name: "Rate Provider" },
  FixedRateOracle: { name: "Fixed Rate" },
};

export const U256_MAX: bigint = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
