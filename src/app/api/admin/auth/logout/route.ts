import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    status: "success",
    message: "Logout berhasil.",
  });

  response.cookies.delete("admin_session");
  return response;
}
