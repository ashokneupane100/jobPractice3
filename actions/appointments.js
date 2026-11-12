"use server";

import { db } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const getIntervieweeAppointments = async () => {
  const user = await currentUser();
  if (!user) return [];

  try {
    const dbUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
      select: { id: true },
    });

    if (!dbUser) return [];

    return await db.booking.findMany({
      where: { intervieweeId: dbUser.id },
      include: {
        interviewer: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            title: true,
            company: true,
            categories: true,
          },
        },
        feedback: true,
      },
      orderBy: { startTime: "desc" },
    });
  } catch (err) {
    console.error("getIntervieweeAppointments error:", err);
    return [];
  }
};
