import { Router, Request, Response } from "express";
import groq, { GROQ_MODEL } from "../services/groq";
import { getPrompt } from "../utils/promptRouter";
import { buildSessionKey, getHistory, appendTurn, clearSession } from "../services/session";
import { ChatMessage, ChatRequestBody } from "../types/chat";

const router = Router();

router.get("/status", (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    service: "CivicIQ AI Copilot",
    model: GROQ_MODEL,
  });
});

router.post("/chat", async (req: Request, res: Response) => {
  try {
    const {
      role = "citizen",
      message,
      sessionId = "default",
      context,
      chatbotType,
    } = req.body as ChatRequestBody;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "`message` is required and must be a string." });
    }

    const systemPrompt = getPrompt(role, chatbotType);
    const sessionKey = buildSessionKey(role, sessionId);
    const history = getHistory(sessionKey);

    const messages: ChatMessage[] = [{ role: "system", content: systemPrompt }];

    if (context) {
      messages.push({
        role: "system",
        content: `Current CivicIQ Context:\n${JSON.stringify(context, null, 2)}`,
      });
    }

    messages.push(...history);
    messages.push({ role: "user", content: message });

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 1200,
    });

    const reply = completion.choices[0]?.message?.content ?? "No response.";

    appendTurn(sessionKey, message, reply);

    res.json({
      success: true,
      reply,
      role,
    });
  } catch (error: any) {
    console.error("Groq Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
});

router.delete("/session/:role/:id", (req: Request, res: Response) => {
  const { role, id } = req.params;
  const sessionKey = buildSessionKey(role, id);
  clearSession(sessionKey);
  res.json({ success: true, message: "Session cleared" });
});

export default router;
