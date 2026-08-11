import { getTranslations, setRequestLocale } from "next-intl/server";
import { RankedList } from "@/components/demo/RankedList";
import { entryPages, exitPages, pages } from "@/lib/demo-data";

export default async function PagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo");

  return (
    <div className="mx-auto max-w-3xl">
      <RankedList
        detailsLabel={t("details")}
        tabs={[
          { id: "page", label: t("tabs.page") },
          { id: "entry", label: t("tabs.entry") },
          { id: "exit", label: t("tabs.exit") },
        ]}
        datasets={{
          page: pages,
          entry: entryPages,
          exit: exitPages,
        }}
      />
    </div>
  );
}
