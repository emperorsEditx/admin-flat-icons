import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";

export async function GET() {
  try {
    const upstreamResponse = await fetch(apiUrl("icons/stats"), {
      cache: "no-store",
    });

    const contentType = upstreamResponse.headers.get("content-type") || "application/json";
    const body = await upstreamResponse.text();

    return new NextResponse(body, {
      status: upstreamResponse.status,
      headers: {
        "content-type": contentType,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to fetch icon stats" },
      { status: 502 },
    );
  }
}