import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import scrapeMeesho from "../scrappers/meeso"; // Adjust path based on where route.ts is located

interface Product {
  title: string;
  price: string;
}

// GET /api/products - Get all products with pagination and search
export async function GET(req: NextRequest) {
  try {
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    let sql = `
      SELECT p.*, c.name as category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;

    const queryParams: any[] = [];

    if (search) {
      sql += ` WHERE p.name LIKE ? OR p.description LIKE ?`;
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    const countSql = `
      SELECT COUNT(*) as total FROM products
      ${search ? "WHERE name LIKE ? OR description LIKE ?" : ""}
    `;
    const countArgs = search ? [`%${search}%`, `%${search}%`] : [];
    const countResult = (await query(countSql, countArgs)) as any[];
    const total = countResult[0].total;

    sql += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);

    const products = await query(sql, queryParams);

    return NextResponse.json({
      products,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST /api/products - Create a new product from Meesho URL
export async function POST(req: NextRequest) {
  try {
    const isAdminUser = await isAdmin(req);
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

          const formData = await req.formData(); // or receive as parameter if using server action
          const brandIdRaw = formData.get("brand_id");
          const productUrl = formData.get("product_url");

          if (!productUrl || typeof productUrl !== "string") {
            console.error("Invalid or missing product_url", formData);
            return NextResponse.json({ message: "Invalid or missing product_url" }, { status: 200 });
          }

          const brand_id = brandIdRaw ? parseInt(brandIdRaw.toString(), 10) : null;

          if (!brand_id || isNaN(brand_id)) {
            console.error("Invalid or missing brand_id", formData);
            throw new Error("Invalid or missing brand ID");
          }
          return NextResponse.json({ message: "Internal server error" }, { url: productUrl });
          const response = await scrapeMeesho(productUrl);
          console.log(678)
          console.log("Scraped products:", response);
    

    // if (!product_url || !brand_id) {
    //   return NextResponse.json(
    //     { message: "Missing product_url or brand_id" },
    //     { status: 400 }
    //   );
    // }

    // const scrapedProducts = await scrapeMeesho(product_url);
    // if (!scrapedProducts.length) {
    //   return NextResponse.json(
    //     { message: "No products found at the provided URL" },
    //     { status: 404 }
    //   );
    // }

    // // Example: Inserting the first scraped product
    // const { title, price } = scrapedProducts[0];
    // const slug = title.toLowerCase().replace(/\s+/g, "-");

    // // Check if product already exists
    // const existing = (await query(
    //   "SELECT id FROM affiliate_products WHERE slug = ?",
    //   [slug]
    // )) as any[];

    // if (existing.length > 0) {
    //   return NextResponse.json(
    //     { message: "Product with this slug already exists" },
    //     { status: 400 }
    //   );
    // }

    // const result = (await query(
    //   `
    //   INSERT INTO affiliate_products (brand_id, name, slug, price, affiliate_link)
    //   VALUES (?, ?, ?, ?, ?)
    //   `,
    //   [brand_id, title, slug, price, product_url]
    // )) as any;

    // const newProduct = (await query(
    //   "SELECT * FROM affiliate_products WHERE id = ?",
    //   [result.insertId]
    // )) as any[];

    // return NextResponse.json(
    //   { message: "Product created successfully", product: 123 },
    //   { status: 201 }
    // );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
