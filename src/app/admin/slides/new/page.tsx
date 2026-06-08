import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SlideForm from "@/components/admin/SlideForm";

export default async function NewSlidePage() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    redirect("/login?callbackUrl=/admin/slides/new");
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Add Hero Slide</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload a photo or video to feature at the top of your home page
        </p>
      </div>
      <SlideForm />
    </div>
  );
}
