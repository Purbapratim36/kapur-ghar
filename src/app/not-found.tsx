import Link from "next/link";
import NotFoundIllustration from "@/components/shared/NotFoundIllustration";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream bg-assamese-pattern px-4">
      <div className="text-center max-w-lg">
        <NotFoundIllustration />
        <h1 className="font-heading text-3xl font-bold text-foreground mt-4">
          Lost on the loom
        </h1>
        <p className="text-muted-foreground mt-3 leading-relaxed">
          The page you&apos;re looking for has slipped a thread. Let&apos;s
          weave you back to something beautiful.
        </p>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Link
            href="/"
            className="bg-brand-red hover:bg-brand-deep-red text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/products"
            className="border border-border bg-white hover:bg-muted text-foreground px-6 py-3 rounded-full text-sm font-semibold transition-colors"
          >
            Shop the collection
          </Link>
        </div>
      </div>
    </div>
  );
}
