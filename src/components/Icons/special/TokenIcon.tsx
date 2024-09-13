import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/utils/shadcn";
import Image from "next/image";
import { ComponentProps } from "react";

interface TokenIconProps extends Omit<ComponentProps<typeof Image>, "src" | "alt" | "width" | "height"> {
  symbol: string;
  imgSrc: string | null;
  size: number;
}

export default function TokenIcon({ symbol, imgSrc, size, className, ...props }: TokenIconProps) {
  return (
    <>
      {imgSrc ? (
        <Image src={imgSrc} width={size} height={size} alt="" className={cn("rounded-full", className)} {...props} />
      ) : (
        // TODO: create fallback (?)
        <Skeleton className="rounded-full" style={{ width: size, height: size }} {...props} />
      )}
    </>
  );
}
