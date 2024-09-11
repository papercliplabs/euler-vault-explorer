import Link from "next/link";

export default function Footer() {
  return (
    <footer className="body-lg flex h-16 w-full items-center px-6 py-4">
      <Link href="/" className="flex gap-4">
        Built by Paperclip Labs
      </Link>
    </footer>
  );
}
