import { NextRequest, NextResponse } from 'next/server'
import { generateBusinessIdea, GenerateIdeaRequest } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateIdeaRequest = await request.json()
    
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      )
    }

    const idea = await generateBusinessIdea(body)
    
    return NextResponse.json({ idea })
  } catch (error) {
    console.error('Error generating business idea:', error)
    return NextResponse.json(
      { error: 'Failed to generate business idea' },
      { status: 500 }
    )
  }
} 