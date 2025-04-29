import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/users/[id] - Get a single user
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    const users = (await query("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [id])) as any[]

    if (users.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json(users[0])
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const { name, email, password, role } = await req.json()

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ message: "Name and email are required" }, { status: 400 })
    }

    // Check if user exists
    const existingUsers = (await query("SELECT id, role FROM users WHERE id = ?", [id])) as any[]

    if (existingUsers.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Prevent changing the role of the last admin
    if (existingUsers[0].role === "admin" && role !== "admin") {
      const adminCount = (await query("SELECT COUNT(*) as count FROM users WHERE role = ?", ["admin"])) as any[]

      if (adminCount[0].count <= 1) {
        return NextResponse.json({ message: "Cannot change the role of the last admin user" }, { status: 400 })
      }
    }

    // Check if email is already used by another user
    const emailCheck = (await query("SELECT id FROM users WHERE email = ? AND id != ?", [email, id])) as any[]

    if (emailCheck.length > 0) {
      return NextResponse.json({ message: "A different user with this email already exists" }, { status: 400 })
    }

    // Update the user
    if (password) {
      // In a real application, you would hash the password here
      await query("UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?", [
        name,
        email,
        password,
        role,
        id,
      ])
    } else {
      await query("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", [name, email, role, id])
    }

    // Get the updated user
    const updatedUser = (await query("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [id])) as any[]

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser[0],
    })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Delete a user
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Check if user exists
    const existingUsers = (await query("SELECT id, role FROM users WHERE id = ?", [id])) as any[]

    if (existingUsers.length === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Prevent deleting an admin user
    if (existingUsers[0].role === "admin") {
      return NextResponse.json({ message: "Cannot delete an admin user" }, { status: 400 })
    }

    // Delete the user
    await query("DELETE FROM users WHERE id = ?", [id])

    return NextResponse.json({
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

