import Image from "next/image";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Question } from "./Icons";
import ExternalLink from "./ExternalLink";

export default function Header() {
  return (
    <header className="bg-background-base body-lg fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b px-4 py-4 backdrop-blur-lg md:px-6">
      <Link href="/" className="flex gap-4">
        <Image src="/logomark.svg" width={24} height={24} alt="Euler" />
        <span>Vault Explorer</span>
      </Link>
      <Popover>
        <PopoverTrigger asChild>
          <Button size="lg" variant="secondary" className="rounded-[12px] p-3">
            <Question className="fill-foreground-muted h-[15px] w-[15px] p-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent asChild>
          <div className="flex flex-col gap-3">
            <span className="body-lg font-medium">Euler Vault Explorer</span>
            <div className="body-sm flex flex-col gap-4">
              <span>
                This app is an{" "}
                <ExternalLink
                  href="https://github.com/papercliplabs/euler-vault-explorer"
                  className="text-semantic-accent inline hover:brightness-75"
                  hideArrow
                >
                  open-source
                </ExternalLink>{" "}
                vault explorer for the Euler v2 protocol. This was built to provide transparency on how the Euler vaults
                are structured and what assets they are exposed to.
              </span>
              <span className="flex whitespace-pre-wrap">
                Built by{" "}
                <ExternalLink
                  href="https://paperclip.xyz"
                  hideArrow
                  keepReferrer
                  className="text-semantic-accent inline hover:brightness-75"
                >
                  Paperclip Labs
                </ExternalLink>
                .
              </span>
            </div>
            <div className="body-sm border-foreground-disabled whitespace-pre-wrap border-t pt-3">
              Questions or UX feedback?{" "}
              <ExternalLink
                href="https://github.com/papercliplabs/euler-vault-explorer/issues"
                hideArrow
                className="text-semantic-accent inline hover:brightness-75"
              >
                Open an issue on Github
              </ExternalLink>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </header>
  );
}
