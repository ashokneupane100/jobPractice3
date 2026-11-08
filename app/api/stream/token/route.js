import { auth } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

export const runtime = "nodejs";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Sign in to continue." }, { status: 401 });
  }

  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  const apiSecret = process.env.STREAM_API_SECRET;

  if (!apiKey || !apiSecret) {
    return Response.json(
      { error: "Stream is not configured for this app yet." },
      { status: 503 },
    );
  }

  const stream = new StreamClient(apiKey, apiSecret);
  const token = stream.generateUserToken({
    user_id: userId,
    validity_in_seconds: 60 * 60,
  });

  return Response.json({ token, apiKey, userId });
}
