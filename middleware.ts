import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const pathname = req.nextUrl.pathname

  // ログインページと登録ページは認証不要
  if (pathname === "/admin/login" || pathname === "/admin/register") {
    return NextResponse.next()
  }

  // /admin配下は認証必須
  if (pathname.startsWith("/admin") && !req.auth) {
    const loginUrl = new URL("/admin/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/admin/:path*"],
}
