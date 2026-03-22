import { db } from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { product_name, product_code, description, price, discount } = data;

    if (!product_name || !product_code || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if code exists
    const existing = await db.collection("products").where("product_code", "==", product_code).get();
    if (!existing.empty) {
      return NextResponse.json({ error: "Product code already exists" }, { status: 400 });
    }

    const newProduct = {
      product_name,
      product_code,
      description: description || "",
      price: Number(price),
      discount: discount || "",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("products").add(newProduct);
    return NextResponse.json({ success: true, product: newProduct });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
