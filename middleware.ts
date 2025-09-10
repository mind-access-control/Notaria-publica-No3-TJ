import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // For now, disable middleware to test navigation
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
};
