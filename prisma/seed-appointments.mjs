// Seed demo appointments for a real (signed-in) account.
//
// Usage:
//   node prisma/seed-appointments.mjs [email]
//   npm run seed:me -- [email]
//
// Without an email it targets DEMO_USER_EMAIL from the env, or the most
// recently created non-seed user. Safe to re-run: only demo bookings
// (streamCallId starting with "demo_") for that user are replaced.

import "dotenv/config";
import crypto from "node:crypto";
import { Pool } from "pg";
import { StreamClient } from "@stream-io/node-sdk";

const pool = new Pool({ connectionString: process.env.DIRECT_URL });

const uuid = () => crypto.randomUUID();
const DAY = 86_400_000;
const now = Date.now();

// A datetime `offsetDays` from today at a fixed local hour.
const at = (offsetDays, hour, minute = 0) => {
  const d = new Date(now + offsetDays * DAY);
  d.setHours(hour, minute, 0, 0);
  return d;
};

// Creates a real call on Stream so the seeded "Join call" button works.
// Falls back to a placeholder id when Stream is not configured or unreachable.
async function createStreamCall(interviewee, interviewer, key) {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;
  const fallback = `demo_${key}_${interviewee.id.slice(0, 8)}`;

  if (!apiKey || !apiSecret) {
    console.warn("⚠️  Stream credentials missing — using placeholder call id");
    return fallback;
  }

  const callId = `mock_${Date.now()}_${crypto.randomBytes(3).toString("hex")}`;

  try {
    const stream = new StreamClient(apiKey, apiSecret);

    await stream.upsertUsers([
      {
        id: interviewee.clerkUserId,
        name: interviewee.name ?? "Interviewee",
        image: interviewee.imageUrl ?? undefined,
        role: "user",
      },
      {
        id: interviewer.clerkUserId,
        name: interviewer.name ?? "Interviewer",
        image: interviewer.imageUrl ?? undefined,
        role: "user",
      },
    ]);

    await stream.video.call("default", callId).getOrCreate({
      data: {
        created_by_id: interviewee.clerkUserId,
        members: [
          { user_id: interviewee.clerkUserId, role: "host" },
          { user_id: interviewer.clerkUserId, role: "host" },
        ],
        settings_override: {
          recording: { mode: "available", quality: "1080p" },
          screensharing: { enabled: true },
          transcription: { mode: "auto-on" },
        },
      },
    });

    console.log(`📹 Created Stream call ${callId}`);
    return callId;
  } catch (err) {
    console.warn(
      `⚠️  Could not create Stream call (${err.message}) — using placeholder id`
    );
    return fallback;
  }
}

// ───────────────────────────────────────────────────────────
// Demo bookings for the signed-in user (as interviewee)
// ───────────────────────────────────────────────────────────
const demoBookings = [
  {
    key: "upcoming-1",
    interviewer: "user_seed_i06",
    days: 2,
    hour: 18,
    status: "SCHEDULED",
    credits: 4,
  },
  {
    key: "upcoming-2",
    interviewer: "user_seed_i02",
    days: 6,
    hour: 11,
    status: "SCHEDULED",
    credits: 4,
  },
  {
    key: "cancelled-1",
    interviewer: "user_seed_i01",
    days: 9,
    hour: 15,
    status: "CANCELLED",
    credits: 3,
  },
  {
    key: "completed-1",
    interviewer: "user_seed_i04",
    days: -6,
    hour: 17,
    status: "COMPLETED",
    credits: 5,
  },
  {
    key: "completed-2",
    interviewer: "user_seed_i08",
    days: -13,
    hour: 18,
    status: "COMPLETED",
    credits: 5,
  },
];

const feedback = {
  "completed-1": {
    summary:
      "Strong mid-level fullstack performance. You communicate trade-offs clearly and your React/Next.js knowledge is current. The gap is production architecture: queues, retries and idempotency still need work before senior interviews.",
    technical:
      "Solid modern JavaScript and Next.js App Router fundamentals. Your component decomposition and data-fetching choices were sensible. You hesitated on cache invalidation and didn't discuss failure modes when designing the ordering flow.",
    communication:
      "Calm, structured and honest. You paraphrased the requirements before coding and asked good clarifying questions. Slow down slightly when explaining architecture — narrate the plan before the code.",
    problemSolving:
      "Worked through the rate-limiter question methodically and caught your own edge case. Next time, estimate capacity (QPS, storage) before committing to a design.",
    recommendation: "Hire",
    strengths: [
      "Clear communication of trade-offs",
      "Current Next.js App Router knowledge",
      "Methodical debugging under pressure",
    ],
    improvements: [
      "Practice queue-based decoupling and idempotency",
      "Estimate capacity before designing",
      "Add observability vocabulary (metrics, tracing)",
    ],
    overallRating: "GOOD",
    sessionRating: 4,
    sessionComment:
      "Great energy and honest self-assessment — that's exactly what interviewers want to see. Book a follow-up focused on system design.",
  },
  "completed-2": {
    summary:
      "Excellent behavioral interview. Your STAR stories are structured, metric-driven and land without sounding rehearsed. Polish the endings of conflict stories and you're ready for EM-track loops.",
    technical:
      "System design was intentionally light in this behavioral session. The notification-service sketch was reasonable; deeper backpressure and rate-limiting discussion would be expected at senior level.",
    communication:
      "Model STAR storytelling with numbers in every story. Warm, concise and emotionally intelligent. One conflict story ended without explicitly stating the resolution.",
    problemSolving:
      "Reframed an ambiguous prioritization question by asking about consequences first — the right instinct for product and fintech roles.",
    recommendation: "Strong Hire",
    strengths: [
      "Structured STAR storytelling with metrics",
      "Stakeholder-aware decision making",
      "Emotionally intelligent conflict handling",
    ],
    improvements: [
      "Close conflict stories with explicit outcomes",
      "Deepen queue backpressure and rate-limiting design",
      "Prepare a 90-day plan narrative for lead roles",
    ],
    overallRating: "EXCELLENT",
    sessionRating: 5,
    sessionComment:
      "You're interview-ready today. Keep the momentum and target the companies you actually want — don't settle early.",
  },
};

async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const email = process.argv[2] || process.env.DEMO_USER_EMAIL || null;

    const userRes = email
      ? await client.query(`SELECT * FROM "User" WHERE email = $1`, [email])
      : await client.query(
          `SELECT * FROM "User"
           WHERE "clerkUserId" NOT LIKE 'user_seed_%'
           ORDER BY "createdAt" DESC
           LIMIT 1`
        );

    const user = userRes.rows[0];
    if (!user) {
      throw new Error(
        email
          ? `No user found with email ${email}`
          : "No signed-in (non-seed) user found. Sign in once, then re-run."
      );
    }

    console.log(`🎯 Seeding appointments for ${user.name} <${user.email}>`);

    // 1. Clean previous demo bookings for this user
    const prev = await client.query(
      `SELECT id FROM "Booking"
       WHERE "intervieweeId" = $1 AND "streamCallId" LIKE 'demo_%'`,
      [user.id]
    );
    const prevIds = prev.rows.map((r) => r.id);
    if (prevIds.length > 0) {
      await client.query(
        `DELETE FROM "CreditTransaction" WHERE "bookingId" = ANY($1)`,
        [prevIds]
      );
      await client.query(`DELETE FROM "Booking" WHERE id = ANY($1)`, [prevIds]);
      console.log(`🧹 Removed ${prevIds.length} previous demo bookings`);
    }

    // 2. Make sure the account can use the interviewee side of the app
    await client.query(
      `UPDATE "User"
       SET role = 'INTERVIEWEE',
           credits = 50,
           "currentPlan" = 'free',
           "creditsLastAllocatedAt" = NOW(),
           "updatedAt" = NOW()
       WHERE id = $1`,
      [user.id]
    );
    console.log("👤 Role set to INTERVIEWEE with 50 credits");

    // 3. Insert demo bookings
    const bookingIds = {};
    for (const b of demoBookings) {
      const interviewer = await client.query(
        `SELECT id, "clerkUserId", name, "imageUrl" FROM "User" WHERE "clerkUserId" = $1`,
        [b.interviewer]
      );
      if (!interviewer.rows[0]) {
        throw new Error(
          `Missing seed interviewer ${b.interviewer} — run \`npm run seed\` first.`
        );
      }

      const start = at(b.days, b.hour);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const created = at(b.days < 0 ? b.days - 3 : -3, 12);
      const updated =
        b.status === "CANCELLED"
          ? at(b.days < 0 ? b.days + 1 : b.days - 1, 14)
          : created;

      // Upcoming sessions need a real Stream call, otherwise "Join call"
      // opens a call that doesn't exist on Stream and never connects.
      const streamCallId =
        b.status === "SCHEDULED"
          ? await createStreamCall(user, interviewer.rows[0], b.key)
          : `demo_${b.key}_${user.id.slice(0, 8)}`;

      const res = await client.query(
        `INSERT INTO "Booking"
           (id, "intervieweeId", "interviewerId", "startTime", "endTime", status,
            "creditsCharged", "streamCallId", "recordingUrl", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING id`,
        [
          uuid(),
          user.id,
          interviewer.rows[0].id,
          start,
          end,
          b.status,
          b.credits,
          streamCallId,
          b.status === "COMPLETED"
            ? `https://recordings.prept.example/demo/${b.key}.mp4`
            : null,
          created,
          updated,
        ]
      );
      bookingIds[b.key] = res.rows[0].id;
    }
    console.log(`📅 Inserted ${demoBookings.length} demo bookings`);

    // 4. Feedback for completed sessions
    let fbCount = 0;
    for (const [key, f] of Object.entries(feedback)) {
      const booking = demoBookings.find((b) => b.key === key);
      const start = at(booking.days, booking.hour);
      const createdAt = new Date(start.getTime() + 2 * 60 * 60 * 1000);

      await client.query(
        `INSERT INTO "Feedback"
           (id, "bookingId", summary, technical, communication, "problemSolving",
            recommendation, strengths, improvements, "overallRating",
            "sessionRating", "sessionComment", "createdAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [
          uuid(),
          bookingIds[key],
          f.summary,
          f.technical,
          f.communication,
          f.problemSolving,
          f.recommendation,
          f.strengths,
          f.improvements,
          f.overallRating,
          f.sessionRating,
          f.sessionComment,
          createdAt,
        ]
      );
      fbCount++;
    }
    console.log(`📝 Inserted ${fbCount} feedback records`);

    // 5. Credit ledger: purchase + deductions (cancelled bookings are refunded)
    await client.query(
      `INSERT INTO "CreditTransaction" (id, "userId", amount, type, "bookingId", "createdAt")
       VALUES ($1,$2,50,'CREDIT_PURCHASE',NULL,$3)`,
      [uuid(), user.id, at(-20, 11)]
    );
    let txCount = 1;
    for (const b of demoBookings) {
      if (b.status === "CANCELLED") continue;
      const when = at(b.days < 0 ? b.days - 1 : -1, 13);
      await client.query(
        `INSERT INTO "CreditTransaction" (id, "userId", amount, type, "bookingId", "createdAt")
         VALUES ($1,$2,$3,'BOOKING_DEDUCTION',$4,$5)`,
        [uuid(), user.id, -b.credits, bookingIds[b.key], when]
      );
      txCount++;
    }
    console.log(`💰 Inserted ${txCount} credit transactions`);

    // 6. Mark the upcoming slots as BOOKED in availability, if they exist
    for (const b of demoBookings) {
      if (b.status !== "SCHEDULED") continue;
      const start = at(b.days, b.hour);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      await client.query(
        `UPDATE "Availability" SET status = 'BOOKED'
         WHERE "interviewerId" = (SELECT id FROM "User" WHERE "clerkUserId" = $1)
           AND "startTime" = $2 AND "endTime" = $3`,
        [b.interviewer, start, end]
      );
    }

    await client.query("COMMIT");

    const counts = await client.query(
      `SELECT status, COUNT(*)::int AS count
       FROM "Booking" WHERE "intervieweeId" = $1
       GROUP BY status ORDER BY status`,
      [user.id]
    );
    console.log("\n✅ Done! Bookings for this account:");
    for (const row of counts.rows) {
      console.log(`   ${row.status}: ${row.count}`);
    }
    console.log("\n   Open http://localhost:3000/appointments");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Demo seed failed — rolled back.");
    console.error(err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
