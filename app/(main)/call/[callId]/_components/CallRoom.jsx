"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// Stream Video
import {
  StreamVideoClient,
  StreamVideo,
  StreamCall,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/v2/index.css";

import { AlertCircle, Loader2, RotateCcw } from "lucide-react";
import CallUI from "./CallUI";
import { ensureCall } from "@/actions/call";

export default function CallRoom({
  callId,
  token,
  apiKey,
  currentUser,
  booking,
  isInterviewer,
}) {
  const router = useRouter();
  const [videoClient, setVideoClient] = useState(null);
  const [call, setCall] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const clientRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: currentUser.id,
        name: currentUser.name,
        image: currentUser.imageUrl,
      },
      token,
    });

    const callInstance = client.call("default", callId);

    const connect = async () => {
      try {
        try {
          await callInstance.join({ create: false });
        } catch (joinError) {
          // The call may not exist because creation at booking time failed
          // (Stream requests can time out). Re-provision it server-side with
          // the same settings, then join again.
          console.warn("Join failed, re-provisioning call:", joinError);
          const ensured = await ensureCall(callId);
          if (ensured?.error) throw joinError;
          await callInstance.join({ create: false });
        }

        if (cancelled) {
          await callInstance.leave().catch(() => {});
          await client.disconnectUser().catch(() => {});
          return;
        }

        clientRef.current = client;
        setVideoClient(client);
        setCall(callInstance);
      } catch (err) {
        console.error("Failed to join call:", err);
        if (cancelled) return;
        await client.disconnectUser().catch(() => {});
        setErrorMessage(
          err?.message ||
            "Could not connect to the call. Check your network and try again.",
        );
      }
    };

    connect();

    return () => {
      cancelled = true;
      callInstance.leave().catch(() => {});
      client.disconnectUser().catch(() => {});
      clientRef.current = null;
    };
  }, [
    apiKey,
    callId,
    currentUser.id,
    currentUser.imageUrl,
    currentUser.name,
    token,
    attempt,
  ]);

  const handleLeave = useCallback(() => {
    router.push(isInterviewer ? "/dashboard" : "/appointments");
  }, [isInterviewer, router]);

  const handleRetry = useCallback(() => {
    setErrorMessage("");
    setVideoClient(null);
    setCall(null);
    setAttempt((n) => n + 1);
  }, []);

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="w-11 h-11 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle size={20} className="text-red-400" />
        </span>
        <div className="flex flex-col gap-1.5 max-w-sm">
          <p className="text-stone-200 text-sm font-medium">
            Could not join the call
          </p>
          <p className="text-stone-500 text-xs font-light break-words">
            {errorMessage}
          </p>
        </div>
        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-stone-200 transition-colors hover:border-amber-400/40 hover:text-amber-300"
        >
          <RotateCcw size={14} />
          Try again
        </button>
      </div>
    );
  }

  if (!videoClient || !call) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="text-amber-400 animate-spin" />
        <p className="text-stone-500 text-sm font-light">Connecting to call…</p>
      </div>
    );
  }

  return (
    <StreamVideo client={videoClient}>
      <StreamCall call={call}>
        <CallUI
          callId={callId}
          isInterviewer={isInterviewer}
          booking={booking}
          onLeave={handleLeave}
          apiKey={apiKey}
          token={token}
          currentUser={currentUser}
        />
      </StreamCall>
    </StreamVideo>
  );
}
