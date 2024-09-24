import { Oracle, OracleType } from "@/utils/types";
import { Address, decodeAbiParameters, Hex, parseAbiParameters, zeroAddress } from "viem";
import { base } from "viem/chains";

const eulerRouterOracleDecodeAbi = parseAbiParameters([
  "struct OracleDetailedInfo {address oracle; string name; bytes oracleInfo;}",
  "struct EulerRouterInfo { address governor; address fallbackOracle; address[] resolvedOracles; OracleDetailedInfo fallbackOracleInfo; OracleDetailedInfo[] resolvedOraclesInfo; }",
  "EulerRouterInfo oracle",
]);

const chainlinkOracleDecodeAbi = parseAbiParameters([
  "struct ChainlinkOracleInfo { address base; address quote; address feed; string feedDescription; uint256 maxStaleness; }",
  "ChainlinkOracleInfo oracle",
]);

const chronicleOracleDecodeAbi = parseAbiParameters([
  "struct ChronicleOracleInfo { address base; address quote; address feed; uint256 maxStaleness; }",
  "ChronicleOracleInfo oracle",
]);

const lidoOracleDecodeAbi = parseAbiParameters([
  "struct LidoOracleInfo { address base; address quote; }",
  "LidoOracleInfo oracle",
]);

const pythOracleDecodeAbi = parseAbiParameters([
  "struct PythOracleInfo { address pyth; address base; address quote; bytes32 feedId; uint256 maxStaleness; uint256 maxConfWidth; }",
  "PythOracleInfo oracle",
]);

const redstoneOracleDecodeAbi = parseAbiParameters([
  "struct RedstoneCoreOracleInfo { address base; address quote; bytes32 feedId; uint8 feedDecimals; uint256 maxStaleness; uint208 cachePrice; uint48 cachePriceTimestamp; }",
  "RedstoneCoreOracleInfo oracle",
]);

const uniswapOracleDecodeAbi = parseAbiParameters([
  "struct UniswapV3OracleInfo { address tokenA; address tokenB; address pool; uint24 fee; uint32 twapWindow; }",
  "UniswapV3OracleInfo oracle",
]);

const crossAdapterDecodeAbi = parseAbiParameters([
  "struct OracleDetailedInfo {address oracle; string name; bytes oracleInfo;}",
  "struct CrossAdapterInfo { address base; address cross; address quote; address oracleBaseCross; address oracleCrossQuote; OracleDetailedInfo oracleBaseCrossInfo; OracleDetailedInfo oracleCrossQuoteInfo; }",
  "CrossAdapterInfo oracle",
]);

// Decodes the EulerRouter oracle to return an array of oracles used
export function decodeEulerRouterOracle(info: Hex): Oracle[] {
  const eulerRouterInfo = decodeAbiParameters(eulerRouterOracleDecodeAbi, info)[0];

  const oracles: Oracle[] = [];
  for (const resolvedOracleInfo of eulerRouterInfo.resolvedOraclesInfo) {
    oracles.push(
      decodeOracleInfo(resolvedOracleInfo.name as OracleType, resolvedOracleInfo.oracle, resolvedOracleInfo.oracleInfo)
    );
  }

  //   const uniqueOracles = Array.from(new Set(oracles.map((obj) => JSON.stringify(obj)))).map((str) => JSON.parse(str));

  return oracles;
}

// Cross adapters are not followed, and are only classified as cross type (for now)
export function decodeOracleInfo(type: OracleType, oracleAddress: Address, info: Hex): Oracle {
  const baseOracle = { type, oracleAddress };

  switch (type) {
    case "EulerRouter":
      throw Error("FOUND NESTED EULER ROUTER");
    case "ChainlinkOracle":
      const chainlinkOracleInfo = decodeAbiParameters(chainlinkOracleDecodeAbi, info)[0];
      return {
        ...baseOracle,
        baseAddress: chainlinkOracleInfo.base,
        quoteAddress: chainlinkOracleInfo.quote,
      };

    case "ChronicleOracle":
      const chronicleOracleInfo = decodeAbiParameters(chronicleOracleDecodeAbi, info)[0];
      return {
        ...baseOracle,
        baseAddress: chronicleOracleInfo.base,
        quoteAddress: chronicleOracleInfo.quote,
      };

    case "LidoOracle":
    case "LidoFundamentalOracle":
      const lidoOracleInfo = decodeAbiParameters(lidoOracleDecodeAbi, info)[0];
      return {
        ...baseOracle,
        baseAddress: lidoOracleInfo.base,
        quoteAddress: lidoOracleInfo.quote,
      };

    case "PythOracle":
      const pythOracleInfo = decodeAbiParameters(pythOracleDecodeAbi, info)[0];
      return {
        ...baseOracle,
        baseAddress: pythOracleInfo.base,
        quoteAddress: pythOracleInfo.quote,
      };

    case "RedstoneCoreOracle":
      const redstoneOracleInfo = decodeAbiParameters(redstoneOracleDecodeAbi, info)[0];
      return {
        ...baseOracle,
        baseAddress: redstoneOracleInfo.base,
        quoteAddress: redstoneOracleInfo.quote,
      };

    case "UniswapV3Oracle":
      const uniswapOracleInfo = decodeAbiParameters(uniswapOracleDecodeAbi, info)[0];
      // Add both tokenA and tokenB, one will be the unit of account but thats okay
      return {
        ...baseOracle,
        //   baseAddress: uniswapOracleInfo.tokenA,
        //   quoteAddress: uniswapOracleInfo.tokenB,
      };

    case "CrossAdapter":
      // base (asset) -> oracleBaseCross -> cross (asset) -> crossOracle -> quote (asset, unit of account)
      const crossAdapterInfo = decodeAbiParameters(crossAdapterDecodeAbi, info)[0];
      return {
        ...baseOracle,
        // type,
        // sourceAddress: crossAdapterInfo.oracleBaseCross,

        // base: crossAdapterInfo.base,
        // cross: crossAdapterInfo.cross,
        // data: crossAdapterInfo,

        //   baseAddress: crossAdapterInfo.base,
        //   quoteAddress: crossAdapterInfo.quote,
      };

    // Don't follow the cross, just classify as cross type for now
    //   oracles = oracles.concat(
    //     decodeOracleInfo(
    //       crossAdapterInfo.oracleBaseCrossInfo.name as OracleType,
    //       crossAdapterInfo.oracleBaseCrossInfo.oracleInfo
    //     )
    //   );
    //   oracles = oracles.concat(
    //     decodeOracleInfo(
    //       crossAdapterInfo.oracleCrossQuoteInfo.name as OracleType,
    //       crossAdapterInfo.oracleCrossQuoteInfo.oracleInfo
    //     )
    //   );
  }
}
