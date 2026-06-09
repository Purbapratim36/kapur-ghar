"use client";

import { Download } from "lucide-react";

export default function NewsletterExportButton({ emails }: { emails: string[] }) {
  const downloadCsv = () => {
    const csv = "email\n" + emails.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `kapur-ghar-newsletter-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadCsv}
      className="flex items-center gap-2 bg-brand-red hover:bg-brand-deep-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
    >
      <Download className="h-4 w-4" />
      Export CSV
    </button>
  );
}
