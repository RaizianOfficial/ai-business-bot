import { db } from "@/lib/firebase";
import { sendOrderNotification } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const orderData = await req.json();
    
    const order = {
      ...orderData,
      status: "pending",
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

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error: any) {
    console.error("Save order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
