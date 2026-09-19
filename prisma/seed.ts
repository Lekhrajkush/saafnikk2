import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Saafnikk123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@saafnikk.in" },
    update: {},
    create: {
      name: "Saafnikk Admin",
      username: "admin",
      email: "admin@saafnikk.in",
      passwordHash,
      role: "ADMIN",
      city: "New Delhi",
      wallet: { create: { balance: 0 } },
    },
  });

  const leader = await prisma.user.upsert({
    where: { email: "leader@saafnikk.in" },
    update: {},
    create: {
      name: "Aarav Sharma",
      username: "aarav",
      email: "leader@saafnikk.in",
      passwordHash,
      role: "DRIVE_LEADER",
      city: "Mumbai",
      institution: "St. Xavier's College",
      institutionType: "COLLEGE",
      wallet: { create: { balance: 250 } },
    },
  });

  await prisma.drive.upsert({
    where: { id: "seed-drive-1" },
    update: {},
    create: {
      id: "seed-drive-1",
      title: "Juhu Beach Clean-up",
      description: "Weekend clean-up drive along Juhu Beach. Bring gloves and a bag — we'll provide the rest.",
      category: "CLEANUP",
      locationName: "Juhu Beach, Mumbai",
      latitude: 19.099,
      longitude: 72.8265,
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      capacity: 60,
      leaderId: leader.id,
    },
  });

  await prisma.drive.upsert({
    where: { id: "seed-drive-2" },
    update: {},
    create: {
      id: "seed-drive-2",
      title: "Lodhi Garden Plantation Drive",
      description: "Planting 200 saplings with school volunteers. Open to all ages.",
      category: "PLANTATION",
      locationName: "Lodhi Garden, New Delhi",
      latitude: 28.5931,
      longitude: 77.2197,
      startTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      capacity: 100,
      leaderId: admin.id,
    },
  });

  console.log("Seed complete.");
  console.log("Admin login: admin@saafnikk.in / Saafnikk123!");
  console.log("Leader login: leader@saafnikk.in / Saafnikk123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
