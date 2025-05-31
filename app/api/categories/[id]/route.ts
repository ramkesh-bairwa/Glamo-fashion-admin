import { NextRequest, NextResponse } from "next/server"
import { isAdmin } from "@/lib/auth"
import { query } from "@/lib/db"

// GET /api/categories/[id] - Get single category
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = context.params
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

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { id } = context.params

    const existingCategory = await query("SELECT * FROM categories WHERE id = ?", [id]) as any[]
    if (existingCategory.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Optional: Check if any products use this category
    const productsUsingCategory = await query(
      "SELECT COUNT(*) as count FROM products WHERE category_id = ?",
      [id]
    ) as any[]

    if (productsUsingCategory[0].count > 0) {
      return NextResponse.json({ message: "Cannot delete category as it is in use" }, { status: 400 })
    }

    await query("DELETE FROM categories WHERE id = ?", [id])
    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
