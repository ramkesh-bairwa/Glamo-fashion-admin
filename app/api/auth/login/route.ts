import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { generateToken, setAuthCookie } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // In a real application, you would hash the password and compare the hash
    const users = (await query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password])) as any[]

    if (users.length === 0) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    const user = users[0]

    // Check if user is an admin
    if (user.role !== "admin") {
      return NextResponse.json({ message: "Access denied. Admin privileges required." }, { status: 403 })
    }

    // Generate JWT token
    const token = generateToken(user.id, user.email, user.role)

    // Create response
    const response = NextResponse.json({ message: "Login successful" }, { status: 200 })

    // Set auth cookie
    setAuthCookie(response, token)

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

