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
        text: "Welcome to Velourah 🎁\n\nI can help you:\n\n1️⃣ Place a new hamper order\n2️⃣ Track an existing order\n\nType:\n**Order** to place a new order\nor\n**Track #OrderID** to check your order status",
        quickButtons: ["Place Order", "Track Order"]
      });
    }

    const lastMessage = messages[messages.length - 1]?.content || "";

    // 6. Add order tracking detection
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
            text: `📦 Order Details\nOrder ID: ${order.order_id}\n👤Customer Name: ${order.customer_name}\n📍City: ${order.city}\nStatus: ${order.status}`
          });
        } else {
          return NextResponse.json({ text: "❌ Order not found." });
        }
      } catch (e) {
        console.error("Order tracking error:", e);
        return NextResponse.json({ text: "❌ Order not found." });
      }
    }

    if (lastMessage.toLowerCase() === "track order" || lastMessage.toLowerCase() === "track") {
      return NextResponse.json({
        text: "Please enter your Order ID 🔍\n\nExample: **#VL1023**"
      });
    }

    // 2. Implement step-based conversation logic
    // Exclude starting commands from counting towards stepIndex
    const ignoreWords = ["order", "place order"];
    const userMessages = messages.filter((m: any) =>
      m.role === "user" && !ignoreWords.includes(m.content.trim().toLowerCase()) && !m.content.trim().toLowerCase().includes("track")
    );

    const stepIndex = userMessages.length;

    if (stepIndex < questions.length) {
      return NextResponse.json({ text: questions[stepIndex] });
    } else {
      // 3. Map user input to orderData
      const orderData = {
        name: userMessages[0]?.content || "",
        product_code: userMessages[1]?.content || "",
        phone: userMessages[2]?.content || "",
        city: userMessages[3]?.content || "",
        address: userMessages[4]?.content || "",
        email: "Not provided",
        custom_message: "None"
      };

      if (userMessages[5]) {
        const val = userMessages[5].content.toLowerCase();
        orderData.email = (val === "skip" || val === "no") ? "Not provided" : userMessages[5].content;
      }

      if (userMessages[6]) {
        const val = userMessages[6].content.toLowerCase();
        orderData.custom_message = (val === "skip" || val === "no") ? "None" : userMessages[6].content;
      }

      // 5. Order completion logic
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
          text: "Sorry, there was an error placing your order. Please try again."
        });
      }
    }

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}