"use server";
import { getCoinGeckoTokenInfos } from "./coinGecko/getCoinGeckoTokenInfos";
import { getTrustWalletTokenImgSrcs } from "./trustWallet/getTrustWalletTokenImgSrc";

export async function getTokenImgSrcs(symbols: string[]): Promise<(string | null)[]> {
  const [coinGeckoData, trustWalletData] = await Promise.all([
    getCoinGeckoTokenInfos(symbols),
    getTrustWalletTokenImgSrcs(symbols),
  ]);

  let imgSrcs: (string | null)[] = [];
  for (const symbol of symbols) {
    if (symbol == "ETH" || symbol == "WETH") {
      imgSrcs.push("/nativeToken/eth.svg");
      continue;
    }

    const trustWallet = trustWalletData[symbol.toLowerCase()];
    const coinGecko = coinGeckoData[symbol.toLowerCase()];

    if (trustWallet) {
      imgSrcs.push(trustWallet);
    } else if (coinGecko) {
      imgSrcs.push(coinGecko.imgSrc);
    } else {
      imgSrcs.push(null);
    }
  }

  return imgSrcs;
}
