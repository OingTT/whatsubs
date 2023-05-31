import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/login")) {
    if (
      request.cookies.has("next-auth.session-token") ||
      request.cookies.has("__Secure-next-auth.session-token")
    ) {
      console.log(
        "redirect to /",
        request.cookies.has("next-auth.session-token") ||
          request.cookies.has("__Secure-next-auth.session-token")
      );
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else if (request.nextUrl.pathname.startsWith("/")) {
    if (
      !(
        request.cookies.has("next-auth.session-token") ||
        request.cookies.has("__Secure-next-auth.session-token")
      )
    ) {
      console.log(
        "redirect to /login",
        !request.cookies.has("next-auth.session-token") ||
          !request.cookies.has("__Secure-next-auth.session-token")
      );
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"],
};
