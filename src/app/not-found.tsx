import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream bg-assamese-pattern">
      <div className="text-center px-4">
        <div className="font-heading text-8xl font-bold text-brand-gold/30 mb-4">
          404
        </div>
        <h1 className="font-heading text-3xl font-bold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back to exploring our beautiful collection.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-brand-deep-red transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
