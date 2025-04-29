import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/orders - Get all orders with pagination and filters
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
    const status = searchParams.get("status") || ""
    const payment = searchParams.get("payment") || ""
    const offset = (page - 1) * limit

    // Build the query based on search parameters
    let sql = `
      SELECT o.*, u.name as user_name
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
    `

    const queryParams: any[] = []
    const whereConditions: string[] = []

    if (search) {
      whereConditions.push(`(u.name LIKE ? OR u.email LIKE ? OR o.id LIKE ?)`)
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (status) {
      whereConditions.push(`o.status = ?`)
      queryParams.push(status)
    }

    if (payment) {
      whereConditions.push(`o.payment_status = ?`)
      queryParams.push(payment)
    }

    if (whereConditions.length > 0) {
      sql += ` WHERE ${whereConditions.join(" AND ")}`
    }

    // Get total count for pagination
    const countSql = `
      SELECT COUNT(*) as total 
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      ${whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : ""}
    `

    const countResult = (await query(countSql, queryParams)) as any[]
    const total = countResult[0].total

    // Add pagination
    sql += ` ORDER BY o.created_at DESC LIMIT ? OFFSET ?`
    queryParams.push(limit, offset)

    const orders = await query(sql, queryParams)

    return NextResponse.json({
      orders,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

