import { ComponentProps } from "react";
import ExternalLink from "./ExternalLink";
import { etherscanLink } from "@/utils/etherscan";
import { SupportedChainId } from "@/utils/types";
import { Address } from "viem";
import { formatAddress } from "@/utils/format";

interface EtherscanLinkProps extends Omit<ComponentProps<typeof ExternalLink>, "href"> {
  chainId: SupportedChainId;
  address: Address;
}

export default function EtherscanLink({ chainId, address, children, ...props }: EtherscanLinkProps) {
  return (
    <ExternalLink href={etherscanLink(chainId, address)} {...props}>
      {/* default to formatted address if no children provided*/}
      {children || formatAddress({ address })}
    </ExternalLink>
  );
}
