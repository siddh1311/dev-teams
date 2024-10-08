"use client";
import { useEffect, useState } from "react";

import { CreateWorkspaceModal } from "@/features/workspaces/components/CreateWorkspaceModal";
import { CreateChannelModal } from "@/features/channels/components/CreateChannelModal";

export const Modals = () => {
  const [mounted, setMounted] = useState(false);

  // Fixes hydration error since useEffect is only called once we are doing client side rendering
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <CreateChannelModal />
      <CreateWorkspaceModal />
    </>
  );
};
