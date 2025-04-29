import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/users - Get all users with pagination and search
export async function GET(req: NextRequest) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const offset = (page - 1) * limit

    // Build the query based on search parameters
    let sql = "SELECT id, name, email, role, created_at FROM users"
    const queryParams: any[] = []

    if (search) {
      sql += " WHERE name LIKE ? OR email LIKE ?"
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    // Get total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM users ${search ? "WHERE name LIKE ? OR email LIKE ?" : ""}`
    const countResult = (await query(countSql, search ? [`%${search}%`, `%${search}%`] : [])) as any[]
    const total = countResult[0].total

    // Add pagination
    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    queryParams.push(limit, offset)

    const users = await query(sql, queryParams)

    return NextResponse.json({
      users,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST /api/users - Create a new user
export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, email, password, role } = await req.json()

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Check if email already exists
    const existingUsers = (await query("SELECT id FROM users WHERE email = ?", [email])) as any[]

    if (existingUsers.length > 0) {
      return NextResponse.json({ message: "A user with this email already exists" }, { status: 400 })
    }

    // In a real application, you would hash the password here
    // Insert the new user
    const result = (await query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [
      name,
      email,
      password,
      role || "user",
    ])) as any

    // Get the newly created user
    const newUser = (await query("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [
      result.insertId,
    ])) as any[]

    return NextResponse.json({ message: "User created successfully", user: newUser[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

