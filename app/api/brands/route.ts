import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import { isAdmin } from "@/lib/auth"
import { query } from "@/lib/db"
import { uploadFile } from "../fileUploader"

// Shared error response helper
const errorResponse = (message: string, status = 500) =>
  NextResponse.json({ message }, { status })

// Helper to build search and count SQL with params
function buildSearchQuery(search: string, limit: number, offset: number) {
  const hasSearch = search.trim().length > 0
  const likeParams = hasSearch ? [`%${search}%`, `%${search}%`] : []

  const baseWhere = hasSearch ? "WHERE name LIKE ? OR description LIKE ?" : ""

  const dataQuery = `
    SELECT * FROM brands
    ${baseWhere}
    ORDER BY id DESC
    LIMIT ? OFFSET ?
  `
  const countQuery = `
    SELECT COUNT(*) as total FROM brands
    ${baseWhere}
  `

  return {
    dataQuery,
    countQuery,
    queryParams: [...likeParams, limit, offset],
    countParams: likeParams,
  }
}

// GET /api/brands - Get all brands (with pagination & search)
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

    const [brands, countResult] = await Promise.all([
      query(dataQuery, queryParams),
      query(countQuery, countParams),
    ])

    const total = countResult?.[0]?.total || 0

    return NextResponse.json({
      brands,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("GET /api/brands error:", error)
    return errorResponse("Internal server error")
  }
}

// POST /api/brands - Create a new brand
export async function POST(req: NextRequest) {
  try {
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) return NextResponse.json({ message: "Unauthorized" }, { status: 401 })

    const formData = await req.formData()
    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const domain = formData.get("domain") as string
    const brand_url = formData.get("brand_url") as string
    const description = formData.get("description") as string
    const file = formData.get("file") as File

    if (!name || !slug) {
      return NextResponse.json({ message: "Name and slug are required" }, { status: 400 })
    }

    const existing = await query("SELECT id FROM brands WHERE slug = ?", [slug]) as any[]
    if (existing.length > 0) {
      return NextResponse.json({ message: "A brand with this slug already exists" }, { status: 400 })
    }

    const fileName=await uploadFile(file,'brand-icons')

    const insert = await query(
      "INSERT INTO brands (name, icon, domain, brand_url, slug, description) VALUES (?, ?, ?, ?, ?, ?)",
      [name.trim(), fileName || null, domain.trim(), brand_url.trim(), slug.trim(), description?.trim() || null]
    ) as any

    const newBrand = await query("SELECT * FROM brands WHERE id = ?", [insert.insertId]) as any[]

    return NextResponse.json(
      { message: "Brand created successfully", brand: newBrand[0] },
      { status: 201 }
    )
  } catch (error) {
    console.error("POST /api/brands error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
