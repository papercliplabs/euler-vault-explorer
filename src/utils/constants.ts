import { VaultType } from "./types";

export const VAULT_TYPE_MATCH_ORDER: VaultType[] = [
  "escrowedCollateral",
  "governed",
  "ungoverned-0x",
  "ungoverned-nzx",
  "factory",
];

export const U256_MAX: bigint = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
