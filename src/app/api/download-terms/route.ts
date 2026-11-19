import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { isLocale } from "@/lib/locales";

const serviceIds = ["diagnostic", "cleaning", "warrantyRepair"] as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const service = searchParams.get("service") || "";
  const requestedLocale = searchParams.get("lang") || "pl";
  const locale = isLocale(requestedLocale) ? requestedLocale : "pl";

  if (!serviceIds.includes(service as (typeof serviceIds)[number])) {
    return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  }

  const localeFile = path.join(process.cwd(), "public", "pdf", `regulamin-${service}-${locale}.pdf`);
  const fallbackFile = path.join(process.cwd(), "public", "pdf", `regulamin-${service}-pl.pdf`);
  let filePath = localeFile;

  try {
    await readFile(localeFile);
  } catch {
    filePath = fallbackFile;
  }

  try {
    const file = await readFile(filePath);
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="regulamin-${service}-${locale}.pdf"`,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (error) {
    console.error("Service terms PDF is unavailable", { service, locale, error });
    return NextResponse.json({ error: "Terms document unavailable" }, { status: 404 });
  }
}
