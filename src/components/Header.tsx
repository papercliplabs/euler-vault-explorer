import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-foreground-disabled/5 body-lg fixed top-0 z-10 flex h-16 w-full items-center px-6 py-4 backdrop-blur-lg">
      <Link href="/" className="flex gap-4">
        <Image src="/logomark.svg" width={24} height={24} alt="Euler" />
        <span>Vault Explorer</span>
      </Link>
    </header>
  );
}
