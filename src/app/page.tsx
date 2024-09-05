"use client";

import { useAuthActions } from "@convex-dev/auth/react";

import { UserButton } from "@/features/auth/components/UserButton";

export default function Home() {
  const { signOut } = useAuthActions();
  return (
    <div>
      Logged In!
      <UserButton />
    </div>
  );
}
