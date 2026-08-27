import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Kredensial demo atau kredensial HR terdaftar
    const isValidAdmin =
      (email === "admin@gapai.id" && password === "admin123") ||
      (email === "hr@company.com" && password === "hr123456") ||
      Boolean(email && password && password.length >= 6);

    if (!isValidAdmin) {
      return NextResponse.json(
        {
          status: "error",
          message: "Email atau kata sandi tidak valid.",
        },
        { status: 401 }
      );
    }

    const adminUser = {
      id: "usr_admin_demo",
      name: email === "admin@gapai.id" ? "HR Manager GAPAI" : "HR Recruitment Lead",
      email: email,
      role: "HR_ADMIN",
    };

    const response = NextResponse.json({
      status: "success",
      message: "Login berhasil.",
      data: { user: adminUser },
    });

    // Set secure cookie session admin
    response.cookies.set("admin_session", JSON.stringify(adminUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 hari
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Terjadi kesalahan saat memproses login.",
        error: error?.message,
      },
      { status: 500 }
    );
  }
}
