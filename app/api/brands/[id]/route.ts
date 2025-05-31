import { type NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

// GET /api/blogs - Get all blogs with pagination and search
export async function GET(req: NextRequest) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    // Query setup
    let sql = `
      SELECT b.*, u.name as author_name
      FROM blogs b
      LEFT JOIN users u ON b.author_id = u.id
    `;

    const queryParams: any[] = [];

    if (search) {
      sql += ` WHERE b.title LIKE ? OR b.content LIKE ? OR b.slug LIKE ?`;
      queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const countSql = `
      SELECT COUNT(*) as total 
      FROM blogs b
      ${search ? "WHERE b.title LIKE ? OR b.content LIKE ? OR b.slug LIKE ?" : ""}
    `;

    const countResult = await query(
      countSql,
      search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []
    );

    const total = (countResult as any[])[0]?.total || 0;

    sql += ` ORDER BY b.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const blogs = await query(sql, queryParams);

    return NextResponse.json({
      blogs,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/blogs - Create a new blog
export async function POST(req: NextRequest) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Read blog data from body (if needed)
    const body = await req.json();
    const { title, content, slug, author_id } = body;

    // Validate input
    if (!title || !content || !slug || !author_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Insert into DB
    const insertSql = `
      INSERT INTO blogs (title, content, slug, author_id, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    await query(insertSql, [title, content, slug, author_id]);

    return NextResponse.json({ message: "Blog created" }, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
