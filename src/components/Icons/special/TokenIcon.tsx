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
        <div
          className="bg-background-subtle/50 flex items-center justify-center rounded-full border"
          style={{ width: size, height: size, fontSize: size > 40 ? "14px" : "10px" }}
        >
          {symbol.substring(0, 3)}
        </div>
      )}
    </>
  );
}
