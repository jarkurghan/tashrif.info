"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Select";

export function DemoRoleSelect({
  adminLabel,
  viewerLabel,
  ariaLabel,
}: {
  adminLabel: string;
  viewerLabel: string;
  ariaLabel: string;
}) {
  const [role, setRole] = useState("viewer");

  return (
    <Select
      aria-label={ariaLabel}
      value={role}
      onChange={setRole}
      options={[
        { value: "admin", label: adminLabel },
        { value: "viewer", label: viewerLabel },
      ]}
    />
  );
}
