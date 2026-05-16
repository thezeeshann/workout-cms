"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { consumeAuthIntent } from "@/lib/auth/auth-intent";

export function AuthSuccessToast() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const intent = consumeAuthIntent();
    if (!intent) return;

    void authClient.getSession().then(({ data }) => {
      if (!data?.session) return;
      if (intent === "signup") {
        toast.success("Account created successfully. Welcome!");
      } else {
        toast.success("Signed in successfully.");
      }
    });
  }, []);

  return null;
}
