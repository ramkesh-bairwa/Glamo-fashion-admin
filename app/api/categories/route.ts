import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// Shared error response helper
const errorResponse = (message: string, status = 500) =>
  NextResponse.json({ message }, { status })

// Helper to build search and count SQL with params
function buildSearchQuery(search: string, limit: number, offset: number) {
  const hasSearch = search.trim().length > 0
  const likeParams = hasSearch ? [`%${search}%`, `%${search}%`] : []

  const baseWhere = hasSearch ? "WHERE name LIKE ? OR description LIKE ?" : ""

  const dataQuery = `
    SELECT * FROM categories
    ${baseWhere}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `
  const countQuery = `
    SELECT COUNT(*) as total FROM categories
    ${baseWhere}
  `

  return {
    dataQuery,
    countQuery,
    queryParams: [...likeParams, limit, offset],
    countParams: likeParams,
  }
}

// GET /api/categories - Get all categories (with pagination & search)
export async function GET(req: NextRequest) {
  try {
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) return errorResponse("Unauthorized", 401)

    const { searchParams } = new URL(req.url)
    const search = searchParams.get("search")?.trim() || ""
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1)
    const limit = Math.max(parseInt(searchParams.get("limit") || "10", 10), 1)
    const offset = (page - 1) * limit

    const { dataQuery, countQuery, queryParams, countParams } = buildSearchQuery(
      search,
      limit,
      offset
    )

    const [categories, countResult] = await Promise.all([
      query(dataQuery, queryParams),
      query(countQuery, countParams),
    ])

    const total = countResult?.[0]?.total || 0

    return NextResponse.json({
      categories,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("GET /api/categories error:", error)
    return errorResponse("Internal server error")
  }
}

// POST /api/categories - Create a new category
export async function POST(req: NextRequest) {
  try {
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) return errorResponse("Unauthorized", 401)

    const { name, slug, description } = await req.json()

    if (!name || !slug) {
      return errorResponse("Name and slug are required", 400)
    }

    const existing = await query("SELECT id FROM categories WHERE slug = ?", [slug]) as any[]
    if (existing.length > 0) {
      return errorResponse("A category with this slug already exists", 400)
    }

    const insert = await query(
      "INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)",
      [name.trim(), slug.trim(), description?.trim() || null]
    ) as any

    const newCategory = await query("SELECT * FROM categories WHERE id = ?", [insert.insertId]) as any[]

    return NextResponse.json(
      { message: "Category created successfully", category: newCategory[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/categories error:", error)
    return errorResponse("Internal server error")
  }
}
