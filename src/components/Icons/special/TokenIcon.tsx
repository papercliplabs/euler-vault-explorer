import { Skeleton } from "@/components/ui/skeleton";
import { getTokenImgSrc } from "@/data/token/getTokenImgSrc";
import { cn } from "@/utils/shadcn";
import { SupportedChainId } from "@/utils/types";
import Image from "next/image";
import { ComponentProps, Suspense } from "react";
import { Address } from "viem";

interface TokenIconProps extends Omit<ComponentProps<typeof Image>, "src" | "alt" | "width" | "height"> {
  chainId: SupportedChainId;
  address: Address;
  size: number;
}

export default function TokenIcon(props: TokenIconProps) {
  return (
    <Suspense fallback={<Skeleton className="rounded-full" style={{ width: props.size, height: props.size }} />}>
      <TokenIconImageWrapper {...props} />
    </Suspense>
  );
}

async function TokenIconImageWrapper({ chainId, address, size, className, ...props }: TokenIconProps) {
  const tokenImgSrc = await getTokenImgSrc(chainId, address);

  return (
    <>
      {tokenImgSrc ? (
        <Image
          src={tokenImgSrc}
          width={size}
          height={size}
          alt=""
          className={cn("rounded-full", className)}
          {...props}
        />
      ) : (
        // TODO: use symbol to derive the default (?)
        <Skeleton className="rounded-full" style={{ width: size, height: size }} />
      )}
    </>
  );
}
