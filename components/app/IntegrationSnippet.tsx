"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";

export function CopyButton({
  value,
  label,
  copiedLabel,
}: {
  value: string;
  label: string;
  copiedLabel: string;
}) {
  const tFail = useTranslations("demo.domains");
  const [copied, setCopied] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setFailed(false);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setFailed(true);
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void onCopy()}
      className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
      aria-label={label}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 text-primary" />
          {copiedLabel}
        </>
      ) : failed ? (
        <>
          <Copy className="h-3 w-3" />
          {tFail("copyFailed")}
        </>
      ) : (
        <>
          <Copy className="h-3 w-3" />
          {label}
        </>
      )}
    </button>
  );
}

function installCommand() {
  return "npm i tashrif";
}

function envSnippet(clientId: string) {
  return `# .env.local
NEXT_PUBLIC_TASHRIF_CLIENT_ID=${clientId}`;
}

function layoutSnippet() {
  return `import type { ReactNode } from "react";
import { Tashrif } from "tashrif/react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Tashrif clientId={process.env.NEXT_PUBLIC_TASHRIF_CLIENT_ID!} />
      </body>
    </html>
  );
}`;
}

export function IntegrationSnippet({ clientId }: { clientId: string }) {
  const t = useTranslations("demo.domains");
  const steps = [
    { key: "install", label: t("installStep"), value: installCommand() },
    { key: "env", label: t("envStep"), value: envSnippet(clientId) },
    { key: "layout", label: t("layoutStep"), value: layoutSnippet() },
  ] as const;

  return (
    <div className="space-y-3">
      {steps.map((s, i) => (
        <div key={s.key}>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-muted-foreground">
              {i + 1}. {s.label}
            </span>
            <CopyButton
              value={s.value}
              label={t("copy")}
              copiedLabel={t("copied")}
            />
          </div>
          <pre className="overflow-x-auto rounded-lg border border-border bg-card p-3 text-[11px] leading-relaxed">
            {s.value}
          </pre>
        </div>
      ))}
    </div>
  );
}
