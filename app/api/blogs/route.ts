import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/blogs - Get all blogs with pagination and search
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
      SELECT b.*, u.name as author_name
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
    `

    const queryParams: any[] = []

    if (search) {
      sql += " WHERE b.title LIKE ? OR b.content LIKE ? OR b.slug LIKE ?"
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    // Get total count for pagination
    const countSql = `
      SELECT COUNT(*) as total 
      FROM blogs b
      ${search ? "WHERE b.title LIKE ? OR b.content LIKE ? OR b.slug LIKE ?" : ""}
    `

    const countResult = (await query(countSql, search ? [`%${search}%`, `%${search}%`, `%${search}%`] : [])) as any[]
    const total = countResult[0].total

    // Add pagination
    sql += " ORDER BY b.created_at DESC LIMIT ? OFFSET ?"
    queryParams.push(limit, offset)

    const blogs = await query(sql, queryParams)

    return NextResponse.json({
      blogs,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching blogs:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// POST /api/blogs - Create a new blog
export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // You can add your blog creation logic here later

    return NextResponse.json({ message: "Blog created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}