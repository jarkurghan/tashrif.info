"use client";

import { useEffect } from "react";

export function SocialEnvLog() {
  useEffect(() => {
    void fetch("/api/debug/social-env")
      .then((r) => r.json())
      .then((env) => {
        console.log("[social-env]", env);
      })
      .catch((err) => {
        console.warn("[social-env] failed to load", err);
      });
  }, []);

  return null;
}
