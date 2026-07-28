import { NextResponse } from "next/server";
import { AI_MODEL, createAIClient, sanitizeText } from "@/lib/ai";
import { requireUser } from "@/lib/auth";

export async function POST(request: Request) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const recipient = sanitizeText(body.recipient, 120);
  const goal = sanitizeText(body.goal, 600);
  const context = sanitizeText(body.context);
  const tone = sanitizeText(body.tone, 40) || "warm and direct";

  if (!recipient || !goal) {
    return NextResponse.json(
      { error: "Recipient and email goal are required." },
      { status: 400 },
    );
  }

  try {
    const openai = createAIClient();
    const result = await openai.responses.create({
      model: AI_MODEL,
      input: [
        {
          role: "system",
          content:
            "You are Signal, an expert B2B revenue assistant. Draft concise, specific email copy using only the supplied CRM context. Never invent claims, meetings, pricing, or commitments. Return a subject line followed by the email body.",
        },
        {
          role: "user",
          content: `Recipient: ${recipient}\nTone: ${tone}\nGoal: ${goal}\nCRM context:\n${context || "No additional context supplied."}`,
        },
      ],
      max_output_tokens: 600,
    });

    return NextResponse.json({
      content: result.output_text,
      model: AI_MODEL,
    });
  } catch {
    return NextResponse.json(
      { error: "Email generation is temporarily unavailable." },
      { status: 503 },
    );
  }
}
