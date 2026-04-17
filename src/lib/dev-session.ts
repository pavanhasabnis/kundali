import { cookies } from "next/headers";
import { auth } from "@/lib/auth";

// Returns session user from NextAuth OR dev cookie (dev only)
export async function getSessionUser() {
  // Try NextAuth first
  const session = await auth();
  if (session?.user?.email) {
    return session.user as { id?: string; email: string; name?: string; role?: string; plan?: string };
  }

  // Fall back to dev cookie in development
  if (process.env.NODE_ENV !== "production") {
    const cookieStore = await cookies();
    const devCookie = cookieStore.get("dev-session");
    if (devCookie) {
      try {
        return JSON.parse(devCookie.value) as { id: string; email: string; name: string; role: string; plan: string };
      } catch { /* invalid cookie */ }
    }
  }

  return null;
}
