import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db"
import { isAdmin } from "@/lib/auth"

// GET /api/orders/[id] - Get a single order with its items
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id

    // Get order details
    const orders = (await query(
      `SELECT o.*, u.name as user_name, u.email as user_email
       FROM orders o
       LEFT JOIN users u ON o.user_id = u.id
       WHERE o.id = ?`,
      [id],
    )) as any[]

    if (orders.length === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    const order = orders[0]

    // Get order items
    const orderItems = await query(
      `SELECT oi.*, p.name as product_name, p.image_url
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [id],
    )

    return NextResponse.json({
      order,
      items: orderItems,
    })
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/orders/[id] - Update order status
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if user is admin
    const isAdminUser = await isAdmin(req)
    if (!isAdminUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const id = params.id
    const { status, payment_status } = await req.json()

    // Check if order exists
    const existingOrders = (await query("SELECT id FROM orders WHERE id = ?", [id])) as any[]

    if (existingOrders.length === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 })
    }

    // Update the order status
    await query("UPDATE orders SET status = ?, payment_status = ? WHERE id = ?", [status, payment_status, id])

    // Get the updated order
    const updatedOrder = (await query("SELECT * FROM orders WHERE id = ?", [id])) as any[]

    return NextResponse.json({
      message: "Order updated successfully",
      order: updatedOrder[0],
    })
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

