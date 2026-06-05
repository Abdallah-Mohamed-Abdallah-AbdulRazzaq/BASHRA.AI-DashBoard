import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let body;
  try {
    // قراءة الـ body مرة واحدة فقط
    body = await req.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { messages } = body;
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "Groq API key missing" },
      { status: 500 }
    );
  }

  try {
    // تحويل الرسائل إلى الصيغة المطلوبة
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.content,
    }));

    // استخدم أحدث موديل مدعوم
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: formattedMessages,
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    // إذا كان الرد غير ناجح، نقرأ النص كاملًا ونعرضه
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq Error:", response.status, errorText);
      return NextResponse.json(
        { error: `Groq API error: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    const text = data.choices[0]?.message?.content;
    if (!text) throw new Error("No content in response");

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Chat API Error:", error.message);
    return NextResponse.json(
      { error: "عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي." },
      { status: 500 }
    );
  }
}













// model: "llama-3.3-70b-versatile",
// // أو
// model: "mixtral-8x7b-32768",
// // أو للنسخة الأصغر حجماً والأسرع
// model: "gemma2-9b-it",


































// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { messages } = body;

//     const apiKey = process.env.HUGGINGFACE_API_KEY?.trim();
//     if (!apiKey || !apiKey.startsWith("hf_")) {
//       console.error("Invalid HF token:", apiKey);
//       return NextResponse.json(
//         { error: "Hugging Face API key is missing or invalid." },
//         { status: 500 }
//       );
//     }

//     // تحويل الرسائل إلى الصيغة المطلوبة
//     const formattedMessages = messages.map((msg: any) => ({
//       role: msg.role === "ai" ? "assistant" : "user",
//       content: msg.content,
//     }));

//     // استخدم موديل مجاني ومعروف
//       const MODEL = "HuggingFaceH4/zephyr-7b-beta";
      
//     const response = await fetch(
//       `https://router.huggingface.co/hf-inference/models/${MODEL}/v1/chat/completions`,
//       {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${apiKey}`,
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           model: MODEL,
//           messages: formattedMessages,
//           max_tokens: 800,
//           temperature: 0.7,
//         }),
//       }
//     );

//     // قراءة الاستجابة حتى لو كانت غير JSON (مثل 404)
//     const responseText = await response.text();
//     if (!response.ok) {
//     const errorText = await response.text();
//     console.error(`HF Error (${response.status}):`, errorText);
//     // حاول تفسير الخطأ إذا كان JSON
//     try {
//         const errorJson = JSON.parse(errorText);
//         throw new Error(`Hugging Face API: ${errorJson.error || errorText}`);
//     } catch {
//         throw new Error(`Hugging Face API responded with ${response.status}: ${errorText}`);
//     }
//     }

//     // محاولة تحويل الرد إلى JSON
//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (e) {
//       console.error("Failed to parse HF response as JSON:", responseText);
//       throw new Error("Invalid JSON response from Hugging Face");
//     }

//     const text = data.choices?.[0]?.message?.content;
//     if (!text) {
//       throw new Error("No content in response");
//     }

//     return NextResponse.json({ text });
//   } catch (error: any) {
//     console.error("Chat API Error:", error.message);
//     return NextResponse.json(
//       { error: "عذراً، حدث خطأ في الاتصال بالذكاء الاصطناعي." },
//       { status: 500 }
//     );
//   }
// }
















































// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { messages } = body;

//     // استخدام الموديل الأحدث المتوافق مع مفتاحك
//     const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     // تجهيز تاريخ المحادثة
//     let formattedHistory = messages.slice(0, -1).map((msg: any) => ({
//       role: msg.role === "ai" ? "model" : "user",
//       parts: [{ text: msg.content }],
//     }));

//     // فلترة الرسالة الترحيبية لتجنب رفض جوجل لها
//     if (formattedHistory.length > 0 && formattedHistory[0].role === "model") {
//       formattedHistory.shift(); 
//     }

//     const latestMessage = messages[messages.length - 1].content;

//     const chat = model.startChat({
//       history: formattedHistory,
//     });

//     const result = await chat.sendMessage(latestMessage);
//     const response = await result.response;
//     const text = response.text();

//     return NextResponse.json({ text });
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return NextResponse.json(
//       { error: "Failed to process chat request" },
//       { status: 500 }
//     );
//   }
// }