import { sign, verify } from "jsonwebtoken"
import { cookies } from "next/headers"
import type { NextRequest, NextResponse } from "next/server"
import { query } from "./db"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const TOKEN_NAME = "admin_token"

// Generate JWT token
export function generateToken(userId: number, email: string, role: string) {
  return sign({ userId, email, role }, JWT_SECRET, { expiresIn: "1d" })
}

// Verify JWT token
export function verifyToken(token: string) {
  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Get user from token
export async function getUserFromToken(token: string) {
  try {
    const decoded = verifyToken(token) as { userId: number } | null

    if (!decoded) {
      return null
    }

    const users = (await query("SELECT id, name, email, role FROM users WHERE id = ?", [decoded.userId])) as any[]

    return users.length > 0 ? users[0] : null
  } catch (error) {
    console.error("Error getting user from token:", error)
    return null
  }
}

// Middleware to check if user is authenticated
export async function isAuthenticated(req: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get(TOKEN_NAME)?.value

  if (!token) {
    return false
  }

  const user = await getUserFromToken(token)
  return !!user
}

// Middleware to check if user is admin
export async function isAdmin(req: NextRequest) {
  const cookieStore = cookies()
  const token = cookieStore.get(TOKEN_NAME)?.value

  if (!token) {
    return false
  }

  const user = await getUserFromToken(token)
  return user?.role === "admin"
}

// Set token in cookie
export function setAuthCookie(res: NextResponse, token: string) {
  res.cookies.set({
    name: TOKEN_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  })

  return res
}

// Clear auth cookie
export function clearAuthCookie(res: NextResponse) {
  res.cookies.set({
    name: TOKEN_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  })

  return res
}

