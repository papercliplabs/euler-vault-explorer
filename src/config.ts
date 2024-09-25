import { Address, Client, createPublicClient, http, fallback } from "viem";
import { SupportedChainId, VaultType } from "./utils/types";
import { mainnet } from "viem/chains";

export interface ChainConfig {
  chainId: SupportedChainId;
  publicClient: Client;
  nativeTokenImgSrc: string;
  addresses: {
    wrappedNativeAsset: Address;
    perspectives: Record<VaultType, Address>;
    lenses: {
      vault: Address;
      oracle: Address;
    };
  };
}

export const CHAIN_CONFIGS: Record<SupportedChainId, ChainConfig> = {
  [mainnet.id]: {
    chainId: mainnet.id,
    publicClient: createPublicClient({
      chain: mainnet,
      transport: fallback([
        http(`https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY!}`),
        http(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`),
      ]),
    }),
    nativeTokenImgSrc: "/nativeToken/eth.svg",
    addresses: {
      wrappedNativeAsset: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      perspectives: {
        escrowedCollateral: "0xc68CB3658ACf1d49547Fa8605dc158D876cD5828",
        "ungoverned-0x": "0x000D8AA9E414b9E7E7591A456CA910Fb3bb05875",
        "ungoverned-nzx": "0x7695A341E1e51CbE2dDF1FEE5FD89f4D7617351c",
        governed: "0xC0121817FF224a018840e4D15a864747d36e6Eb2",
        factory: "0xB30f23bc5F93F097B3A699f71B0b1718Fc82e182",
      },
      lenses: {
        vault: "0xE4044D26C879f58Acc97f27db04c1686fa9ED29E",
        oracle: "0x26B1E253c3E5AEd049c2283Fa1d9BeF4e226A867",
      },
    },
  },
};
