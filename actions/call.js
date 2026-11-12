"use server";

import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
import { getStreamClient, CALL_SETTINGS_OVERRIDE } from "@/lib/stream";

export const getCallData = async (callId) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const booking = await db.booking.findUnique({
    where: { streamCallId: callId },
    include: {
      interviewer: {
        select: {
          id: true,
          clerkUserId: true,
          name: true,
          imageUrl: true,
          categories: true,
        },
      },
      interviewee: {
        select: {
          id: true,
          clerkUserId: true,
          name: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!booking) return { error: "Call not found" };

  const isInterviewer = booking.interviewer.clerkUserId === user.id;
  const isInterviewee = booking.interviewee.clerkUserId === user.id;
  if (!isInterviewer && !isInterviewee) return { error: "Forbidden" };

  const streamClient = getStreamClient();

  const token = streamClient.generateUserToken({
    user_id: user.id,
    // Long enough for a meeting that starts after the page was opened.
    validity_in_seconds: 60 * 60 * 4,
  });

  return {
    token,
    isInterviewer,
    currentUser: {
      id: user.id,
      name: `${user.firstName} ${user.lastName}`.trim(),
      imageUrl: user.imageUrl,
    },
    booking: {
      id: booking.id,
      interviewer: booking.interviewer,
      interviewee: booking.interviewee,
      categories: booking.interviewer.categories,
      startTime: booking.startTime.toISOString(),
      endTime: booking.endTime.toISOString(),
    },
  };
};

// Re-provisions a Stream call that never got created at booking time (the
// booking-time request can fail/time out). getOrCreate is idempotent, so this
// is safe to call for every join.
export const ensureCall = async (callId) => {
  const user = await currentUser();
  if (!user) return { error: "Unauthorized" };

  const booking = await db.booking.findUnique({
    where: { streamCallId: callId },
    select: {
      interviewer: {
        select: { clerkUserId: true, name: true, imageUrl: true },
      },
      interviewee: {
        select: { clerkUserId: true, name: true, imageUrl: true },
      },
    },
  });

  if (!booking) return { error: "Call not found" };

  const participants = [booking.interviewer, booking.interviewee];
  if (!participants.some((p) => p.clerkUserId === user.id)) {
    return { error: "Forbidden" };
  }

  try {
    const streamClient = getStreamClient();

    await streamClient.upsertUsers(
      participants.map((p) => ({
        id: p.clerkUserId,
        name: p.name ?? undefined,
        image: p.imageUrl ?? undefined,
        role: "user",
      })),
    );

    await streamClient.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: booking.interviewer.clerkUserId,
        members: participants.map((p) => ({
          user_id: p.clerkUserId,
          role: "host",
        })),
        settings_override: CALL_SETTINGS_OVERRIDE,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("ensureCall failed:", err);
    return { error: "Could not start the call. Please try again." };
  }
};