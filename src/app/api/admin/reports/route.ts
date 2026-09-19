import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const patchSchema = z.object({
  reportId: z.string(),
  status: z.enum(["OPEN", "DRIVE_SCHEDULED", "RESOLVED", "REJECTED"]),
  linkedDriveId: z.string().optional(),
});

export async function PATCH(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Admin access required." }, { status: 403 });

  const { reportId, status, linkedDriveId } = patchSchema.parse(await req.json());

  const report = await prisma.report.update({
    where: { id: reportId },
    data: { status, linkedDriveId },
  });

  await prisma.notification.create({
    data: {
      recipientId: report.reporterId,
      type: "REPORT_STATUS",
      message: `Your report "${report.title}" is now ${status.replace("_", " ").toLowerCase()}.`,
      linkUrl: `/report`,
    },
  });

  return NextResponse.json({ report });
}
