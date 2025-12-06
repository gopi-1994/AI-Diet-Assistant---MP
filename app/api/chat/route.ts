import { generateText } from "ai"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const systemPrompt = `You are a friendly and knowledgeable AI health coach specializing in personalized diet and fitness plans. 
    Help users achieve their health goals with evidence-based advice. Be supportive, motivating, and practical.
    Keep responses concise but helpful. Focus on nutrition, exercise, and lifestyle habits.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages: messages,
    })

    return Response.json({ content: text })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
