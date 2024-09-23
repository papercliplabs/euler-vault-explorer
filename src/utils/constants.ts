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

export const VAULT_TYPE_INFO_MAPPING: Record<VaultType, { name: string; shortName: string; description: string }> = {
  escrowedCollateral: {
    name: "Escrow",
    shortName: "Escrow",
    description:
      "Escrow vaults hold deposits that can be used as collateral for taking out loans from other vaults, but do not earn their depositors interest because they do not allow borrowing. They are ungoverned.",
  },
  governed: {
    name: "Governed",
    shortName: "Governed",
    description:
      "Governed vaults hold deposits that can both be used as collateral and borrowed, earning depositors additional yield. A DAO, risk manager, or individual manages these vaults, controlling risk, interest rates, loan-to-value, and other risk parameters. They are suited for passive lenders who trust the governor's management.",
  },
  "ungoverned-0x": {
    name: "Ungoverned",
    shortName: "Ungoverned",
    description:
      "Ungoverned vaults hold deposits that can both be used as collateral and borrowed, earning depositors additional yield. These vaults have fixed parameters with no active governor to manage risk. They are suited for more active lenders who prefer to manage their own risk.",
  },
  "ungoverned-nzx": {
    name: "Ungoverned",
    shortName: "Ungoverned",
    description:
      "Ungoverned vaults hold deposits that can both be used as collateral and borrowed, earning depositors additional yield. These vaults have fixed parameters with no active governor to manage risk. They are suited for more active lenders who prefer to manage their own risk.",
  },
  factory: {
    name: "Unverified",
    shortName: "Unverified",
    description:
      "Unverified vaults have no distinguishing characteristics except that they were deployed using the main Euler Vault Kit (EVK) factory smart contract. This offers minimal guarantees about their functionality. This class of vaults is intended for advanced users only.",
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
};

export const U256_MAX: bigint = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
