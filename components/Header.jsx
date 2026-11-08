import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  SignOutButton,
  SignUpButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-10 py-3 border-b border-white/7 backdrop-blur-xl">
      <Link href={"/"}>
        <Image
          src={"/logo.png"}
          alt="Prept Logo"
          width={100}
          height={100}
          className="h-11 w-auto"
        />
      </Link>
      {/* Redirection Logic */}
      {/* Sign in */}
      <div className="flex items-center gap-3">
        <show when="signed-out">
          {/* Links */}

          {/* Credits */}

          <SignInButton mode="modal">
            <Button variant="ghost">Sign In</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="gold">Get Started</Button>
          </SignUpButton>
        </show>
        <show when="signed-in">
          <UserButton />
        </show>
      </div>
    </nav>
  );
};

export default Header;
