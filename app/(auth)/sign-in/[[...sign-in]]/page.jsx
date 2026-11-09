import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <Suspense fallback={null}>
        <SignIn />
      </Suspense>
    </div>
  );
}
