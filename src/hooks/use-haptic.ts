"use client";

import { useCallback } from "react";
import { triggerNudge as triggerNudgeImpl } from "@/lib/haptics";

export function useHaptic() {
  const triggerNudge = useCallback(() => {
    triggerNudgeImpl();
  }, []);

  return { triggerNudge };
}
