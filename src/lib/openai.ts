import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export interface GenerateIdeaRequest {
  prompt: string
  filters?: {
    industry?: string
    budget?: string
    skill_level?: string
    ai_use?: boolean
  }
}

export interface GeneratedIdea {
  name: string
  description: string
  monetization: string
  tools_needed: string[]
  time_to_mvp: string
  difficulty: string
  category?: string
}

export async function generateBusinessIdea(request: GenerateIdeaRequest): Promise<GeneratedIdea> {
  const { prompt, filters } = request
  
  let systemPrompt = `You are an expert business consultant and entrepreneur. Generate a high-quality, actionable business idea based on the user's prompt. 

  Structure your response as a JSON object with these exact fields:
  - name: A catchy, memorable business name
  - description: 2-3 sentences describing the business concept
  - monetization: Clear revenue model and pricing strategy
  - tools_needed: Array of specific tools, platforms, or skills required
  - time_to_mvp: Realistic timeframe to build minimum viable product
  - difficulty: One of "Beginner", "Intermediate", "Advanced"
  - category: Business model type (e.g., "SaaS", "E-commerce", "Service", "Content", "Agency")

  Make the idea specific, actionable, and realistic. Focus on modern opportunities and current market trends.`

  if (filters) {
    if (filters.industry) {
      systemPrompt += `\n\nFocus on the ${filters.industry} industry.`
    }
    if (filters.budget) {
      systemPrompt += `\n\nConsider a ${filters.budget} budget constraint.`
    }
    if (filters.skill_level) {
      systemPrompt += `\n\nTarget ${filters.skill_level} skill level.`
    }
    if (filters.ai_use) {
      systemPrompt += `\n\nIncorporate AI technology as a core component.`
    }
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
    temperature: 0.8,
    max_tokens: 800,
  })

  const response = completion.choices[0]?.message?.content
  if (!response) {
    throw new Error('Failed to generate business idea')
  }

  try {
    return JSON.parse(response)
  } catch {
    throw new Error('Failed to parse generated business idea')
  }
} 