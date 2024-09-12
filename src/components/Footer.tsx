import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-foreground-subtle mt-6 flex h-16 w-full items-center px-6 py-4">
      <Link
        href="https://paperclip.xyz"
        target="_blank"
        rel="noopener"
        className="hover:text-semantic-accent flex gap-4"
      >
        Built by Paperclip Labs
      </Link>
    </footer>
  );
}
