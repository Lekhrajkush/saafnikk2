import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const drives = await prisma.drive.findMany({
    include: {
      leader: { select: { name: true, username: true } },
      _count: { select: { participants: true } },
      sponsorship: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ drives });
}

const patchSchema = z.object({
  driveId: z.string(),
  status: z.enum(["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"]),
});

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const { driveId, status } = patchSchema.parse(await req.json());
  const drive = await prisma.drive.update({ where: { id: driveId }, data: { status } });

  // Reward participants with points once a drive completes.
  if (status === "COMPLETED") {
    const participants = await prisma.driveParticipant.findMany({ where: { driveId } });
    await Promise.all(
      participants.map((p) =>
        prisma.user.update({ where: { id: p.userId }, data: { points: { increment: 25 } } })
      )
    );
  }

  return NextResponse.json({ drive });
}
