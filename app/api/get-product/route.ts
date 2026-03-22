import { db } from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");

    if (code) {
      // Get single product by code
      const snapshot = await db.collection("products").where("product_code", "==", code).limit(1).get();
      if (snapshot.empty) {
        return NextResponse.json({ found: false });
      }
      const product = snapshot.docs[0].data();
      return NextResponse.json({ found: true, product: { id: snapshot.docs[0].id, ...product } });
    } else {
      // Get all products. 
      const passkey = searchParams.get("passkey");
      // Could add passkey check here if needed like in orders api
      const snapshot = await db.collection("products").orderBy("created_at", "desc").get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return NextResponse.json({ success: true, products });
    }

  } catch (error: any) {
    return NextResponse.json({ found: false, error: error.message }, { status: 500 });
  }
}
