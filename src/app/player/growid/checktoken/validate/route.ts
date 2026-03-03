import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const params = new URLSearchParams(body);

  const responseBody = JSON.stringify({
    status: "success",
    message: "Account Validated.",
    token: params.get('refreshToken') || "",
    url: "",
    accountType: "growtopia",
  });

  return new NextResponse(responseBody, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });
}