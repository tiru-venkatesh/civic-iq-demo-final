// src/routes/upload.ts
import { Router, Request, Response } from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Groq from "groq-sdk";
import type { UploadAnalysisResponse, HazardAnalysis } from "../types/upload";

const router = Router();

// Store the incoming file in memory (not on disk) before forwarding to Cloudinary
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/upload", upload.single("image"), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No image file provided" });
    }

    // 1. Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "civic-iq/complaints" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file!.buffer);
    });

    // 2. Ask Groq to analyze the hazard from the uploaded image URL
    const category = (req.body?.category as string) || "Civic Issue";
    const completion = await groq.chat.completions.create({
        model: "qwen/qwen3.6-27b",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `You are a municipal hazard-detection AI. Analyze this civic issue photo (reported category: "${category}"). Respond ONLY with strict JSON, no markdown, matching exactly this shape:
{"detectedProblem": string, "severity": "Low"|"Medium"|"High", "confidence": number (0-100), "reasoning": string, "estimatedRepairHours": number, "priorityScore": number (0-100), "estimatedBudgetINR": number}`,
            },
            { type: "image_url", image_url: { url: uploadResult.secure_url } },
          ],
        },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    // Strip <think>...</think> reasoning blocks (handles both closed and
    // unclosed tags — some reasoning models get cut off mid-thought if
    // max_tokens is hit before they reach the actual JSON answer).
    let cleaned = raw
      .replace(/<think>[\s\S]*?<\/think>/g, "")
      .replace(/<think>[\s\S]*/g, "")
      .replace(/```json|```/g, "")
      .trim();

    // Fallback safety net: if any stray text remains before/after the JSON
    // object, extract just the {...} portion.
    const jsonStart = cleaned.indexOf("{");
    const jsonEnd = cleaned.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
    }

    let analysis: HazardAnalysis;
    try {
      analysis = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Groq JSON response. Raw content:", raw);
      throw parseErr;
    }

    const response: UploadAnalysisResponse = {
      success: true,
      image: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        sizeBytes: uploadResult.bytes,
        fileName: req.file.originalname,
      },
      analysis,
    };

    return res.status(200).json(response);
  } catch (err) {
    console.error("Upload/analysis failed:", err);
    return res.status(500).json({ success: false, error: "Upload or analysis failed" });
  }
});

export default router;
