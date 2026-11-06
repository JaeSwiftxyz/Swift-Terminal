import { Router } from "express";

// The assistant talks to any OpenAI-compatible chat endpoint (LLM_API_URL)
// with plain fetch. Without LLM_API_KEY it reports itself unavailable.
export const aiRouter = Router();

const LLM_API_URL = (process.env.LLM_API_URL ?? "https://api.venice.ai/api/v1").replace(/\/+$/, "");
const LLM_API_KEY = process.env.LLM_API_KEY ?? "";
const LLM_MODEL = process.env.LLM_MODEL ?? "claude-haiku-5-5";

const SYSTEM = `You are the AI assistant inside OpenTerminal, a Bloomberg-style financial terminal.
You help the user interpret market data, charts, news, options chains and macro indicators.
Answer concisely and professionally, in the language the user writes in.
When market data is provided in the conversation as JSON context, ground your answer in it.
You are not a licensed financial advisor: never give personalized investment advice or tell the user what to buy or sell.`;

type Message = { role: "user" | "assistant"; content: string };

aiRouter.post("/chat", async (req, res) => {
  const { messages, context } = req.body ?? {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array required" });
  }
  if (!LLM_API_KEY) {
    return res.status(503).json({ error: "AI assistant unavailable: set LLM_API_KEY on the server." });
  }
  try {
    const contextBlock: Message[] = context
      ? [{ role: "user", content: `Current terminal context (JSON):\n${JSON.stringify(context)}` }]
      : [];
    const upstream = await fetch(`${LLM_API_URL}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${LLM_API_KEY}` },
      body: JSON.stringify({
        model: LLM_MODEL,
        max_tokens: 16000,
        messages: [{ role: "system", content: SYSTEM }, ...contextBlock, ...messages],
        venice_parameters: { strip_thinking_response: true },
      }),
    });
    const data = (await upstream.json().catch(() => ({}))) as {
      choices?: { message?: { content?: string }; finish_reason?: string }[];
      error?: { message?: string } | string;
    };
    if (!upstream.ok) {
      const err = data.error;
      const msg = typeof err === "string" ? err : err?.message ?? `HTTP ${upstream.status}`;
      return res.status(502).json({ error: msg });
    }
    const choice = data.choices?.[0];
    if (choice?.finish_reason === "refusal") {
      return res.json({ text: "The assistant declined to answer this request." });
    }
    res.json({ text: choice?.message?.content ?? "" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(502).json({ error: msg });
  }
});
