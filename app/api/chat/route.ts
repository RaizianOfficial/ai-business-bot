import { model } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({
        text: "✨ Welcome to the online shop of Velourah!\nMay I know your name first? 😊"
      });
    }

    let orderData: any = {
      name: "",
      product_code: "",
      phone: "",
      city: "",
      address: "",
      email: "",
      custom_message: ""
    };

    let lastAsk = "";
    for (const m of messages) {
      if (m.role === "assistant" || m.role === "model") {
        const text = m.content.toLowerCase();
        if (text.includes("name")) lastAsk = "name";
        else if (text.includes("product code") || text.includes("hamper code")) lastAsk = "product_code";
        else if (text.includes("phone") || text.includes("number")) lastAsk = "phone";
        else if (text.includes("city")) lastAsk = "city";
        else if (text.includes("address") || text.includes("delivery address")) lastAsk = "address";
        else if (text.includes("email")) lastAsk = "email";
        else if (text.includes("message") || text.includes("card")) lastAsk = "custom_message";
      } else if (m.role === "user") {
        if (lastAsk) orderData[lastAsk] = m.content;
      }
    }

    let nextStep = "";
    if (!orderData.name) nextStep = "ASK_NAME";
    else if (!orderData.product_code) nextStep = "ASK_PRODUCT_CODE";
    else if (!orderData.phone) nextStep = "ASK_PHONE";
    else if (!orderData.city) nextStep = "ASK_CITY";
    else if (!orderData.address) nextStep = "ASK_ADDRESS";
    else if (!orderData.email) nextStep = "ASK_EMAIL";
    else if (!orderData.custom_message) nextStep = "ASK_MESSAGE";
    else nextStep = "CONFIRM_ORDER";

    if (nextStep === "CONFIRM_ORDER") {
      try {
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("host");
        
        await fetch(`${protocol}://${host}/api/save-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData)
        });
      } catch (e) {
        console.error("Failed to parse/save order:", e);
      }

      return NextResponse.json({ 
        text: "🎉 Thank you for your order!\n\nOur team will contact you soon to confirm your hamper." 
      });
    }

    const stepContexts: any = {
      ASK_NAME: "Ask the customer for their name.",
      ASK_PRODUCT_CODE: `Thank the user by name (${orderData.name}). Ask them for the hamper product code they want to order.`,
      ASK_PHONE: "Ask the customer for their contact phone number.",
      ASK_CITY: "Ask the customer for the delivery city.",
      ASK_ADDRESS: "Ask the customer for their full delivery address.",
      ASK_EMAIL: "Ask the customer for their email address (optional). If they say no, accept it.",
      ASK_MESSAGE: "Ask the customer if they want to add a custom message for the gift card (optional). If they say no, accept it."
    };

    const prompt = `You are a helpful gift hamper assistant. 
${stepContexts[nextStep]} 
Keep the question short, natural, and friendly. Do not include any extra conversation.`;

    let text = "";
    try {
      const result = await model.generateContent(prompt);
      text = result.response.text();
    } catch (e) {
      console.error("Gemini failed, using static fallback:", e);
      const fallbacks: any = {
        ASK_NAME: "May I know your name first? 😊",
        ASK_PRODUCT_CODE: `Thanks ${orderData.name || ""}! Please provide the hamper product code you'd like to order.`,
        ASK_PHONE: "What is your contact phone number?",
        ASK_CITY: "Which city should we deliver this to?",
        ASK_ADDRESS: "Please provide the full delivery address.",
        ASK_EMAIL: "Can I have your email address? (You can say skip)",
        ASK_MESSAGE: "Any custom message for the gift card? (You can say no)"
      };
      text = fallbacks[nextStep];
    }

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "AI response failed" },
      { status: 500 }
    );
  }
}