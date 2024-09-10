export default function VaultPage({ params }: { params: { chainId: string; vaultAddress: string } }) {
  return (
    <>
      VAULT PAGE: {params.chainId} - {params.vaultAddress}{" "}
    </>
  );
}
