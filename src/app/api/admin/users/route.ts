import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      city: true,
      institution: true,
      points: true,
      createdAt: true,
      _count: { select: { drivesCreated: true, reports: true, reels: true, followers: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

const patchSchema = z.object({
  userId: z.string(),
  role: z.enum(["USER", "DRIVE_LEADER", "SCHOOL_ADMIN", "ADMIN"]),
});

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const { userId, role } = patchSchema.parse(await req.json());
  const user = await prisma.user.update({ where: { id: userId }, data: { role } });
  return NextResponse.json({ user });
}
