import { db } from "@/lib/firebase";
import { sendOrderNotification } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    
    // Generate a unique Order ID: #VL + random 4-digit number
    const orderId = `#VL${Math.floor(1000 + Math.random() * 9000)}`;

    const order = {
      ...orderData,
      order_id: orderId,
      status: "Pending",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Save to Firestore
    const docRef = await db.collection("orders").add(order);
    
    // Send Email
    try {
      await sendOrderNotification(order);
    } catch (emailError) {
      console.error("Email notification failed:", emailError);
      // We don't fail the request if email fails, but we log it
    }

    return NextResponse.json({ success: true, id: docRef.id, order_id: orderId });
  } catch (error: any) {
    console.error("Save order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
