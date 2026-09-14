import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.project.count();
  if (count > 0) return;

  await prisma.project.createMany({
    data: [
      {
        clientName: "Northwind Retail",
        projectName: "E-commerce Refresh",
        description: "Rebuild storefront and checkout flow for seasonal campaigns.",
        status: "In Progress",
        priority: "High",
        startDate: new Date("2026-08-01"),
        dueDate: new Date("2026-10-15"),
      },
      {
        clientName: "Lumen Health",
        projectName: "Patient Portal MVP",
        description: "Secure appointment booking and records overview.",
        status: "Planning",
        priority: "Medium",
        startDate: new Date("2026-09-05"),
        dueDate: new Date("2026-11-30"),
      },
      {
        clientName: "Harbor Bank",
        projectName: "Brand Guidelines Site",
        description: "Internal brand system documentation and asset library.",
        status: "On Hold",
        priority: "Low",
        startDate: new Date("2026-07-10"),
        dueDate: new Date("2026-09-20"),
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
