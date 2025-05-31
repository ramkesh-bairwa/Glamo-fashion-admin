import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/categories/[id] - Get a single category
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const category = await query("SELECT * FROM categories WHERE id = ?", [id]) as any[]

    if (category.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category[0])
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const exists = await query("SELECT id FROM categories WHERE id = ?", [id]) as any[]

    if (exists.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    const productCheck = await query("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [id]) as any[]
    if (productCheck[0].count > 0) {
      return NextResponse.json({ message: "Category is used by products" }, { status: 400 })
    }

    await query("DELETE FROM categories WHERE id = ?", [id])
    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
