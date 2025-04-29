import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/products - Get all products with pagination and search
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
    let sql = `
      SELECT p.*, c.name as category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `

    const queryParams: any[] = []

    if (search) {
      sql += ` WHERE p.name LIKE ? OR p.description LIKE ?`
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    // Get total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM products ${search ? "WHERE name LIKE ? OR description LIKE ?" : ""}`
    const countResult = (await query(countSql, search ? [`%${search}%`, `%${search}%`] : [])) as any[]
    const total = countResult[0].total

    // Add pagination
    sql += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`
    queryParams.push(limit, offset)

    const products = await query(sql, queryParams)

    return NextResponse.json({
      products,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST /api/products - Create a new product
export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, slug, description, price, stock, category_id, image_url } = await req.json()

    // Validate required fields
    if (!name || !slug || !price) {
      return NextResponse.json({ message: "Name, slug, and price are required" }, { status: 400 })
    }

    // Check if slug already exists
    const existingProducts = (await query("SELECT id FROM products WHERE slug = ?", [slug])) as any[]

    if (existingProducts.length > 0) {
      return NextResponse.json({ message: "A product with this slug already exists" }, { status: 400 })
    }

    // Insert the new product
    const result = (await query(
      `INSERT INTO products (name, slug, description, price, stock, category_id, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, slug, description, price, stock || 0, category_id, image_url],
    )) as any

    // Get the newly created product
    const newProduct = (await query("SELECT * FROM products WHERE id = ?", [result.insertId])) as any[]

    return NextResponse.json({ message: "Product created successfully", product: newProduct[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

