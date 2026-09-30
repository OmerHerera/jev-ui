import express from "express";
import { choice, TypeSafeClient } from "@typesafe-ai/sdk";

const app = express();
const port = Number(process.env.PORT ?? 3001);
const options = {
  world_clock:
    "The user asks for the current time where they are or in one specific location.",
  rest_world_clock:
    "The user asks what time it is around the world, in the rest of the world, across cities or countries, or in multiple time zones. Show their local time and a browsable world clock.",
  unsupported:
    "A request that is not primarily asking for the current time, date, or time in a location.",
} as const;

app.use(express.json({ limit: "2kb" }));

app.post("/api/decide", async (request, response) => {
  const prompt = request.body?.prompt;
  if (typeof prompt !== "string" || !prompt.trim() || prompt.length > 300) {
    response.status(400).json({
      error: "Prompt must be a non-empty string under 300 characters.",
    });
    return;
  }

  if (!process.env.TYPESAFE_API_KEY) {
    console.log("ssss");
    const globalTimeRequest =
      /\b(rest of the world|around the world|across (?:the )?world|worldwide|multiple time zones|different time zones|across cities|across countries)\b/i.test(
        prompt,
      );
    const supported = /\b(time|clock|timezone|date|day)\b/i.test(prompt);
    response.json({
      component:
        globalTimeRequest && supported
          ? "rest_world_clock"
          : supported
            ? "world_clock"
            : "unsupported",
      confidence: 0.5,
      source: "demo",
    });
    return;
  }

  try {
    const client = new TypeSafeClient();
    const result = await client.systemOne({
      state: { user_prompt: prompt.trim() },
      questions: {
        component: choice(
          "Which registered UI component best answers the user prompt?",
          options,
        ),
      },
    });
    const answer = result.answers.component;
    const component = answer.confidence < 0.2 ? "unsupported" : answer.choice;
    response.json({ component, confidence: answer.confidence, source: "jev" });
  } catch {
    response.status(502).json({
      error: "Jev could not make a decision. Check the API key and try again.",
    });
  }
});

app.listen(port, () => {
  console.log(`Decision API listening on http://localhost:${port}`);
});
