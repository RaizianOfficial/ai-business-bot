import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    const lastAssistantMessageInfo = messages.length > 1 ? messages[messages.length - 2].content : "";

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
            text: `📦 Order Details\nOrder ID: ${order.order_id}\n👤Customer Name: ${order.customer_name || order.name}\n📍City: ${order.city}\nStatus: ${order.status}`,
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

    // ORDER FLOW: Reset flow if user types Order
    if (lastMessage.toLowerCase() === "order" || lastMessage.toLowerCase() === "place order") {
       return NextResponse.json({ text: "May I know your name? 😊" });
    }

    // Determine what to ask next based on the last assistant message
    if (lastAssistantMessageInfo.includes("Welcome to Velourah")) {
       return NextResponse.json({ text: "May I know your name? 😊" });
    }
    else if (lastAssistantMessageInfo.includes("know your name")) {
       return NextResponse.json({ text: "Please enter the product code you want to order." });
    }
    else if (lastAssistantMessageInfo.includes("product code you want to order") || lastAssistantMessageInfo.includes("Invalid product code")) {
       // User entered product code. Validate it.
       const code = lastMessage.trim().toUpperCase(); // normalize code
       
       const protocol = req.headers.get("x-forwarded-proto") || "http";
       const host = req.headers.get("host");
       
       try {
           const res = await fetch(`${protocol}://${host}/api/get-product?code=${encodeURIComponent(code)}`);
           const prodData = await res.json();
           
           if (prodData.found) {
               const p = prodData.product;
               const discountLine = p.discount ? `\nDiscount: ${p.discount}` : "";
               return NextResponse.json({
                   text: `🛍 Product Details:\n\nName: ${p.product_name}\nPrice: ₹${p.price}${discountLine}\n\nDo you want to order this product?`,
                   quickButtons: ["Yes, continue", "Change product"]
               });
           } else {
               return NextResponse.json({
                   text: "❌ Invalid product code. Please enter a valid code."
               });
           }
       } catch (error) {
           console.error("Product fetch error:", error);
           return NextResponse.json({
               text: "❌ Invalid product code. Please enter a valid code."
           });
       }
    }
    else if (lastAssistantMessageInfo.includes("Do you want to order this product?")) {
       if (lastMessage.toLowerCase() === "change product" || lastMessage.toLowerCase() === "change") {
           return NextResponse.json({ text: "Please enter the product code you want to order." });
       } else {
           return NextResponse.json({ text: "What is your phone number?" });
       }
    }
    else if (lastAssistantMessageInfo.includes("phone number")) {
       return NextResponse.json({ text: "Which city/state should we deliver to?" });
    }
    else if (lastAssistantMessageInfo.includes("city/state")) {
       return NextResponse.json({ text: "Please enter your full delivery address." });
    }
    else if (lastAssistantMessageInfo.includes("delivery address")) {
       return NextResponse.json({ text: "Can I have your email?(If you want, otherwise say skip)" });
    }
    else if (lastAssistantMessageInfo.includes("your email")) {
       return NextResponse.json({ text: "Any custom message for the gift? (If you want, otherwise say no)" });
    }
    else if (lastAssistantMessageInfo.includes("custom message")) {
       // Gather all data!
       const orderData = {
          name: "", product_code: "", phone: "", city: "", address: "", email: "Not provided", custom_message: "None"
       };
       
       // Extraction loop: look at pairs of "assistant -> user" messages
       for (let i = 0; i < messages.length - 1; i++) {
          const msg = messages[i];
          const nextMsg = messages[i+1];
          if (msg.role === "assistant" && nextMsg.role === "user") {
             const q = msg.content.toLowerCase();
             const ans = nextMsg.content;
             if (q.includes("know your name")) orderData.name = ans;
             // The code could be overwritten if they changed product
             if (q.includes("product code you want")) orderData.product_code = ans.toUpperCase();
             if (q.includes("phone number")) orderData.phone = ans;
             if (q.includes("city/state")) orderData.city = ans;
             if (q.includes("delivery address")) orderData.address = ans;
             if (q.includes("your email")) orderData.email = (ans.toLowerCase() === "skip" || ans.toLowerCase() === "no") ? "Not provided" : ans;
             if (q.includes("custom message")) orderData.custom_message = (ans.toLowerCase() === "skip" || ans.toLowerCase() === "no") ? "None" : ans;
          }
       }
       
       const protocol = req.headers.get("x-forwarded-proto") || "http";
       const host = req.headers.get("host");
       
       // Fetch product details one more time to include in order record
       let prodDetails = { product_name: "", price: 0, discount: "" };
       try {
           const res = await fetch(`${protocol}://${host}/api/get-product?code=${encodeURIComponent(orderData.product_code)}`);
           const pData = await res.json();
           if (pData.found) {
               prodDetails = pData.product;
           }
       } catch (e) {
           console.error("Failed to fetch product for save:", e);
       }

       // Save order
       const finalData = {
           ...orderData,
           product_name: prodDetails.product_name,
           price: prodDetails.price,
           discount: prodDetails.discount
       };

       try {
         const saveRes = await fetch(`${protocol}://${host}/api/save-order`, {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify(finalData)
         });
         
         let finalOrderId = "N/A";
         if (saveRes.ok) {
           const data = await saveRes.json();
           if (data.order_id) finalOrderId = data.order_id;
         }

         return NextResponse.json({
           text: `🎉 Order placed successfully!\nOrder ID: ${finalOrderId}\nYou can use this to track your order anytime 🥰.`,
           quickButtons: ["Place Order", "Track Order"]
         });
       } catch(e) {
         console.error("Failed to save order:", e);
         return NextResponse.json({
           text: "Sorry, there was an error placing your order. Please try again.",
           quickButtons: ["Place Order", "Track Order"]
         });
       }
    }
    
    // Fallback
    return NextResponse.json({
      text: "I didn't quite catch that. Try saying 'Order' or 'Track Order'."
    });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}