import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Mekhela Sador",
    slug: "mekhela-sador",
    description: "The iconic traditional two-piece attire of Assam.",
    sortOrder: 1,
  },
  {
    name: "Muga Silk",
    slug: "muga-silk",
    description: "The golden silk exclusive to Assam, known for natural luster.",
    sortOrder: 2,
  },
  {
    name: "Pat Silk",
    slug: "pat-silk",
    description: "Glossy mulberry silk perfect for weddings and occasions.",
    sortOrder: 3,
  },
  {
    name: "Eri Silk",
    slug: "eri-silk",
    description: "The peace silk of Assam, warm and breathable.",
    sortOrder: 4,
  },
  {
    name: "Wedding Collection",
    slug: "wedding-collection",
    description: "Bridal wear and ceremonial pieces.",
    sortOrder: 5,
  },
  {
    name: "Bridal Collection",
    slug: "bridal-collection",
    description: "Curated bridal ensembles for the modern Assamese bride.",
    sortOrder: 6,
  },
  {
    name: "Handloom",
    slug: "handloom",
    description: "Handwoven everyday pieces from Assamese looms.",
    sortOrder: 7,
  },
  {
    name: "Blouses",
    slug: "blouses",
    description: "Designer and traditional blouses.",
    sortOrder: 8,
  },
  {
    name: "Dupattas",
    slug: "dupattas",
    description: "Elegant dupattas and stoles.",
    sortOrder: 9,
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Traditional jewelry and accessories.",
    sortOrder: 10,
  },
  {
    name: "New Arrivals",
    slug: "new-arrivals",
    description: "The latest pieces fresh from our looms.",
    sortOrder: 11,
  },
];

async function main() {
  console.log("Seeding categories…");
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }
  console.log(`  ${categories.length} categories ready`);

  // Create a starter admin if env credentials are provided.
  // Set ADMIN_EMAIL and ADMIN_PASSWORD before running seed to create one.
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (adminEmail && adminPassword) {
    console.log(`Ensuring admin user (${adminEmail})…`);
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.user.upsert({
      where: { email: adminEmail.toLowerCase() },
      update: { role: "ADMIN" },
      create: {
        email: adminEmail.toLowerCase(),
        name: "Store Admin",
        password: passwordHash,
        role: "ADMIN",
      },
    });
    console.log("  Admin user ready");
  } else {
    console.log(
      "Skipping admin user — set ADMIN_EMAIL and ADMIN_PASSWORD env vars to create one."
    );
  }

  // Seed one default coupon
  await prisma.coupon.upsert({
    where: { code: "KAPURGHAR20" },
    update: {},
    create: {
      code: "KAPURGHAR20",
      description: "Get 20% off your order (max ₹2000)",
      type: "percentage",
      value: 20,
      minOrder: 1499,
      maxDiscount: 2000,
      isActive: true,
    },
  });
  console.log("  Default coupon KAPURGHAR20 ready");

  console.log("Done.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
