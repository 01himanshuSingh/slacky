"use client";

import { NuqsAdapter } from "nuqs/adapters/next/app";
import { PropsWithChildren } from "react";

export function Providersnqus({ children }: PropsWithChildren) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}
