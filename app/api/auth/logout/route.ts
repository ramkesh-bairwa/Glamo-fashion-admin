import { type NextRequest, NextResponse } from "next/server"
import { clearAuthCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ message: "Logout successful" }, { status: 200 })

    // Clear auth cookie
    clearAuthCookie(response)

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

