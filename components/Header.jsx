"use client";

import React from "react";
import {
  Show,
  SignInButton,
  UserButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex h-[68px] items-center justify-between border-b border-white/[0.07] bg-[#090a0b]/85 px-4 backdrop-blur-xl sm:px-8">
      <Link href="/" className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Prept Logo"
          width={100}
          height={100}
          className="h-9 w-auto"
        />
        <span className="hidden border-l border-white/10 pl-3 text-xs text-white/40 sm:block">
          Your next chapter starts here.
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <Button variant="ghost" className="text-white/65 hover:text-white">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="gold" className="rounded-full px-5">
              Get started
            </Button>
          </SignUpButton>
        </Show>
        <Show when="signed-in">
          <Link
            href="/"
            className="hidden rounded-full px-3 py-2 text-xs font-medium text-amber-100/80 transition hover:bg-white/[0.06] sm:block"
          >
            Community
          </Link>
          <UserButton />
        </Show>
      </div>
    </nav>
  );
};

export default Header;
