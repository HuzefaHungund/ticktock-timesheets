import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // Make sure this path is accurate

const handler = NextAuth(authOptions);

export async function GET(req: Request, ctx: any) {
  try {
    return await handler(req, ctx);
  } catch (error) {
    console.error("🔥 NEXTAUTH SERVER ERROR:", error);
    return new Response(JSON.stringify({ error: "Auth Handler Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(req: Request, ctx: any) {
  try {
    return await handler(req, ctx);
  } catch (error) {
    console.error("🔥 NEXTAUTH SERVER ERROR:", error);
    return new Response(JSON.stringify({ error: "Auth Handler Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}