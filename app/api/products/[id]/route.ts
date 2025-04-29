import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/products/[id] - Get a single product
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    const products = (await query(
      `SELECT p.*, c.name as category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id],
    )) as any[]

    if (products.length === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(products[0])
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/products/[id] - Update a product
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const { name, slug, description, price, stock, category_id, image_url } = await req.json()

    // Validate required fields
    if (!name || !slug || !price) {
      return NextResponse.json({ message: "Name, slug, and price are required" }, { status: 400 })
    }

    // Check if product exists
    const existingProducts = (await query("SELECT id FROM products WHERE id = ?", [id])) as any[]

    if (existingProducts.length === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Check if slug is already used by another product
    const slugCheck = (await query("SELECT id FROM products WHERE slug = ? AND id != ?", [slug, id])) as any[]

    if (slugCheck.length > 0) {
      return NextResponse.json({ message: "A different product with this slug already exists" }, { status: 400 })
    }

    // Update the product
    await query(
      `UPDATE products 
       SET name = ?, slug = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ?
       WHERE id = ?`,
      [name, slug, description, price, stock || 0, category_id, image_url, id],
    )

    // Get the updated product
    const updatedProduct = (await query("SELECT * FROM products WHERE id = ?", [id])) as any[]

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct[0],
    })
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/products/[id] - Delete a product
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Check if product exists
    const existingProducts = (await query("SELECT id FROM products WHERE id = ?", [id])) as any[]

    if (existingProducts.length === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 })
    }

    // Delete the product
    await query("DELETE FROM products WHERE id = ?", [id])

    return NextResponse.json({
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

