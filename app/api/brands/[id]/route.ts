import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { writeFile } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

// GET /api/brands/[id] - Get a single brand
export async function GET(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  try {
    const nextReq = req as NextRequest;
    const isAdminUser = await isAdmin(nextReq);
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    const brands = (await query("SELECT * FROM brands WHERE id = ?", [id])) as any[];

    if (brands.length === 0) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(brands[0]);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/brands/[id] - Update a brand
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  try {
    const nextReq = req as NextRequest;
    const isAdminUser = await isAdmin(nextReq);
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    const formData = await nextReq.formData();

    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const domain = formData.get("domain") as string;
    const brandUrl = formData.get("brand_url") as string;
    const file = formData.get("file") as File | null;

    if (!name || !slug) {
      return NextResponse.json({ message: "Name and slug are required" }, { status: 400 });
    }

    // Check if brand exists
    const existingBrands = (await query("SELECT id FROM brands WHERE id = ?", [id])) as any[];
    if (existingBrands.length === 0) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // Check for duplicate slug
    const slugCheck = (await query(
      "SELECT id FROM brands WHERE slug = ? AND id != ?",
      [slug, id]
    )) as any[];
    if (slugCheck.length > 0) {
      return NextResponse.json(
        { message: "A different brand with this slug already exists" },
        { status: 400 }
      );
    }

    let iconFilename: string | null = null;

    if (file && file.size > 0) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const extension = file.name.split(".").pop();
      iconFilename = `${uuidv4()}.${extension}`;
      const filePath = path.join(process.cwd(), "public/uploads/brand-icons", iconFilename);
      await writeFile(filePath, buffer);
    }

    const updateFields = [name, slug, description, domain, brandUrl];
    let queryStr = `UPDATE brands SET name = ?, slug = ?, description = ?, domain = ?, brand_url = ?`;

    if (iconFilename) {
      queryStr += `, icon = ?`;
      updateFields.push(iconFilename);
    }

    queryStr += ` WHERE id = ?`;
    updateFields.push(id);

    await query(queryStr, updateFields);

    const updatedBrand = (await query("SELECT * FROM brands WHERE id = ?", [id])) as any[];

    return NextResponse.json({
      message: "Brand updated successfully",
      brand: updatedBrand[0],
    });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/brands/[id] - Delete a brand
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { params } = context;
  try {
    const nextReq = req as NextRequest;
    const isAdminUser = await isAdmin(nextReq);
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;

    // Check if brand exists
    const existingBrand = (await query("SELECT id FROM brands WHERE id = ?", [id])) as any[];

    if (existingBrand.length === 0) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // Check if brand is used by any products
    const productsUsingBrand = (await query("SELECT COUNT(*) as count FROM products WHERE category_id = ?", [
      id,
    ])) as any[];

    if (productsUsingBrand[0].count > 0) {
      return NextResponse.json({ message: "Cannot delete brand because it is used by products" }, { status: 400 });
    }

    // Delete the brand
    await query("DELETE FROM brands WHERE id = ?", [id]);

    return NextResponse.json({
      message: "Brand deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
