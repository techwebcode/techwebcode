import Link from "next/link";
import Container from "./Container";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Container>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-8">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              <span className="text-blue-600">Tech</span>
              <span>WebCode</span>
            </Link>
            <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              Developer tools, guides &amp; engineering resources.
            </p>
          </div>

          {/* Useful Navigation Links to Existing Routes */}
          <nav aria-label="Footer Navigation" className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <Link href="/tools" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Tools
            </Link>
            <Link href="/articles" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Articles
            </Link>
            <Link href="/categories" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Categories
            </Link>
            <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Contact
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Privacy
            </Link>
          </nav>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800/80 py-5 text-center text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} TechWebCode. All rights reserved. 100% Client-Side Privacy First Tools.
        </div>
      </Container>
    </footer>
  );
}