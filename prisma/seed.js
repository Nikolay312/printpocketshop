require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");

const { products } = require("../mock/products");
const { categories } = require("../mock/categories");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

/** Map lowercase mock values → Prisma enums */
const LICENSE_MAP = {
  personal: "PERSONAL",
  commercial: "COMMERCIAL",
};

async function main() {
  console.log("🌱 Seeding database...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: {
        id: category.id,
        name: category.name,
        slug: category.slug,
      },
    });
  }

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        description: product.description,
        price: product.price,
        currency: product.currency,
        format: product.format,
        license: LICENSE_MAP[product.license],
        isFeatured: product.isFeatured,
        fileKey: product.fileUrl ?? "",
        previewImages: product.previewImages ?? [],
        sales: product.sales ?? 0,
      },
      create: {
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        currency: product.currency,
        format: product.format,
        license: LICENSE_MAP[product.license],
        isFeatured: product.isFeatured,
        fileKey: product.fileUrl ?? "",
        previewImages: product.previewImages ?? [],
        categoryId: product.category,
        sales: product.sales ?? 0,
      },
    });
  }

  console.log("✅ Database seeded successfully");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
