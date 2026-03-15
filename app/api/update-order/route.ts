import { db } from "@/lib/firebase";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  try {
    const { id, status, passkey, action } = await req.json();

    if (passkey !== process.env.ADMIN_PASSKEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (action === "delete") {
      await db.collection("orders").doc(id).delete();
      return NextResponse.json({ success: true });
    }

    await db.collection("orders").doc(id).update({ status });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Update order error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
