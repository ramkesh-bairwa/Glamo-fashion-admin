import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { query } from "@/lib/db"

type Context = {
  params: {
    id: string
  }
}

// GET /api/categories/[id] - Get a single category
export async function GET(req: NextRequest, context: Context) {
  const { id } = context.params

  try {
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const categories = await query("SELECT * FROM categories WHERE id = ?", [id]) as any[]

    if (categories.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(categories[0])
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(req: NextRequest, context: Context) {
  const { id } = context.params

  try {
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, slug } = body

    if (!name || !slug) {
      return NextResponse.json({ message: "Name and slug are required" }, { status: 400 })
    }

    // Check if the category exists
    const existing = await query("SELECT id FROM categories WHERE id = ?", [id]) as any[]
    if (existing.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Check for duplicate slug
    const slugCheck = await query(
      "SELECT id FROM categories WHERE slug = ? AND id != ?",
      [slug, id]
    ) as any[]
    if (slugCheck.length > 0) {
      return NextResponse.json({ message: "Slug already in use" }, { status: 400 })
    }

    await query("UPDATE categories SET name = ?, slug = ? WHERE id = ?", [name, slug, id])

    const updated = await query("SELECT * FROM categories WHERE id = ?", [id]) as any[]

    return NextResponse.json({ message: "Category updated", category: updated[0] })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(req: NextRequest, context: Context) {
  const { id } = context.params

  try {
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // Check if the category exists
    const existing = await query("SELECT id FROM categories WHERE id = ?", [id]) as any[]
    if (existing.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    await query("DELETE FROM categories WHERE id = ?", [id])

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
