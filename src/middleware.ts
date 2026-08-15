import { withAuth } from "next-auth/middleware"

export default withAuth({
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized: ({ token, req }) => {
      // Protect all /admin routes except /admin/login
      const path = req.nextUrl.pathname
      if (path === "/admin/login") return true
      return !!token
    },
  },
})

export const config = {
  matcher: ["/admin/:path*"],
}
