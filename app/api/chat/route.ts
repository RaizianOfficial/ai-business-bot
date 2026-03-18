import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const questions = [
  "May I know your name? 😊",
  "Please enter the product code you want to order.",
  "What is your phone number?",
  "Which city/state should we deliver to?",
  "Please enter your full delivery address.",
  "Can I have your email?(If you want, otherwise say skip)",
  "Any custom message for the gift? (If you want, otherwise say no)"
];

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        text: "Welcome to Velourah 🎁\n\nI can help you:\n\n1. Place a new order\n2. Track an existing order\n\nType:\nOrder\nor\nTrack #OrderID",
        quickButtons: ["Place Order", "Track Order"]
      });
    }

    const lastMessage = messages[messages.length - 1]?.content || "";

    // TRACKING FLOW: Detect #VL...
    const match = lastMessage.match(/#VL\d+/i);
    if (match) {
      const orderId = match[0].toUpperCase();
      try {
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("host");
        const res = await fetch(`${protocol}://${host}/api/track-order?orderId=${encodeURIComponent(orderId)}`);
        const data = await res.json();

        if (data.found && data.order) {
          const order = data.order;
          return NextResponse.json({
            text: `📦 Order Details\nOrder ID: ${order.order_id}\n👤Customer Name: ${order.customer_name}\n📍City: ${order.city}\nStatus: ${order.status}`,
            quickButtons: ["Place Order", "Track Order"]
          });
        } else {
          return NextResponse.json({ 
            text: "❌ Order not found.",
            quickButtons: ["Place Order", "Track Order"]
          });
        }
      } catch (e) {
        console.error("Order tracking error:", e);
        return NextResponse.json({ 
          text: "❌ Order not found.",
          quickButtons: ["Place Order", "Track Order"]
        });
      }
    }

    // TRACKING FLOW: Detect Track request without ID
    if (lastMessage.toLowerCase() === "track order" || lastMessage.toLowerCase() === "track") {
      return NextResponse.json({
        text: "Please enter your Order ID 🔍\n\nExample: #VL1023"
      });
    }

    // ORDER FLOW
    const userMessages = messages.filter((m: any) => m.role === "user");

    // Walk backwards to find the last explicit starting command
    let startIndex = -1;
    let mode = "order"; // Default to order if no specific command was typed
    for (let i = userMessages.length - 1; i >= 0; i--) {
        const text = userMessages[i].content.trim().toLowerCase();
        if (text === "order" || text === "place order") {
            startIndex = i;
            mode = "order";
            break;
        }
        if (text === "track" || text === "track order" || userMessages[i].content.match(/#VL\d+/i)) {
            startIndex = i;
            mode = "track";
            break;
        }
    }

    if (mode === "track") {
        // Reached only if user previously typed "track", we asked for ID, and they responded with something invalid.
        return NextResponse.json({
            text: "Please enter a valid Order ID starting with #VL.\n\nExample: #VL1023",
            quickButtons: ["Place Order", "Track Order"]
        });
    }

    // Extract only messages sent AFTER the "Order" command
    let relevantMessages = userMessages.slice(startIndex + 1);
    const stepIndex = relevantMessages.length;

    // Ask next question
    if (stepIndex < questions.length) {
      return NextResponse.json({ text: questions[stepIndex] });
    } else {
      // Collect order data
      const orderData = {
        name: relevantMessages[0]?.content || "",
        product_code: relevantMessages[1]?.content || "",
        phone: relevantMessages[2]?.content || "",
        city: relevantMessages[3]?.content || "",
        address: relevantMessages[4]?.content || "",
        email: "Not provided",
        custom_message: "None"
      };

      if (relevantMessages[5]) {
        const val = relevantMessages[5].content.toLowerCase();
        orderData.email = (val === "skip" || val === "no") ? "Not provided" : relevantMessages[5].content;
      }

      if (relevantMessages[6]) {
        const val = relevantMessages[6].content.toLowerCase();
        orderData.custom_message = (val === "skip" || val === "no") ? "None" : relevantMessages[6].content;
      }

      const generatedOrderId = "#VL" + Math.floor(1000 + Math.random() * 9000);

      try {
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("host");

        const saveRes = await fetch(`${protocol}://${host}/api/save-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...orderData, order_id: generatedOrderId })
        });

        let finalOrderId = generatedOrderId;
        if (saveRes.ok) {
          const data = await saveRes.json();
          if (data.order_id) finalOrderId = data.order_id;
        }

        return NextResponse.json({
          text: `🎉 Order placed successfully!\nOrder ID: ${finalOrderId}\nYou can use this to track your order anytime 🥰.`,
          quickButtons: ["Place Order", "Track Order"]
        });
      } catch (e) {
        console.error("Failed to save order:", e);
        return NextResponse.json({
          text: "Sorry, there was an error placing your order. Please try again.",
          quickButtons: ["Place Order", "Track Order"]
        });
      }
    }

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}