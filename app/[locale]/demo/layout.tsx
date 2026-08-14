import { setRequestLocale } from "next-intl/server";
import { DemoShellProvider } from "@/components/demo/DemoShellContext";
import { DemoSidebar } from "@/components/demo/DemoSidebar";
import { DemoHeader } from "@/components/demo/DemoHeader";
import { DateRangeProvider } from "@/components/app/DateRangeProvider";

export default async function DemoLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <DemoShellProvider>
      <DateRangeProvider>
      <div className="flex h-dvh overflow-hidden bg-background">
        <DemoSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <DemoHeader />
          <main className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
      </DateRangeProvider>
    </DemoShellProvider>
  );
}
