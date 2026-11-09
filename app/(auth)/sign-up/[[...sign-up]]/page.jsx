import { SignUp } from "@clerk/nextjs";
import { Suspense } from "react";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <Suspense fallback={null}>
        <SignUp />
      </Suspense>
    </div>
  );
}
