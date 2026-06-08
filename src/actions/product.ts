"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export async function createProduct(data: {
  name: string;
  description: string;
  price: number;
  comparePrice?: number;
  categoryId: string;
  fabric?: string;
  color?: string;
  occasion?: string;
  silkType?: string;
  weight?: string;
  careInstructions?: string;
  stock: number;
  images: string[];
}) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized");
  }

  const slug = slugify(data.name, { lower: true, strict: true });

  const product = await db.product.create({
    data: {
      name: data.name,
      slug,
      description: data.description,
      price: data.price,
      comparePrice: data.comparePrice ?? null,
      categoryId: data.categoryId,
      fabric: data.fabric ?? null,
      color: data.color ?? null,
      occasion: data.occasion ?? null,
      silkType: data.silkType ?? null,
      weight: data.weight ?? null,
      careInstructions: data.careInstructions ?? null,
      stock: data.stock,
      images: {
        create: data.images.map((url, i) => ({
          url,
          sortOrder: i,
        })),
      },
    },
  });

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return product;
}

export async function updateProduct(
  id: string,
  data: Partial<{
    name: string;
    description: string;
    price: number;
    comparePrice: number | null;
    stock: number;
    isActive: boolean;
    isFeatured: boolean;
    isNew: boolean;
    fabric: string;
    color: string;
    occasion: string;
    silkType: string;
    weight: string;
    careInstructions: string;
  }>
) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized");
  }

  const product = await db.product.update({
    where: { id },
    data,
  });

  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/admin/products");
  return product;
}

export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    throw new Error("Unauthorized");
  }

  await db.product.delete({ where: { id } });
  revalidatePath("/products");
  revalidatePath("/admin/products");
}

export async function addReview(data: {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Please sign in to leave a review");

  const review = await db.review.create({
    data: {
      productId: data.productId,
      userId: session.user.id,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
    },
  });

  revalidatePath(`/products`);
  return review;
}
