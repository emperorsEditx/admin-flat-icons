import { NextResponse } from "next/server";
import { apiUrl } from "@/lib/api";

const REQUEST_HEADERS_TO_FORWARD = [
  "authorization",
  "content-type",
  "x-requested-with",
];

async function forwardRequest(req: Request, pathSegments: string[]) {
  const upstreamUrl = apiUrl(pathSegments.join("/"));
  const headers = new Headers();

  REQUEST_HEADERS_TO_FORWARD.forEach((header) => {
    const value = req.headers.get(header);
    if (value) {
      headers.set(header, value);
    }
  });

  const init: RequestInit = {
    method: req.method,
    headers,
    cache: "no-store",
  };

  if (!["GET", "HEAD"].includes(req.method)) {
    init.body = await req.arrayBuffer();
  }

  const upstreamResponse = await fetch(upstreamUrl, init);
  const contentType = upstreamResponse.headers.get("content-type") || "application/json";
  const body = await upstreamResponse.text();

  return new NextResponse(body, {
    status: upstreamResponse.status,
    headers: {
      "content-type": contentType,
    },
  });
}

export async function GET(
  req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forwardRequest(req, path);
}

export async function POST(
  req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forwardRequest(req, path);
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forwardRequest(req, path);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  return forwardRequest(req, path);
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}