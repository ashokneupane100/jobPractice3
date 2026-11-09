"use client";

import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { CheckoutButton } from "@clerk/nextjs/experimental";
import { Check } from "lucide-react";
import Link from "next/link";

import { PLANS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function PlanCta({ plan }) {
  const variant = plan.featured ? "gold" : "outline";

  if (!plan.planId) {
    return (
      <Button asChild variant={variant} className="w-full rounded-full">
        <Link href="/onboarding">Get started</Link>
      </Button>
    );
  }

  return (
    <>
      <SignedIn>
        <CheckoutButton planId={plan.planId} planPeriod="month">
          <Button variant={variant} className="w-full rounded-full">
            Choose {plan.name}
          </Button>
        </CheckoutButton>
      </SignedIn>
      <SignedOut>
        <SignUpButton mode="modal">
          <Button variant={variant} className="w-full rounded-full">
            Choose {plan.name}
          </Button>
        </SignUpButton>
      </SignedOut>
    </>
  );
}

export default function Pricing() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {PLANS.map((plan) => (
        <div
          key={plan.slug}
          className={cn(
            "relative flex flex-col rounded-2xl border bg-[#0f0f11] p-8 transition duration-300",
            plan.featured
              ? "border-amber-400/40 shadow-[0_0_48px_-16px_rgba(251,191,36,0.45)]"
              : "border-white/10 hover:border-amber-400/20"
          )}
        >
          {plan.featured && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full border border-amber-400/30 bg-[#151007] px-3 py-1 text-[10px] font-semibold text-amber-300 uppercase tracking-widest">
              Most popular
            </span>
          )}

          <h3 className="font-serif text-xl tracking-tight">{plan.name}</h3>
          <p className="mt-1 text-xs text-stone-500">{plan.credits}</p>

          <div className="mt-5 flex items-end gap-1">
            <span className="font-serif text-4xl tracking-tight">
              {plan.price}
            </span>
            <span className="pb-1.5 text-xs text-stone-500">
              {plan.price === "$0" ? "forever" : "/ month"}
            </span>
          </div>

          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-2.5 text-sm text-stone-400"
              >
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <PlanCta plan={plan} />
          </div>
        </div>
      ))}
    </div>
  );
}
