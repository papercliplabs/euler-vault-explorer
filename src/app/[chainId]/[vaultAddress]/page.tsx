import { ArrowLeft, TokenAndChainIcon } from "@/components/Icons";
import Metric from "@/components/Metric";
import VaultGraph from "@/components/VaultGraph";
import { CHAIN_CONFIGS } from "@/config";
import { getAllVaults, getAllVaultsOffline } from "@/data/vault/getAllVaults";
import { getVault } from "@/data/vault/getVault";
import { VAULT_TYPE_NAME_MAPPING } from "@/utils/constants";
import { formatAddress, formatNumber } from "@/utils/format";
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
  const [vault, allVaults] = await Promise.all([getVault(chainId, vaultAddress), getAllVaultsOffline()]);

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
        <span>{vault.symbol}</span>
      </div>
      <div className="flex gap-4">
        <TokenAndChainIcon
          chainId={chainId}
          tokenSymbol={vault.underlyingAssetSymbol}
          tokenImgSrc={vault.underlyingAssetImgSrc}
          size={64}
        />
        <div className="flex flex-col justify-center gap-2">
          <h3>{vault.name}</h3>
          <span className="text-foreground-muted">TODO: description</span>
        </div>
      </div>
      <div className="flex gap-16">
        {/* <Metric
          title="Total Supplied"
          popoverText="TOOD"
          primaryValue={vault.totalSuppliedUsd ? formatNumber({ input: vault.totalSuppliedUsd, unit: "USD" }) : "TODO"}
          secondaryValue={formatNumber({ input: vault.totalSupplied, unit: vault.underlyingAssetSymbol })}
        />
        <Metric
          title="Supply APR"
          popoverText="TOOD"
          primaryValue={formatNumber({ input: vault.supplyApy, unit: "%" })}
        />
        <Metric
          title="Total Borrowed"
          popoverText="TOOD"
          primaryValue={vault.totalBorrowedUsd ? formatNumber({ input: vault.totalBorrowedUsd, unit: "USD" }) : "TODO"}
          secondaryValue={formatNumber({ input: vault.totalBorrowed, unit: vault.underlyingAssetSymbol })}
        />
        <Metric
          title="Borrow APR"
          popoverText="TOOD"
          primaryValue={formatNumber({ input: vault.borrowApy, unit: "%" })}
        />
        <Metric
          title="Utilization"
          popoverText="TOOD"
          primaryValue={formatNumber({ input: vault.utilization, unit: "%" })}
        />
        <Metric title="Total Shares" popoverText="TOOD" primaryValue={formatNumber({ input: vault.shares })} /> */}
      </div>
      <div className="flex flex-col gap-2">
        <h4>Vault Collateral Relationship</h4>
        <span className="text-foreground-muted">
          This graph illustrates the collateral relationships between credit vaults. While rehypothecation boosts
          capital efficiency, it also introduces additional risk. Our goal is to provide transparency, helping users
          better assess collateral risk.
        </span>
        <VaultGraph vault={vault} allVaults={allVaults} />
      </div>
      <div className="bg-background-component flex flex-col gap-6 rounded-[24px] p-6">
        <h4>Vault Configuration</h4>
        <div className="flex flex-wrap gap-16">
          <Metric
            title="Chain"
            popoverText="TOOD"
            primaryValue={CHAIN_CONFIGS[vault.chainId].publicClient.chain?.name ?? "UNKNOWN"}
          />
          <Metric title="Underling Asset" popoverText="TOOD" primaryValue={vault.underlyingAssetSymbol} />
          <Metric title="Oracle" popoverText="TOOD" primaryValue={formatAddress({ address: vault.oracleAddress })} />
          <Metric
            title="Interest Rate Model"
            popoverText="TOOD"
            primaryValue={formatAddress({ address: vault.interestRateModelAddress })}
          />
          <Metric
            title="Governor"
            popoverText="TOOD"
            primaryValue={vault.governor ? formatAddress({ address: vault.governor }) : "None"}
          />
          <Metric
            title="Supply Cap"
            popoverText="TOOD"
            primaryValue={
              vault.supplyCap ? formatNumber({ input: vault.supplyCap, unit: vault.underlyingAssetSymbol }) : "None"
            }
          />
          <Metric
            title="Borrow Cap"
            popoverText="TOOD"
            primaryValue={
              vault.borrowCap ? formatNumber({ input: vault.borrowCap, unit: vault.underlyingAssetSymbol }) : "None"
            }
          />
          <Metric
            title="Vault Fee"
            popoverText="TOOD"
            primaryValue={formatNumber({ input: vault.vaultFee, unit: "%" })}
          />
          <Metric
            title="Max liquidation discount"
            popoverText="TOOD"
            primaryValue={formatNumber({ input: vault.maxLiquidationDiscount, unit: "%" })}
          />
          <Metric title="Unit of account" popoverText="TOOD" primaryValue={vault.unitOfAccountSymbol} />
          <Metric title="Vault type" popoverText="TOOD" primaryValue={VAULT_TYPE_NAME_MAPPING[vault.type]} />
        </div>
      </div>
    </>
  );
}
