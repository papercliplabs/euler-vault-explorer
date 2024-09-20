import EtherscanLink from "@/components/EtherscanLink";
import { ArrowLeft, ChainIcon, VaultTypeIcon } from "@/components/Icons";
import { VaultIcon } from "@/components/Icons/special/VaultIcon";
import Metric from "@/components/Metric";
import VaultGraph from "@/components/VaultGraph";
import { CHAIN_CONFIGS } from "@/config";
import { getAllVaults } from "@/data/vault/getAllVaults";
import { getVault } from "@/data/vault/getVault";
import { VAULT_TYPE_INFO_MAPPING } from "@/utils/constants";
import { formatNumber, formatVaultName } from "@/utils/format";
import { SupportedChainId } from "@/utils/types";
import Link from "next/link";
import { Suspense } from "react";
import { Address, getAddress } from "viem";

export default function VaultPage({ params }: { params: { chainId: string; vaultAddress: string } }) {
  const chainId = params.chainId as any as SupportedChainId;
  const vaultAddress = getAddress(params.vaultAddress);
  if (!CHAIN_CONFIGS[chainId]) {
    throw Error(`ChainId ${chainId} is not supported`);
  }

  return (
    <div className="flex w-full flex-col gap-6 p-[2px]">
      <Suspense fallback={"LOADING"}>
        <VaultPageWrapper chainId={chainId} vaultAddress={vaultAddress} />
      </Suspense>
    </div>
  );
}

async function VaultPageWrapper({ chainId, vaultAddress }: { chainId: SupportedChainId; vaultAddress: Address }) {
  const [vault, allVaults] = await Promise.all([getVault(chainId, vaultAddress), getAllVaults()]);

  if (!vault) {
    throw Error(`Vault ${vaultAddress} not found on chain ${chainId}`);
  }

  return (
    <>
      <div className="text-foreground-muted flex items-center gap-2">
        <Link href="/" className="group flex items-center gap-1">
          <ArrowLeft className="stroke-foreground-muted group-hover:stroke-semantic-accent h-5 w-5" />
          <span className="group-hover:text-semantic-accent">Vaults</span>
        </Link>
        <span>/</span>
        <span>{formatVaultName({ vault, removeStyle: true })}</span>
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        <VaultIcon vault={vault} size={64} badgeType="entity" />
        <div className="flex flex-col justify-center gap-2">
          <h3>{formatVaultName({ vault, full: true })}</h3>
          <span className="text-foreground-muted">{vault.offchainLabel?.description}</span>
        </div>
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:gap-12">
        <Metric
          title="Total Supplied"
          popoverText="TOOD"
          primaryValue={
            vault.totalSuppliedUsd != undefined
              ? formatNumber({ input: vault.totalSuppliedUsd, unit: "USD", compact: true })
              : "-"
          }
          secondaryValue={formatNumber({
            input: vault.totalSupplied,
            unit: vault.underlyingAssetSymbol,
            compact: true,
          })}
        />
        {vault.type != "escrowedCollateral" && (
          <Metric
            title="Supply APR"
            popoverText="TOOD"
            primaryValue={formatNumber({ input: vault.supplyApy, unit: "%" })}
          />
        )}
        {vault.type != "escrowedCollateral" && (
          <Metric
            title="Total Borrowed"
            popoverText="TOOD"
            primaryValue={
              vault.totalBorrowedUsd != undefined
                ? formatNumber({ input: vault.totalBorrowedUsd, unit: "USD", compact: true })
                : "-"
            }
            secondaryValue={formatNumber({
              input: vault.totalBorrowed,
              unit: vault.underlyingAssetSymbol,
              compact: true,
            })}
          />
        )}
        {vault.type != "escrowedCollateral" && (
          <Metric
            title="Borrow APR"
            popoverText="TOOD"
            primaryValue={formatNumber({ input: vault.borrowApy, unit: "%" })}
          />
        )}
        {vault.type != "escrowedCollateral" && (
          <Metric
            title="Utilization"
            popoverText="TOOD"
            primaryValue={formatNumber({ input: vault.utilization, unit: "%" })}
          />
        )}
      </div>
      <div className="flex flex-col gap-4 pt-4">
        <div className="flex flex-col gap-2">
          <h4>Vault Collateral Relationship</h4>
          <span className="text-foreground-muted max-w-[776px]">
            This graph illustrates the collateral relationships between credit vaults. While rehypothecation boosts
            capital efficiency, it also introduces additional risk. Our goal is to provide transparency, helping users
            better assess collateral risk.
          </span>
          <VaultGraph vault={vault} allVaults={allVaults} />
        </div>
        <div className="bg-background-component flex flex-col gap-6 rounded-[24px] p-6">
          <h4>Vault Configuration</h4>
          <div className="flex grow auto-rows-min grid-cols-[repeat(auto-fill,minmax(164px,1fr))] flex-wrap items-stretch justify-stretch gap-6 md:grid md:gap-12">
            <Metric
              title="Chain"
              popoverText="TOOD"
              primaryValue={
                <div className="flex items-center gap-2">
                  <ChainIcon chainId={vault.chainId} className="h-5 w-5 shrink-0" />
                  {CHAIN_CONFIGS[vault.chainId].publicClient.chain?.name ?? "UNKNOWN"}
                </div>
              }
            />
            <Metric
              title="Underling Asset"
              popoverText="TOOD"
              primaryValue={
                <EtherscanLink chainId={vault.chainId} address={vault.underlyingAssetAddress}>
                  {vault.underlyingAssetSymbol}
                </EtherscanLink>
              }
            />
            <Metric
              title="Vault type"
              popoverText="TOOD"
              primaryValue={
                <div className="flex items-center gap-1">
                  <VaultTypeIcon type={vault.type} className="fill-foreground-subtle" />
                  {VAULT_TYPE_INFO_MAPPING[vault.type].name}
                </div>
              }
            />
            {vault.type != "escrowedCollateral" && (
              <Metric
                title="Oracle"
                popoverText="TOOD"
                primaryValue={<EtherscanLink chainId={vault.chainId} address={vault.oracleAddress} />}
              />
            )}
            {vault.type != "escrowedCollateral" && (
              <Metric
                title="Interest Rate Model"
                popoverText="TOOD"
                primaryValue={<EtherscanLink chainId={vault.chainId} address={vault.interestRateModelAddress} />}
              />
            )}
            <Metric
              title="Governor"
              popoverText="TOOD"
              primaryValue={
                vault.governor ? <EtherscanLink chainId={vault.chainId} address={vault.governor} /> : "None"
              }
            />
            <Metric
              title="Supply Cap"
              popoverText="TOOD"
              primaryValue={
                vault.supplyCap != undefined
                  ? formatNumber({ input: vault.supplyCap, unit: vault.underlyingAssetSymbol, compact: true })
                  : "None"
              }
            />
            {vault.type != "escrowedCollateral" && (
              <Metric
                title="Borrow Cap"
                popoverText="TOOD"
                primaryValue={
                  vault.borrowCap != undefined
                    ? formatNumber({ input: vault.borrowCap, unit: vault.underlyingAssetSymbol, compact: true })
                    : "None"
                }
              />
            )}
            <Metric
              title="Vault Fee"
              popoverText="TOOD"
              primaryValue={formatNumber({ input: vault.vaultFee, unit: "%" })}
            />
            {vault.type != "escrowedCollateral" && (
              <Metric
                title="Max liquidation discount"
                popoverText="TOOD"
                primaryValue={formatNumber({ input: vault.maxLiquidationDiscount, unit: "%" })}
              />
            )}
            <Metric title="Unit of account" popoverText="TOOD" primaryValue={vault.unitOfAccountSymbol} />
          </div>
        </div>
      </div>
    </>
  );
}
