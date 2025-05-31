import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { query } from "@/lib/db"

// GET /api/categories/[id]
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params

    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const result = await query("SELECT * FROM categories WHERE id = ?", [id]) as any[]
    if (result.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(result[0])
  } catch (err) {
    console.error("GET /categories/[id] error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// PUT /api/categories/[id]
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json({ message: "Name and slug are required" }, { status: 400 })
    }

    // Check existence
    const existing = await query("SELECT id FROM categories WHERE id = ?", [id]) as any[]
    if (existing.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Check for slug conflict
    const conflict = await query("SELECT id FROM categories WHERE slug = ? AND id != ?", [slug, id]) as any[]
    if (conflict.length > 0) {
      return NextResponse.json({ message: "Slug already in use" }, { status: 400 })
    }

    await query("UPDATE categories SET name = ?, slug = ? WHERE id = ?", [name, slug, id])

    const updated = await query("SELECT * FROM categories WHERE id = ?", [id]) as any[]
    return NextResponse.json({ message: "Category updated", category: updated[0] })
  } catch (err) {
    console.error("PUT /categories/[id] error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

// DELETE /api/categories/[id]
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const existing = await query("SELECT id FROM categories WHERE id = ?", [id]) as any[]
    if (existing.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    await query("DELETE FROM categories WHERE id = ?", [id])
    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (err) {
    console.error("DELETE /categories/[id] error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
