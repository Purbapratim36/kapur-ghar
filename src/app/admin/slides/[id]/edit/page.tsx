import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import SlideForm from "@/components/admin/SlideForm";

export default async function EditSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect(`/login?callbackUrl=/admin/slides/${id}/edit`);
  }

  const slide = await db.heroSlide.findUnique({ where: { id } });
  if (!slide) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Edit Hero Slide</h1>
        <p className="text-sm text-muted-foreground mt-1">Update slide details</p>
      </div>
      <SlideForm
        slideId={slide.id}
        initial={{
          type: slide.type as "image" | "video",
          mediaUrl: slide.mediaUrl,
          posterUrl: slide.posterUrl,
          title: slide.title || "",
          subtitle: slide.subtitle || "",
          description: slide.description || "",
          ctaText: slide.ctaText || "",
          ctaLink: slide.ctaLink || "",
          textColor: slide.textColor as "white" | "dark",
          alignment: slide.alignment as "left" | "center" | "right",
          overlayLevel: slide.overlayLevel as "none" | "light" | "medium" | "strong",
          isActive: slide.isActive,
        }}
      />
    </div>
  );
}
