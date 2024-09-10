import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChainIcon,
  Check,
  ChevronUpDown,
  Expand,
  Fit,
  Minus,
  OracleTypeIcon,
  Plus,
  Question,
  Search,
  Settings,
  TokenIcon,
  VaultTypeIcon,
  X,
} from "@/components/Icons";
import VaultTable from "@/components/VaultTable";
import { vaultTableColumns } from "@/components/VaultTable/columns";
import { getAllVaults, getAllVaultsOffline } from "@/data/vault/getAllVaults";
import { Suspense } from "react";

export default async function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-between p-24">
      <ArrowDown />
      <ArrowLeft />
      <ArrowRight />
      <Check />
      <ChevronUpDown />
      <Expand />
      <Fit />
      <Minus />
      <Plus />
      <Question />
      <Search />
      <Settings />
      <X />
      <VaultTypeIcon type="escrowedCollateral" />
      <VaultTypeIcon type="governed" />
      <VaultTypeIcon type="ungoverned-0x" />
      <VaultTypeIcon type="ungoverned-nzx" />
      <VaultTypeIcon type="factory" />
      <OracleTypeIcon type="EulerRouter" />
      <OracleTypeIcon type="ChainlinkOracle" />
      <OracleTypeIcon type="ChronicleOracle" />
      <OracleTypeIcon type="LidoOracle" />
      <OracleTypeIcon type="LidoFundamentalOracle" />
      <OracleTypeIcon type="PythOracle" />
      <OracleTypeIcon type="RedstoneCoreOracle" />
      <OracleTypeIcon type="UniswapV3Oracle" />
      <OracleTypeIcon type="CrossAdapter" />
      <ChainIcon chainId={1} />
      <TokenIcon chainId={1} address="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" size={32} />
      <TokenIcon chainId={1} address="0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0" size={32} />
      <TokenIcon chainId={1} address="0x8c9532a60E0E7C6BbD2B2c1303F63aCE1c3E9811" size={32} />
      <TokenIcon chainId={1} address="0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" size={32} />
      <TokenIcon chainId={1} address="0xdAC17F958D2ee523a2206206994597C13D831ec7" size={32} />
      <TokenIcon chainId={1} address="0x9Ba021B0a9b958B5E75cE9f6dff97C7eE52cb3E6" size={32} />
      <TokenIcon chainId={1} address="0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee" size={32} />
      <TokenIcon chainId={1} address="0xA35b1B31Ce002FBF2058D22F30f95D405200A15b" size={32} />
      <TokenIcon chainId={1} address="0x83F20F44975D03b1b09e64809B757c47f942BEeA" size={32} />
      <TokenIcon chainId={1} address="0xBe9895146f7AF43049ca1c1AE358B0541Ea49704" size={32} />
      <Suspense fallback={<div>Loading...</div>}>
        <VaultTableWrapper />
      </Suspense>
    </main>
  );
}

async function VaultTableWrapper() {
  const allVaults = await getAllVaultsOffline();

  return <VaultTable data={allVaults} columns={vaultTableColumns} />;
}
