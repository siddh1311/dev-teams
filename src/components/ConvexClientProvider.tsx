"use client";

import { ConvexAuthNextjsProvider } from "@convex-dev/auth/nextjs";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * A provider that wraps a Convex React app, providing a Convex client
 * instance to all components in the app.
 *
 * @param {{ children: ReactNode }} props
 * @prop {ReactNode} children The React components to render with the Convex
 *   client instance.
 * @returns The wrapped React components.
 */

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsProvider client={convex}>
      {children}
    </ConvexAuthNextjsProvider>
  );
}
