import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/categories/[id] - Get a single category
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    const categories = (await query("SELECT * FROM categories WHERE id = ?", [id])) as any[]

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
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const { name, slug, description } = await req.json()

    // Validate required fields
    if (!name || !slug) {
      return NextResponse.json({ message: "Name and slug are required" }, { status: 400 })
    }

    // Check if category exists
    const existingCategories = (await query("SELECT id FROM categories WHERE id = ?", [id])) as any[]

    if (existingCategories.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Check if slug is already used by another category
    const slugCheck = (await query("SELECT id FROM categories WHERE slug = ? AND id != ?", [slug, id])) as any[]

    if (slugCheck.length > 0) {
      return NextResponse.json({ message: "A different category with this slug already exists" }, { status: 400 })
    }

    // Update the category
    await query("UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?", [name, slug, description, id])

    // Get the updated category
    const updatedCategory = (await query("SELECT * FROM categories WHERE id = ?", [id])) as any[]

    return NextResponse.json({
      message: "Category updated successfully",
      category: updatedCategory[0],
    })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Check if category exists
    const existingCategories = (await query("SELECT id FROM categories WHERE id = ?", [id])) as any[]

    if (existingCategories.length === 0) {
      return NextResponse.json({ message: "Category not found" }, { status: 404 })
    }

    // Check if category is used by any products
    const productsUsingCategory = (await query("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [
      id,
    ])) as any[]

    if (productsUsingCategory[0].count > 0) {
      return NextResponse.json({ message: "Cannot delete category because it is used by products" }, { status: 400 })
    }

    // Delete the category
    await query("DELETE FROM categories WHERE id = ?", [id])

    return NextResponse.json({
      message: "Category deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

