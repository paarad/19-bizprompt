'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  RefreshCw, 
  Copy, 
  Save, 
  CheckCircle,
  Lightbulb,
  DollarSign,
  Wrench,
  Clock,
  TrendingUp,
  Sparkles
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface GeneratedResult {
  prompt: string
  idea: {
    name: string
    description: string
    monetization: string
    tools_needed: string[]
    time_to_mvp: string
    difficulty: string
    category?: string
  }
  timestamp: string
}

export default function ResultPage() {
  const [result, setResult] = useState<GeneratedResult | null>(null)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem('generatedIdea')
    if (stored) {
      setResult(JSON.parse(stored))
    } else {
      router.push('/')
    }
  }, [router])

  const handleRegenerate = async () => {
    if (!result) return
    
    setIsRegenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: result.prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to regenerate idea')
      }

      const data = await response.json()
      const newResult = {
        prompt: result.prompt,
        idea: data.idea,
        timestamp: new Date().toISOString()
      }
      
      setResult(newResult)
      localStorage.setItem('generatedIdea', JSON.stringify(newResult))
    } catch (error) {
      console.error('Error regenerating idea:', error)
      alert('Failed to regenerate business idea. Please try again.')
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    
    const text = `
Business Idea: ${result.idea.name}

Description: ${result.idea.description}

Monetization: ${result.idea.monetization}

Tools Needed: ${result.idea.tools_needed.join(', ')}

Time to MVP: ${result.idea.time_to_mvp}

Difficulty: ${result.idea.difficulty}

Generated with BizPrompt from prompt: "${result.prompt}"
    `.trim()

    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleSave = async () => {
    if (!result) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('business_ideas')
        .insert([
          {
            prompt: result.prompt,
            generated_idea: result.idea,
            is_public: true
          }
        ])

      if (error) {
        throw error
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving idea:', error)
      alert('Failed to save idea. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const isReasonableMvpTime = (value: string | undefined) => {
    if (!value) return false
    const lower = value.toLowerCase()
    if (lower.includes('year')) return false
    if (lower.includes('month')) return false
    const weekMatch = lower.match(/(\d+)(?:\s*-\s*(\d+))?\s*week/)
    if (!weekMatch) return false
    const minWeeks = parseInt(weekMatch[1], 10)
    const maxWeeks = weekMatch[2] ? parseInt(weekMatch[2], 10) : minWeeks
    if (Number.isNaN(minWeeks) || Number.isNaN(maxWeeks)) return false
    return maxWeeks <= 12
  }

  if (!result) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Generator
        </Button>
        
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <span className="font-semibold text-lg">BizPrompt</span>
        </div>
      </div>

      {/* Original Prompt */}
      <Card className="mb-6 bg-muted/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your prompt:</p>
              <p className="text-lg">{result.prompt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Idea */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {result.idea.name}
              </CardTitle>
              <div className="flex items-center gap-2 mb-3">
                {result.idea.category && (
                  <Badge variant="secondary" className="text-sm">
                    {result.idea.category}
                  </Badge>
                )}
                <Badge 
                  className={`text-sm ${getDifficultyColor(result.idea.difficulty)}`}
                  variant="outline"
                >
                  {result.idea.difficulty}
                </Badge>
              </div>
            </div>
          </div>
          <CardDescription className="text-lg leading-relaxed">
            {result.idea.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Monetization */}
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Monetization Strategy</h3>
              <p className="text-muted-foreground">{result.idea.monetization}</p>
            </div>
          </div>

          <Separator />

          {/* Tools Needed */}
          <div className="flex items-start gap-3">
            <Wrench className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold mb-3">Tools & Skills Needed</h3>
              <div className="flex flex-wrap gap-2">
                {result.idea.tools_needed.map((tool, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Time to MVP */}
          {isReasonableMvpTime(result.idea.time_to_mvp) && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Time to MVP</h3>
                <p className="text-muted-foreground">{result.idea.time_to_mvp}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center">
        <Button 
          onClick={handleRegenerate}
          disabled={isRegenerating}
          variant="outline"
          size="lg"
        >
          {isRegenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2" />
              Regenerating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Regenerate
            </>
          )}
        </Button>

        <Button 
          onClick={handleCopy}
          variant="outline"
          size="lg"
        >
          {copied ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copy Idea
            </>
          )}
        </Button>

        <Button 
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          {saved ? (
            <>
              <CheckCircle className="mr-2 h-4 w-4" />
              Saved!
            </>
          ) : isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Idea
            </>
          )}
        </Button>
      </div>

      {/* Generate Another CTA */}
      <Card className="mt-12 text-center bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-3">
            Want to explore more ideas?
          </h3>
          <p className="text-muted-foreground mb-4">
            Generate another business idea with a different prompt or refine your current one.
          </p>
          <Button 
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Generate Another Idea
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 