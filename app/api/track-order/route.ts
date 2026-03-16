import { db } from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const orderId = req.nextUrl.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // Search for order by order_id field
    const snapshot = await db
      .collection("orders")
      .where("order_id", "==", orderId.toUpperCase())
      .limit(1)
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ found: false });
    }

    const doc = snapshot.docs[0];
    const order = doc.data();

    return NextResponse.json({
      found: true,
      order: {
        order_id: order.order_id,
        customer_name: order.name || order.customer_name,
        product_code: order.product_code,
        phone: order.phone,
        city: order.city,
        address: order.address,
        email: order.email,
        custom_message: order.custom_message,
        status: order.status,
        created_at: order.created_at,
      },
    });
  } catch (error: any) {
    console.error("Track order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
