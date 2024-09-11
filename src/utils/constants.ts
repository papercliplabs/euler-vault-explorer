import { VaultType } from "./types";

export const VAULT_TYPE_MATCH_ORDER: VaultType[] = [
  "escrowedCollateral",
  "governed",
  "ungoverned-0x",
  "ungoverned-nzx",
  "factory",
];

export const VAULT_TYPE_NAME_MAPPING: Record<VaultType, string> = {
  escrowedCollateral: "Escrowed Collateral",
  governed: "Governed",
  "ungoverned-0x": "Ungoverned",
  "ungoverned-nzx": "Ungoverned",
  factory: "Unverified",
};

export const U256_MAX: bigint = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
