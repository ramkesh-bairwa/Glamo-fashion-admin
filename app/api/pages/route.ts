import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/pages - Get all pages with pagination and search
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
    let sql = "SELECT * FROM pages"
    const queryParams: any[] = []

    if (search) {
      sql += " WHERE title LIKE ? OR slug LIKE ? OR content LIKE ?"
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    // Get total count for pagination
    const countSql = `SELECT COUNT(*) as total FROM pages ${search ? "WHERE title LIKE ? OR slug LIKE ? OR content LIKE ?" : ""}`
    const countResult = (await query(countSql, search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [])) as any[]
    const total = countResult[0].total

    // Add pagination
    sql += " ORDER BY created_at DESC LIMIT ? OFFSET ?"
    queryParams.push(limit, offset)

    const pages = await query(sql, queryParams)

    return NextResponse.json({
      pages,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching pages:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST /api/pages - Create a new page
export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { title, slug, content, meta_title, meta_description, status } = await req.json()

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json({ message: "Title and slug are required" }, { status: 400 })
    }

    // Check if slug already exists
    const existingPages = (await query("SELECT id FROM pages WHERE slug = ?", [slug])) as any[]

    if (existingPages.length > 0) {
      return NextResponse.json({ message: "A page with this slug already exists" }, { status: 400 })
    }

    // Insert the new page
    const result = (await query(
      `INSERT INTO pages (title, slug, content, meta_title, meta_description, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [title, slug, content, meta_title, meta_description, status || "draft"],
    )) as any

    // Get the newly created page
    const newPage = (await query("SELECT * FROM pages WHERE id = ?", [result.insertId])) as any[]

    return NextResponse.json({ message: "Page created successfully", page: newPage[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating page:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

