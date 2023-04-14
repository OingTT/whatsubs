import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    // const user = await (
    //   await fetch(`${process.env.NEXTAUTH_URL}/api/user`, {
    //     headers: req.headers,
    //   })
    // ).json();
    // // Check signup
    // if (req.nextUrl.pathname.startsWith("/signup")) {
    //   if (user) {
    //     const url = req.nextUrl.clone();
    //     url.pathname = "/";
    //     return NextResponse.redirect(url);
    //   }
    // } else if (!user) {
    //   const url = req.nextUrl.clone();
    //   url.pathname = "/signup";
    //   return NextResponse.redirect(url);
    // }
  },
  {
    pages: {
      signIn: "/login",
      newUser: "/signup",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
