import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/pages/[id] - Get a single page
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    const pages = (await query("SELECT * FROM pages WHERE id = ?", [id])) as any[]

    if (pages.length === 0) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 })
    }

    return NextResponse.json(pages[0])
  } catch (error) {
    console.error("Error fetching page:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/pages/[id] - Update a page
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const { title, slug, content, meta_title, meta_description, status } = await req.json()

    // Validate required fields
    if (!title || !slug) {
      return NextResponse.json({ message: "Title and slug are required" }, { status: 400 })
    }

    // Check if page exists
    const existingPages = (await query("SELECT id FROM pages WHERE id = ?", [id])) as any[]

    if (existingPages.length === 0) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 })
    }

    // Check if slug is already used by another page
    const slugCheck = (await query("SELECT id FROM pages WHERE slug = ? AND id != ?", [slug, id])) as any[]

    if (slugCheck.length > 0) {
      return NextResponse.json({ message: "A different page with this slug already exists" }, { status: 400 })
    }

    // Update the page
    await query(
      `UPDATE pages 
       SET title = ?, slug = ?, content = ?, meta_title = ?, meta_description = ?, status = ?
       WHERE id = ?`,
      [title, slug, content, meta_title, meta_description, status, id],
    )

    // Get the updated page
    const updatedPage = (await query("SELECT * FROM pages WHERE id = ?", [id])) as any[]

    return NextResponse.json({
      message: "Page updated successfully",
      page: updatedPage[0],
    })
  } catch (error) {
    console.error("Error updating page:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/pages/[id] - Delete a page
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Check if page exists
    const existingPages = (await query("SELECT id FROM pages WHERE id = ?", [id])) as any[]

    if (existingPages.length === 0) {
      return NextResponse.json({ message: "Page not found" }, { status: 404 })
    }

    // Delete the page
    await query("DELETE FROM pages WHERE id = ?", [id])

    return NextResponse.json({
      message: "Page deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting page:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

