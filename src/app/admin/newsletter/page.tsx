import { redirect } from "next/navigation";
import { Mail, Download } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import NewsletterExportButton from "@/components/admin/NewsletterExportButton";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")
  ) {
    redirect("/login?callbackUrl=/admin/newsletter");
  }

  const subscribers = await db.newsletter.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Newsletter</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {subscribers.length} active subscriber
            {subscribers.length === 1 ? "" : "s"}
          </p>
        </div>
        {subscribers.length > 0 && (
          <NewsletterExportButton
            emails={subscribers.map((s) => s.email)}
          />
        )}
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Mail className="h-12 w-12 text-brand-gold/40 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold mb-1">
            No subscribers yet
          </h3>
          <p className="text-sm text-muted-foreground">
            The newsletter form is live on your storefront footer. Subscribers
            will appear here.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left">
                <th className="px-5 py-3 text-muted-foreground font-medium">Email</th>
                <th className="px-5 py-3 text-muted-foreground font-medium">
                  Subscribed
                </th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-5 py-3">{s.email}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(s.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
