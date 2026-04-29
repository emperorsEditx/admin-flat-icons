import { NextResponse } from "next/server";
import { API_BASE_URL } from "@/lib/api";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const upstreamResponse = await fetch(`${API_BASE_URL}/icons/temp-upload`, {
      method: "POST",
      body: formData,
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
      { message: "Failed to upload temporary icon" },
      { status: 502 },
    );
  }
}