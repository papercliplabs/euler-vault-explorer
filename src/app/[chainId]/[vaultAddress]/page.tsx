import EtherscanLink from "@/components/EtherscanLink";
import { ArrowLeft, ChainIcon, VaultTypeIcon } from "@/components/Icons";
import { VaultIcon } from "@/components/Icons/special/VaultIcon";
import Metric from "@/components/Metric";
import VaultGraph from "@/components/VaultGraph";
import VaultTypeDescriptor from "@/components/VaultTypeDescriptor";
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
          popoverContent="The total amount and value of the underlying assets currently supplied into this vault."
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
            title="Supply APY"
            popoverContent="The annual percent yield (APY) earned for lending into this vault."
            primaryValue={formatNumber({ input: vault.supplyApy, unit: "%" })}
          />
        )}
        {vault.type != "escrowedCollateral" && (
          <Metric
            title="Total Borrowed"
            popoverContent="The total amount and value of the underlying assets currently borrowed from this vault."
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
            title="Borrow APY"
            popoverContent="The annual percent yield (APY) paid for borrowing from this vault."
            primaryValue={formatNumber({ input: vault.borrowApy, unit: "%" })}
          />
        )}
        {vault.type != "escrowedCollateral" && (
          <Metric
            title="Utilization"
            popoverContent="The percentage of the total supply that is currently being borrowed."
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
              popoverContent="The chain on which this vault is deployed."
              primaryValue={
                <div className="flex items-center gap-2">
                  <ChainIcon chainId={vault.chainId} className="h-5 w-5 shrink-0" />
                  {CHAIN_CONFIGS[vault.chainId].publicClient.chain?.name ?? "UNKNOWN"}
                </div>
              }
            />
            <Metric
              title="Underling Asset"
              popoverContent="The single underlying asset for the vault that supplied and borrowed."
              primaryValue={
                <EtherscanLink chainId={vault.chainId} address={vault.underlyingAssetAddress}>
                  {vault.underlyingAssetSymbol}
                </EtherscanLink>
              }
            />
            <Metric
              title="Vault type"
              // popoverContent="The type of vault as classified by Euler's vault type settings. Click on the vault type icon to learn more about the individual types."
              popoverContent={<VaultTypeDescriptor />}
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
                popoverContent="The single oracle (or oracle router) used by this vault to get quotes for all accepted assets in the unit of account."
                primaryValue={<EtherscanLink chainId={vault.chainId} address={vault.oracleAddress} />}
              />
            )}
            {vault.type != "escrowedCollateral" && (
              <Metric
                title="Interest Rate Model"
                popoverContent="The interest rate model used by this vault to calculate the interest rates for borrowers."
                primaryValue={<EtherscanLink chainId={vault.chainId} address={vault.interestRateModelAddress} />}
              />
            )}
            <Metric
              title="Governor"
              popoverContent="The vault governor who has the power to change vault parameters."
              primaryValue={
                vault.governor ? <EtherscanLink chainId={vault.chainId} address={vault.governor} /> : "None"
              }
            />
            <Metric
              title="Supply Cap"
              popoverContent="The maximum amount of the underlying asset that can be supplied into this vault."
              primaryValue={
                vault.supplyCap != undefined
                  ? formatNumber({ input: vault.supplyCap, unit: vault.underlyingAssetSymbol, compact: true })
                  : "None"
              }
            />
            {vault.type != "escrowedCollateral" && (
              <Metric
                title="Borrow Cap"
                popoverContent="The maximum amount of the underlying asset that can be borrowed from this vault."
                primaryValue={
                  vault.borrowCap != undefined
                    ? formatNumber({ input: vault.borrowCap, unit: vault.underlyingAssetSymbol, compact: true })
                    : "None"
                }
              />
            )}
            <Metric
              title="Vault Fee"
              popoverContent="The fee taken from interest when accrued. This goes to the Euler DAO, and a portion may go to the governor."
              primaryValue={formatNumber({ input: vault.vaultFee, unit: "%" })}
            />
            {vault.type != "escrowedCollateral" && (
              <Metric
                title="Max liquidation discount"
                popoverContent="The maximum liquidation discount for unhealthy position. The actual discount is a reverse dutch auction depending on the positions health."
                primaryValue={formatNumber({ input: vault.maxLiquidationDiscount, unit: "%" })}
              />
            )}
            <Metric
              title="Unit of account"
              popoverContent="The unit used for price comparison between underlying and collateral assets in the vault."
              primaryValue={vault.unitOfAccountSymbol}
            />
          </div>
        </div>
      </div>
    </>
  );
}
