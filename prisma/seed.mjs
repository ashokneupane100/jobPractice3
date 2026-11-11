// Seed script — inserts demo data for every model in prisma/schema.prisma
// Nepal / Kirtipur context, in praise of Gagan Thapa and Nepali Congress.
//
// Run with:  npm run seed   (or: node prisma/seed.mjs)
// Safe to re-run: only touches users whose clerkUserId starts with "user_seed_".

import "dotenv/config";
import crypto from "node:crypto";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DIRECT_URL });

const uuid = () => crypto.randomUUID();
const DAY = 86_400_000;
const now = Date.now();

// A datetime `offsetDays` from today at a fixed hour (local time).
const at = (offsetDays, hour, minute = 0) => {
  const d = new Date(now + offsetDays * DAY);
  d.setHours(hour, minute, 0, 0);
  return d;
};

const avatar = (name, bg) =>
  `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bg}&color=fff&size=256`;

// ───────────────────────────────────────────────────────────
// 8 INTERVIEWERS — senior engineers from Nepal's top tech companies
// ───────────────────────────────────────────────────────────
const interviewers = [
  {
    clerk: "user_seed_i01",
    name: "Anish Shrestha",
    email: "anish.shrestha@deerwalk.com",
    imageUrl: avatar("Anish Shrestha", "0D8ABC"),
    title: "Senior Frontend Engineer",
    company: "Deerwalk Services",
    yearsExp: 9,
    categories: ["FRONTEND", "FULLSTACK"],
    creditRate: 3,
    creditBalance: 2, // earned 6, paid out 4
    createdDaysAgo: 60,
    bio: "TU Kirtipur alum, born and raised in Kirtipur. I coach React, TypeScript and interview craft, and I volunteer at weekend coding camps for ward youth — inspired by Gagan Thapa's Digital Nepal vision and Nepali Congress's push to get more Nepali youth into tech. Chhimeki ho, ask me anything!",
  },
  {
    clerk: "user_seed_i02",
    name: "Sunita Maharjan",
    email: "sunita.maharjan@f1soft.com",
    imageUrl: avatar("Sunita Maharjan", "8B5CF6"),
    title: "Staff Backend Engineer",
    company: "F1Soft International",
    yearsExp: 11,
    categories: ["BACKEND", "SYSTEM_DESIGN"],
    creditRate: 4,
    creditBalance: 4, // earned 4
    createdDaysAgo: 55,
    bio: "I build payment systems that move billions of rupees a year and interview dozens of backend candidates every hiring season. Gagan Thapa keeps saying our youth deserve world-class opportunities at home — mentoring is how I help make that real.",
  },
  {
    clerk: "user_seed_i03",
    name: "Bibek Thapa",
    email: "bibek.thapa@cloudfactory.com",
    imageUrl: avatar("Bibek Thapa", "F59E0B"),
    title: "DevOps Lead",
    company: "CloudFactory Nepal",
    yearsExp: 8,
    categories: ["DEVOPS"],
    creditRate: 3,
    creditBalance: 3, // earned 3
    createdDaysAgo: 50,
    bio: "Kubernetes, Terraform, AWS and CI/CD pipelines are my daily bread. I run free Linux workshops at the Kirtipur community library on Saturdays with the Nepali Congress digital literacy volunteers — knowledge, like roads and schools, should reach every village.",
  },
  {
    clerk: "user_seed_i04",
    name: "Prakriti Adhikari",
    email: "prakriti.adhikari@fusemachines.com",
    imageUrl: avatar("Prakriti Adhikari", "10B981"),
    title: "Principal Fullstack Engineer",
    company: "Fusemachines",
    yearsExp: 12,
    categories: ["FULLSTACK", "SYSTEM_DESIGN"],
    creditRate: 5,
    creditBalance: 0, // earned 5, paid out 5
    createdDaysAgo: 46,
    bio: "Principal engineer by day, system-design interviewer by night. I admire Gagan Thapa's pragmatism — good engineering, like good politics, is about clear thinking and honest trade-offs. Bring your hardest scaling questions.",
  },
  {
    clerk: "user_seed_i05",
    name: "Nabin Gurung",
    email: "nabin.gurung@pathao.com",
    imageUrl: avatar("Nabin Gurung", "EF4444"),
    title: "Mobile Team Lead",
    company: "Pathao Nepal",
    yearsExp: 7,
    categories: ["MOBILE", "FULLSTACK"],
    creditRate: 3,
    creditBalance: 3, // earned 3
    createdDaysAgo: 40,
    bio: "I lead the mobile team that keeps Pathao riders moving across Kathmandu's hills. Flutter, React Native, and offline-first apps for Nepal's bandwidth reality. Jai Gagan Thapa — more Nepali devs shipping world-class products from Kirtipur and beyond!",
  },
  {
    clerk: "user_seed_i06",
    name: "Sabina Karki",
    email: "sabina.karki@cotiviti.com",
    imageUrl: avatar("Sabina Karki", "6366F1"),
    title: "Senior Software Engineer",
    company: "Cotiviti Nepal",
    yearsExp: 10,
    categories: ["DSA", "BEHAVIORAL"],
    creditRate: 4,
    creditBalance: 2, // earned 8, paid out 6
    createdDaysAgo: 36,
    bio: "DSA coach with 200+ students taught across Kathmandu. I believe in Nepali Congress's education-first politics — an interview-ready engineer in every tole of Kirtipur. Bring your LeetCode struggles, we'll turn them into offers.",
  },
  {
    clerk: "user_seed_i07",
    name: "Kiran Tamang",
    email: "kiran.tamang@lftechnology.com",
    imageUrl: avatar("Kiran Tamang", "14B8A6"),
    title: "Frontend Architect",
    company: "Leapfrog Technology",
    yearsExp: 9,
    categories: ["FRONTEND", "BEHAVIORAL"],
    creditRate: 3,
    creditBalance: 3, // earned 3
    createdDaysAgo: 33,
    bio: "Frontend architect and accessibility champion from the beautiful lanes of Kirtipur. I review UI code the way Gagan Thapa reviews a bill — line by line, no compromise on quality.",
  },
  {
    clerk: "user_seed_i08",
    name: "Manisha Rai",
    email: "manisha.rai@esewa.com.np",
    imageUrl: avatar("Manisha Rai", "EC4899"),
    title: "Engineering Manager",
    company: "eSewa Fonepay",
    yearsExp: 13,
    categories: ["BEHAVIORAL", "SYSTEM_DESIGN"],
    creditRate: 5,
    creditBalance: 2, // earned 5, paid out 3
    createdDaysAgo: 30,
    bio: "EM at eSewa Fonepay, 13 years in fintech. I run behavioral and system-design mocks because I've sat on both sides of 300+ interviews. When Gagan Thapa says our youth shouldn't have to fly abroad to prove themselves, I take it personally — let's get you hired.",
  },
];

// ───────────────────────────────────────────────────────────
// 12 INTERVIEWEES — job seekers prepping with mock interviews
// ───────────────────────────────────────────────────────────
const interviewees = [
  { clerk: "user_seed_e01", name: "Suman Basnet", email: "suman.basnet@gmail.com", imageUrl: avatar("Suman Basnet", "3B82F6"), plan: "free", credits: 47, createdDaysAgo: 28 }, // +50 buy, -3 booked
  { clerk: "user_seed_e02", name: "Anita Bhandari", email: "anita.bhandari@gmail.com", imageUrl: avatar("Anita Bhandari", "F472B6"), plan: "free", credits: 46, createdDaysAgo: 26 }, // +50, -4
  { clerk: "user_seed_e03", name: "Deepak Shrestha", email: "deepak.shrestha@gmail.com", imageUrl: avatar("Deepak Shrestha", "A78BFA"), plan: "pro", credits: 95, createdDaysAgo: 25 }, // +100, -5
  { clerk: "user_seed_e04", name: "Gita Khadka", email: "gita.khadka@gmail.com", imageUrl: avatar("Gita Khadka", "34D399"), plan: "free", credits: 47, createdDaysAgo: 22 }, // +50, -3
  { clerk: "user_seed_e05", name: "Hari Poudel", email: "hari.poudel@gmail.com", imageUrl: avatar("Hari Poudel", "FBBF24"), plan: "free", credits: 56, createdDaysAgo: 20 }, // +50, +10 admin, -4
  { clerk: "user_seed_e06", name: "Nisha Joshi", email: "nisha.joshi@gmail.com", imageUrl: avatar("Nisha Joshi", "FB923C"), plan: "pro", credits: 95, createdDaysAgo: 18 }, // +100, -5
  { clerk: "user_seed_e07", name: "Binod Magar", email: "binod.magar@gmail.com", imageUrl: avatar("Binod Magar", "22D3EE"), plan: "free", credits: 46, createdDaysAgo: 15 }, // +50, -4
  { clerk: "user_seed_e08", name: "Sarita Neupane", email: "sarita.neupane@gmail.com", imageUrl: avatar("Sarita Neupane", "C084FC"), plan: "free", credits: 47, createdDaysAgo: 13 }, // +50, -3
  { clerk: "user_seed_e09", name: "Ramesh Bhattarai", email: "ramesh.bhattarai@gmail.com", imageUrl: avatar("Ramesh Bhattarai", "F87171"), plan: "free", credits: 47, createdDaysAgo: 11 }, // +50, -3
  { clerk: "user_seed_e10", name: "Puja Lamichhane", email: "puja.lamichhane@gmail.com", imageUrl: avatar("Puja Lamichhane", "2DD4BF"), plan: "free", credits: 47, createdDaysAgo: 9 }, // +50, -3
  { clerk: "user_seed_e11", name: "Kamal Sapkota", email: "kamal.sapkota@gmail.com", imageUrl: avatar("Kamal Sapkota", "94A3B8"), plan: "free", credits: 50, createdDaysAgo: 7 }, // +50 (booking cancelled)
  { clerk: "user_seed_e12", name: "Laxmi Gurung", email: "laxmi.gurung@gmail.com", imageUrl: avatar("Laxmi Gurung", "E879F9"), plan: "free", credits: 50, createdDaysAgo: 5 }, // +50 (booking cancelled)
];

// ───────────────────────────────────────────────────────────
// BOOKINGS — completed (with feedback), scheduled, cancelled
// interviewerKey / intervieweeKey refer to arrays above
// ───────────────────────────────────────────────────────────
const bookings = [
  { key: "b01", i: "i01", e: "e01", days: -12, hour: 18, credits: 3, status: "COMPLETED", call: "call_seed_b01", recording: "https://recordings.prept.example/seed/b01.mp4" },
  { key: "b02", i: "i06", e: "e02", days: -10, hour: 17, credits: 4, status: "COMPLETED", call: "call_seed_b02", recording: "https://recordings.prept.example/seed/b02.mp4" },
  { key: "b03", i: "i04", e: "e03", days: -8, hour: 15, credits: 5, status: "COMPLETED", call: "call_seed_b03", recording: "https://recordings.prept.example/seed/b03.mp4" },
  { key: "b04", i: "i07", e: "e04", days: -6, hour: 11, credits: 3, status: "COMPLETED", call: "call_seed_b04", recording: "https://recordings.prept.example/seed/b04.mp4" },
  { key: "b05", i: "i02", e: "e05", days: -5, hour: 18, minutes: 30, credits: 4, status: "COMPLETED", call: "call_seed_b05", recording: "https://recordings.prept.example/seed/b05.mp4" },
  { key: "b06", i: "i08", e: "e06", days: -3, hour: 16, credits: 5, status: "COMPLETED", call: "call_seed_b06", recording: "https://recordings.prept.example/seed/b06.mp4" },
  { key: "b07", i: "i06", e: "e07", days: 3, hour: 18, credits: 4, status: "SCHEDULED", call: "call_seed_b07", recording: null },
  { key: "b08", i: "i03", e: "e08", days: 5, hour: 10, credits: 3, status: "SCHEDULED", call: "call_seed_b08", recording: null },
  { key: "b09", i: "i01", e: "e09", days: 7, hour: 17, credits: 3, status: "SCHEDULED", call: "call_seed_b09", recording: null },
  { key: "b10", i: "i05", e: "e10", days: 10, hour: 14, credits: 3, status: "SCHEDULED", call: "call_seed_b10", recording: null },
  { key: "b11", i: "i04", e: "e11", days: -2, hour: 19, credits: 5, status: "CANCELLED", call: "call_seed_b11", recording: null },
  { key: "b12", i: "i02", e: "e12", days: 4, hour: 16, credits: 4, status: "CANCELLED", call: "call_seed_b12", recording: null },
];

// Feedback only exists for COMPLETED bookings
const feedback = {
  b01: {
    summary:
      "Suman is a promising junior frontend developer. Solid React fundamentals with clean component structure and honest self-awareness about his gaps. With 4–6 more weeks of deliberate practice on state management and testing, he'll be a strong hire for any Kathmandu product team.",
    technical:
      "Good grasp of React hooks and JSX composition. Explained the virtual DOM correctly and used Tailwind utilities sensibly. Weaker on performance patterns (memoization, list virtualization) and had never written a React test. JavaScript closures were a bit shaky under pressure.",
    communication:
      "Very coachable — asked clarifying questions before coding and paraphrased requirements back. English is functional and improving; occasional hesitation, but he never bluff-ed an answer, which interviewers love. Told a charming story about debugging his college project during load-shedding in Kirtipur.",
    problemSolving:
      "Approached the React filter/sort exercise methodically and caught his own off-by-one error. Got stuck on the debounce question but recovered with a hint. Needs more exposure to LeetCode-style timed practice.",
    recommendation: "Strong Hire",
    strengths: ["Clean React component structure", "Good Tailwind CSS utility usage", "Coachable and honest about gaps", "Solid HTML/CSS fundamentals"],
    improvements: ["Practice React performance optimization (memoization, virtualization)", "Learn testing with Vitest and React Testing Library", "Strengthen JavaScript closures and event loop basics"],
    overallRating: "EXCELLENT",
    sessionRating: 5,
    sessionComment:
      "Mentoring a TU Kirtipur student on the very campus where I studied — this is the Digital Nepal Gagan Thapa talks about! Suman bhai, keep this energy and you'll go far. Jai Nepali Congress!",
  },
  b02: {
    summary:
      "Anita has real potential for mid-level backend roles. Her Node.js and PostgreSQL knowledge is genuine, built through freelance gigs rather than tutorials. System design vocabulary needs polish, but her instincts are sound.",
    technical:
      "Comfortable with Express routing, middleware chains and basic SQL joins. Designed a reasonable REST API for a Kirtipur homestay booking scenario. Indexing and N+1 query awareness were missing; Redis caching was theoretical only.",
    communication:
      "Direct and organized communicator. Occasionally jumped into code before fully stating assumptions — slow down and narrate your plan first. Great answer about prioritizing paid client work while freelancing from Bhaktapur.",
    problemSolving:
      "Solved the rate-limiter design question in two passes after reconsidering her data structure choice. Showed good instinct by asking about traffic patterns before designing the schema.",
    recommendation: "Hire",
    strengths: ["Practical REST API design", "Genuine production experience from freelance work", "Willingness to reconsider approaches mid-solution"],
    improvements: ["Learn database indexing and query planning", "Practice articulating system design trade-offs out loud", "Add caching strategies (Redis) to your toolkit"],
    overallRating: "GOOD",
    sessionRating: 4,
    sessionComment:
      "Anita didi represents exactly the self-taught grit Nepali Congress's education campaigns champion. Book a follow-up before your eSewa interview!",
  },
  b03: {
    summary:
      "Deepak interviews as a mid-level fullstack developer, but his system design answers are still junior. JavaScript is strong; architecture thinking is the gap. Recommend focused system design practice before targeting senior roles.",
    technical:
      "Strong JavaScript (closures, promises, async/await all fluent). Next.js App Router understanding is current. But he designed a monolith where the question asked for queue-based decoupling, and couldn't estimate memory for his own cache design.",
    communication:
      "Confident, sometimes overconfident — interrupted twice to finish my sentences incorrectly. When he slowed down, his explanations were clear. Frame your experience with numbers (requests/sec, uptime, users) — vague claims weaken strong work.",
    problemSolving:
      "The online-ordering flow (KiranaPasal case study) was solved functionally but without discussing failure modes, retries or idempotency — the exact things production systems live or die by.",
    recommendation: "Borderline",
    strengths: ["Fluent modern JavaScript", "Current Next.js knowledge", "Fast coding speed"],
    improvements: ["Study async architecture: queues, retries, idempotency", "Practice capacity estimation (QPS, storage)", "Let interviewers finish their questions"],
    overallRating: "AVERAGE",
    sessionRating: 3,
    sessionComment:
      "Deepak bhai, your code is good — your architecture story isn't yet. Even Gagan Thapa prepares before a parliament debate! Two more sessions and you'll be ready.",
  },
  b04: {
    summary:
      "Gita is an exceptional junior frontend candidate — the strongest CSS fundamentals I've evaluated this year. Lacks React depth today, but her learning velocity is unmistakable. Any team that skips her is losing out.",
    technical:
      " pixel-perfect implementation of a responsive card layout using modern CSS (container queries, clamp(), grid). Semantic HTML was flawless. React state management is beginner-level and she admitted it — honesty noted and rewarded.",
    communication:
      "Warm, precise, and structured. Explained every CSS decision with a reason ('I used clamp() here because Kirtipur users on mid-range phones need fluid type'). This is exactly how senior engineers narrate decisions.",
    problemSolving:
      "Recreated a broken layout from a screenshot in 20 minutes with three valid approaches, then explained the trade-offs of each. Rare maturity for her experience level.",
    recommendation: "Strong Hire",
    strengths: ["Elite CSS fundamentals", "Semantic, accessible HTML", "Explains decisions with reasoning", "Fast, self-directed learner"],
    improvements: ["Deepen React state patterns (Context, reducers)", "Build one full CRUD app end-to-end", "Learn testing basics"],
    overallRating: "EXCELLENT",
    sessionRating: 5,
    sessionComment:
      "Gita didi from Kirtipur Newar background blending traditional art sense with web craft — Nepal's daughters are unstoppable when given the chance. Nepali Congress's scholarship programs should find more Gitas!",
  },
  b05: {
    summary:
      "Hari is backend-ready today for product companies and within reach of fintech standards. His transaction and idempotency knowledge is directly applicable to payment systems. Recommend targeting F1Soft-class companies immediately.",
    technical:
      "Designed a double-entry ledger for a remittance scenario unprompted — correct debit/credit pairing and idempotency keys. Weak spot: connection pooling behavior under high concurrency. PostgreSQL indexing was theoretical.",
    communication:
      "Calm, methodical, zero hand-waving. When he didn't know something, he said 'I haven't worked with that, but here's how I'd reason about it' — and then reasoned correctly. Senior-engineer communication habits.",
    problemSolving:
      "Handled the 'eSewa-like payment failure' edge cases (retries, partial failures, reconciliation) better than most mid-level engineers I've interviewed at F1Soft.",
    recommendation: "Hire",
    strengths: ["Payment-systems thinking (idempotency, reconciliation)", "Honest calibration of his own knowledge", "Calm under pressure", "Production PostgreSQL experience"],
    improvements: ["Study connection pooling and concurrency tuning", "Add observability vocabulary (metrics, tracing)", "Practice time-boxed mock interviews to build stamina"],
    overallRating: "GOOD",
    sessionRating: 4,
    sessionComment:
      "Hari's remittance-domain depth comes from watching his family's business in Kirtipur bazaar — real Nepal experience beats textbook knowledge. Gagan Thapa would call this the strength of our grassroots economy!",
  },
  b06: {
    summary:
      "Nisha is management-track ready. Her behavioral answers are structured (STAR), authentic, and land emotionally without manipulation. Strongest behavioral performance among recent candidates; minor polish on conflict-narrative endings.",
    technical:
      "System design was deliberately light in this behavioral-focused session: she sketched a reasonable notification service for a Nepali bank with correct use of queues. Deeper backpressure handling would be expected at staff level.",
    communication:
      "Model STAR storytelling. Her answer about migrating a legacy QA process at her Kathmandu company included metrics (30% regression bugs caught pre-release) — numbers in every story. Only note: one conflict story ended without explicitly stating the resolution.",
    problemSolving:
      "Reframed an ambiguous prioritization question ('Nepal Rastra Bank deadline vs. feature request') by asking about regulatory consequences first — exactly the right instinct for fintech.",
    recommendation: "Strong Hire",
    strengths: ["Structured STAR storytelling with metrics", "Stakeholder-aware decision making", "Regulatory/compliance instincts", "Emotionally intelligent conflict handling"],
    improvements: ["Close conflict stories with explicit outcomes", "Deepen queue backpressure and rate-limiting design", "Prepare a 90-day plan narrative for EM interviews"],
    overallRating: "EXCELLENT",
    sessionRating: 5,
    sessionComment:
      "Nisha's story of running free weekend QA classes for young women in Kirtipur while working full-time embodies the seva spirit. This is the Nepal Nepali Congress builds for — women leading from every ward!",
  },
};

// ───────────────────────────────────────────────────────────
// Credit transactions
// purchases (interviewees) + booking deductions/earnings + 1 admin adjustment
// ───────────────────────────────────────────────────────────
const purchases = [
  { e: "e01", amount: 50, days: -20 },
  { e: "e02", amount: 50, days: -18 },
  { e: "e03", amount: 100, days: -17 },
  { e: "e04", amount: 50, days: -14 },
  { e: "e05", amount: 50, days: -12 },
  { e: "e06", amount: 100, days: -10 },
  { e: "e07", amount: 50, days: -9 },
  { e: "e08", amount: 50, days: -7 },
  { e: "e09", amount: 50, days: -6 },
  { e: "e10", amount: 50, days: -5 },
  { e: "e11", amount: 50, days: -4 },
  { e: "e12", amount: 50, days: -3 },
];

const adminAdjustments = [
  // Dashain goodwill credit from the platform
  { e: "e05", amount: 10, days: -6 },
];

// ───────────────────────────────────────────────────────────
// Payouts — 2 processed, 2 processing (1 credit = NPR 100, 20% platform fee)
// ───────────────────────────────────────────────────────────
const payouts = [
  {
    i: "i01", credits: 4, platformFee: 80.0, netAmount: 320.0, status: "PROCESSED",
    paymentMethod: "eSewa", paymentDetail: "eSewa • 9841234501 (Anish Shrestha)",
    adminNote: "Paid out. Thank you for mentoring TU Kirtipur students!",
    createdDaysAgo: -2, processedDaysAgo: -1, processedBy: "Admin (Ashok Neupane)",
  },
  {
    i: "i06", credits: 6, platformFee: 120.0, netAmount: 480.0, status: "PROCESSED",
    paymentMethod: "Khalti", paymentDetail: "Khalti • 9812345678 (Sabina Karki)",
    adminNote: "Paid out after DSA bootcamp batch completion. Sabina jhai Ramro!",
    createdDaysAgo: -4, processedDaysAgo: -3, processedBy: "Admin (Ashok Neupane)",
  },
  {
    i: "i04", credits: 5, platformFee: 100.0, netAmount: 400.0, status: "PROCESSING",
    paymentMethod: "IME Pay", paymentDetail: "IME Pay • 9852001122 (Prakriti Adhikari)",
    adminNote: "Awaiting KYC verification at IME Pay.",
    createdDaysAgo: -1, processedDaysAgo: null, processedBy: null,
  },
  {
    i: "i08", credits: 3, platformFee: 60.0, netAmount: 240.0, status: "PROCESSING",
    paymentMethod: "Bank Transfer", paymentDetail: "NIC Asia Bank ••••4521 (Manisha Rai)",
    adminNote: "Bank transfer queued for Friday settlement.",
    createdDaysAgo: -1, processedDaysAgo: null, processedBy: null,
  },
];

// ───────────────────────────────────────────────────────────
// MAIN
// ───────────────────────────────────────────────────────────
async function main() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Clean previous seed data (only seed users; real Clerk users untouched)
    const prev = await client.query(
      `SELECT id FROM "User" WHERE "clerkUserId" LIKE 'user_seed_%'`
    );
    const prevIds = prev.rows.map((r) => r.id);
    if (prevIds.length > 0) {
      await client.query(`DELETE FROM "Feedback" WHERE "bookingId" IN (SELECT b.id FROM "Booking" b WHERE b."intervieweeId" = ANY($1) OR b."interviewerId" = ANY($1))`, [prevIds]);
      await client.query(`DELETE FROM "CreditTransaction" WHERE "userId" = ANY($1) OR "bookingId" IN (SELECT b.id FROM "Booking" b WHERE b."intervieweeId" = ANY($1) OR b."interviewerId" = ANY($1))`, [prevIds]);
      await client.query(`DELETE FROM "Payout" WHERE "interviewerId" = ANY($1)`, [prevIds]);
      await client.query(`DELETE FROM "Booking" WHERE "intervieweeId" = ANY($1) OR "interviewerId" = ANY($1)`, [prevIds]);
      await client.query(`DELETE FROM "Availability" WHERE "interviewerId" = ANY($1)`, [prevIds]);
      await client.query(`DELETE FROM "User" WHERE id = ANY($1)`, [prevIds]);
      console.log(`🧹 Removed ${prevIds.length} previous seed users (and related data)`);
    }

    // 2. Insert interviewers
    const userIds = {}; // clerk-key -> db id
    for (const u of interviewers) {
      const created = at(-u.createdDaysAgo, 10);
      const res = await client.query(
        `INSERT INTO "User"
           (id, "clerkUserId", email, name, "imageUrl", role, "createdAt", "updatedAt",
            credits, "currentPlan", "creditsLastAllocatedAt",
            bio, title, company, "yearsExp", categories, "creditRate", "creditBalance")
         VALUES ($1,$2,$3,$4,$5,'INTERVIEWER',$6,$6, 0,'free',NULL, $7,$8,$9,$10,$11,$12,$13)
         RETURNING id`,
        [uuid(), u.clerk, u.email, u.name, u.imageUrl, created, u.bio, u.title, u.company, u.yearsExp, u.categories, u.creditRate, u.creditBalance]
      );
      userIds[u.clerk] = res.rows[0].id;
    }
    console.log(`👤 Inserted ${interviewers.length} interviewers`);

    // 3. Insert interviewees
    for (const u of interviewees) {
      const created = at(-u.createdDaysAgo, 12);
      const allocated = at(-Math.min(u.createdDaysAgo, 28), 9); // monthly free-plan allocation
      const res = await client.query(
        `INSERT INTO "User"
           (id, "clerkUserId", email, name, "imageUrl", role, "createdAt", "updatedAt",
            credits, "currentPlan", "creditsLastAllocatedAt",
            "creditRate", "creditBalance")
         VALUES ($1,$2,$3,$4,$5,'INTERVIEWEE',$6,$6, $7,$8,$9, 1, 0)
         RETURNING id`,
        [uuid(), u.clerk, u.email, u.name, u.imageUrl, created, u.credits, u.plan, allocated]
      );
      userIds[u.clerk] = res.rows[0].id;
    }
    console.log(`👤 Inserted ${interviewees.length} interviewees`);

    // 4. Insert bookings (+ capture ids), skipping none
    const bookingIds = {}; // key -> db id
    for (const b of bookings) {
      const start = at(b.days, b.hour, b.minutes ?? 0);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const createdOffset = b.days < 0 ? b.days - 2 : -2; // booked a couple days before
      const created = at(createdOffset, 13);
      const updated = b.status === "CANCELLED" ? at(b.days < 0 ? b.days + 1 : b.days - 1, 15) : created;
      const res = await client.query(
        `INSERT INTO "Booking"
           (id, "intervieweeId", "interviewerId", "startTime", "endTime", status,
            "creditsCharged", "streamCallId", "recordingUrl", "createdAt", "updatedAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         RETURNING id`,
        [uuid(), userIds[`user_seed_${b.e}`], userIds[`user_seed_${b.i}`], start, end,
         b.status, b.credits, b.call, b.recording, created, updated]
      );
      bookingIds[b.key] = res.rows[0].id;
    }
    console.log(`📅 Inserted ${bookings.length} bookings (${bookings.filter(b => b.status === "COMPLETED").length} completed, ${bookings.filter(b => b.status === "SCHEDULED").length} scheduled, ${bookings.filter(b => b.status === "CANCELLED").length} cancelled)`);

    // 5. Insert feedback for completed bookings
    let fbCount = 0;
    for (const b of bookings) {
      const f = feedback[b.key];
      if (!f) continue;
      const end = at(b.days, b.hour, b.minutes ?? 0);
      const fbCreated = new Date(end.getTime() + 2 * 60 * 60 * 1000);
      await client.query(
        `INSERT INTO "Feedback"
           (id, "bookingId", summary, technical, communication, "problemSolving",
            recommendation, strengths, improvements, "overallRating",
            "sessionRating", "sessionComment", "createdAt")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [uuid(), bookingIds[b.key], f.summary, f.technical, f.communication, f.problemSolving,
         f.recommendation, f.strengths, f.improvements, f.overallRating,
         f.sessionRating, f.sessionComment, fbCreated]
      );
      fbCount++;
    }
    console.log(`📝 Inserted ${fbCount} feedback records`);

    // 6. Insert credit transactions
    // a) purchases
    for (const p of purchases) {
      await client.query(
        `INSERT INTO "CreditTransaction" (id, "userId", amount, type, "bookingId", "createdAt")
         VALUES ($1,$2,$3,'CREDIT_PURCHASE',NULL,$4)`,
        [uuid(), userIds[`user_seed_${p.e}`], p.amount, at(p.days, 11)]
      );
    }
    // b) booking deductions (interviewee) + earnings (interviewer) — active bookings only
    let txCount = purchases.length + adminAdjustments.length;
    for (const b of bookings) {
      if (b.status === "CANCELLED") continue;
      const when = at(b.days < 0 ? b.days - 1 : -1, 13);
      await client.query(
        `INSERT INTO "CreditTransaction" (id, "userId", amount, type, "bookingId", "createdAt")
         VALUES ($1,$2,$3,'BOOKING_DEDUCTION',$4,$5)`,
        [uuid(), userIds[`user_seed_${b.e}`], -b.credits, bookingIds[b.key], when]
      );
      await client.query(
        `INSERT INTO "CreditTransaction" (id, "userId", amount, type, "bookingId", "createdAt")
         VALUES ($1,$2,$3,'BOOKING_EARNING',$4,$5)`,
        [uuid(), userIds[`user_seed_${b.i}`], b.credits, bookingIds[b.key], when]
      );
      txCount += 2;
    }
    // c) admin adjustments
    for (const a of adminAdjustments) {
      await client.query(
        `INSERT INTO "CreditTransaction" (id, "userId", amount, type, "bookingId", "createdAt")
         VALUES ($1,$2,$3,'ADMIN_ADJUSTMENT',NULL,$4)`,
        [uuid(), userIds[`user_seed_${a.e}`], a.amount, at(a.days, 16)]
      );
    }
    console.log(`💰 Inserted ${txCount} credit transactions`);

    // 7. Insert payouts
    for (const p of payouts) {
      const created = at(p.createdDaysAgo, 10);
      const processed = p.processedDaysAgo != null ? at(p.processedDaysAgo, 14) : null;
      await client.query(
        `INSERT INTO "Payout"
           (id, "interviewerId", credits, "platformFee", "netAmount",
            "paymentMethod", "paymentDetail", status, "adminNote",
            "createdAt", "updatedAt", "processedAt", "processedBy")
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
        [uuid(), userIds[`user_seed_${p.i}`], p.credits, p.platformFee, p.netAmount,
         p.paymentMethod, p.paymentDetail, p.status, p.adminNote,
         created, processed ?? created, processed, p.processedBy]
      );
    }
    console.log(`🏦 Inserted ${payouts.length} payouts`);

    // 8. Insert availabilities
    //    - AVAILABLE slots for everyone (future)
    //    - one BOOKED slot per interviewer with a SCHEDULED booking
    //    - one BLOCKED slot per interviewer
    let availCount = 0;
    const slotPlans = [
      { d: 2, h: 10 }, { d: 3, h: 14 }, { d: 6, h: 16 }, { d: 8, h: 11 }, { d: 11, h: 17 }, { d: 14, h: 10 },
    ];
    for (const u of interviewers) {
      for (const s of slotPlans) {
        const start = at(s.d, s.h);
        await client.query(
          `INSERT INTO "Availability" (id, "interviewerId", "startTime", "endTime", status)
           VALUES ($1,$2,$3,$4,'AVAILABLE')`,
          [uuid(), userIds[u.clerk], start, new Date(start.getTime() + 60 * 60 * 1000)]
        );
        availCount++;
      }
      // blocked slot (Tihar/Dashain family time)
      const bs = at(5, 9);
      await client.query(
        `INSERT INTO "Availability" (id, "interviewerId", "startTime", "endTime", status)
         VALUES ($1,$2,$3,$4,'BLOCKED')`,
        [uuid(), userIds[u.clerk], bs, new Date(bs.getTime() + 3 * 60 * 60 * 1000)]
      );
      availCount++;
    }
    for (const b of bookings) {
      if (b.status !== "SCHEDULED") continue;
      const start = at(b.days, b.hour, b.minutes ?? 0);
      await client.query(
        `INSERT INTO "Availability" (id, "interviewerId", "startTime", "endTime", status)
         VALUES ($1,$2,$3,$4,'BOOKED')`,
        [uuid(), userIds[`user_seed_${b.i}`], start, new Date(start.getTime() + 60 * 60 * 1000)]
      );
      availCount++;
    }
    console.log(`🗓️  Inserted ${availCount} availability slots`);

    await client.query("COMMIT");

    // 9. Verify
    const counts = await client.query(`
      SELECT
        (SELECT COUNT(*) FROM "User") AS users,
        (SELECT COUNT(*) FROM "Availability") AS availabilities,
        (SELECT COUNT(*) FROM "Booking") AS bookings,
        (SELECT COUNT(*) FROM "Feedback") AS feedback,
        (SELECT COUNT(*) FROM "CreditTransaction") AS transactions,
        (SELECT COUNT(*) FROM "Payout") AS payouts
    `);
    const c = counts.rows[0];
    console.log("\n✅ Seed complete! Database now contains:");
    console.log(`   Users: ${c.users} (8 interviewers + 12 interviewees)`);
    console.log(`   Availabilities: ${c.availabilities}`);
    console.log(`   Bookings: ${c.bookings}`);
    console.log(`   Feedback: ${c.feedback}`);
    console.log(`   CreditTransactions: ${c.transactions}`);
    console.log(`   Payouts: ${c.payouts}`);
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Seed failed — rolled back. No partial data written.");
    console.error(err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

main();
