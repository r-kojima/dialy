import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname

  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return NextResponse.next()
  }

  // セッションクッキーの存在チェック（NextAuthのデフォルトクッキー名）
  const sessionToken = req.cookies.get("authjs.session-token") ||
                       req.cookies.get("__Secure-authjs.session-token")

  if (pathname.startsWith("/admin") && !sessionToken) {
    const loginUrl = new URL("/admin/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
