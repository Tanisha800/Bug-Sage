import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value || req.headers.get("authorization");
  const url = req.nextUrl.clone();

  if (!token && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
