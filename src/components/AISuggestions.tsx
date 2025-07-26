import React, { useState, useEffect, useCallback } from 'react'
import { Sparkles, Plus, RefreshCw, Target, Brain } from 'lucide-react'
import BottomNav from './BottomNav'
import { blink } from '../blink/client'

type Screen = 'dashboard' | 'add-habit' | 'habit-details' | 'profile' | 'badges' | 'ai-suggestions'

interface AISuggestionsProps {
  onNavigate: (screen: Screen) => void
}

interface Suggestion {
  id: string
  title: string
  description: string
  emoji: string
  category: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  benefits: string[]
}

const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    title: 'Morning Meditation',
    description: 'Start your day with 10 minutes of mindfulness meditation',
    emoji: '🧘‍♀️',
    category: 'Mental Health',
    difficulty: 'Easy',
    benefits: ['Reduces stress', 'Improves focus', 'Better emotional regulation']
  },
  {
    id: '2',
    title: 'Daily Reading',
    description: 'Read for 30 minutes every day to expand your knowledge',
    emoji: '📚',
    category: 'Learning',
    difficulty: 'Easy',
    benefits: ['Expands vocabulary', 'Improves concentration', 'Reduces stress']
  },
  {
    id: '3',
    title: 'Evening Walk',
    description: 'Take a 20-minute walk after dinner for better health',
    emoji: '🚶‍♂️',
    category: 'Fitness',
    difficulty: 'Easy',
    benefits: ['Improves cardiovascular health', 'Better sleep', 'Mood boost']
  },
  {
    id: '4',
    title: 'Gratitude Journal',
    description: 'Write down 3 things you\'re grateful for each day',
    emoji: '📝',
    category: 'Mental Health',
    difficulty: 'Easy',
    benefits: ['Increases happiness', 'Better relationships', 'Improved sleep']
  },
  {
    id: '5',
    title: 'Learn New Language',
    description: 'Practice a new language for 15 minutes daily',
    emoji: '🌍',
    category: 'Learning',
    difficulty: 'Medium',
    benefits: ['Cognitive benefits', 'Career opportunities', 'Cultural understanding']
  },
  {
    id: '6',
    title: 'Cold Shower',
    description: 'End your shower with 30 seconds of cold water',
    emoji: '🚿',
    category: 'Health',
    difficulty: 'Hard',
    benefits: ['Boosts immunity', 'Increases alertness', 'Improves circulation']
  }
]

const AISuggestions: React.FC<AISuggestionsProps> = ({ onNavigate }) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [userGoals, setUserGoals] = useState('')

  const loadSuggestions = useCallback(async () => {
    try {
      // Load default suggestions
      setSuggestions(mockSuggestions)
    } catch (error) {
      console.error('Error loading suggestions:', error)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser(state.user)
        loadSuggestions()
      }
    })

    return unsubscribe
  }, [loadSuggestions])

  const generateAISuggestions = async () => {
    if (!userGoals.trim()) return

    setLoading(true)
    try {
      const { object } = await blink.ai.generateObject({
        prompt: `Based on the user goal: "${userGoals}", suggest 3 specific, actionable daily habits that would help achieve this goal.`,
        schema: {
          type: 'object',
          properties: {
            suggestions: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  emoji: { type: 'string' },
                  category: { type: 'string' },
                  difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] },
                  benefits: {
                    type: 'array',
                    items: { type: 'string' },
                    minItems: 3,
                    maxItems: 3
                  }
                },
                required: ['title', 'description', 'emoji', 'category', 'difficulty', 'benefits']
              }
            }
          },
          required: ['suggestions']
        }
      })

      const formattedSuggestions = object.suggestions.map((suggestion: any, index: number) => ({
        id: `ai-${Date.now()}-${index}`,
        ...suggestion
      }))
      
      setSuggestions([...formattedSuggestions, ...mockSuggestions])
    } catch (error) {
      console.error('Error generating AI suggestions:', error)
      // Fallback to mock suggestions
      setSuggestions(mockSuggestions)
    } finally {
      setLoading(false)
    }
  }

  const addHabitFromSuggestion = async (suggestion: Suggestion) => {
    try {
      if (!user) return

      await blink.db.habits.create({
        name: suggestion.title,
        emoji: suggestion.emoji,
        category: suggestion.category,
        frequency: 'daily',
        reminderTime: '09:00',
        notes: suggestion.description,
        streak: 0,
        completedToday: "0",
        userId: user.id,
        createdAt: new Date().toISOString()
      })

      // Show success feedback and navigate to dashboard
      alert(`Added "${suggestion.title}" to your habits!`)
      // Optionally navigate back to dashboard to see the new habit
      // onNavigate('dashboard')
    } catch (error) {
      console.error('Error adding habit:', error)
      alert('Failed to add habit. Please try again.')
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400 bg-green-500/20'
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20'
      case 'Hard': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-white mb-4">Please sign in to get AI suggestions</p>
          <button
            onClick={() => blink.auth.login()}
            className="glass-button px-6 py-3"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
            <Sparkles className="w-6 h-6 mr-2" />
            AI Suggestions
          </h1>
          <p className="text-gray-300">
            Personalized habit recommendations powered by AI
          </p>
        </div>

        {/* Goal Input */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            What's your goal?
          </h3>
          <div className="space-y-4">
            <textarea
              value={userGoals}
              onChange={(e) => setUserGoals(e.target.value)}
              placeholder="e.g., I want to improve my physical fitness and mental health..."
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
            <button
              onClick={generateAISuggestions}
              disabled={loading || !userGoals.trim()}
              className="w-full glass-button py-3 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  <span>Generating suggestions...</span>
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5" />
                  <span>Get AI Suggestions</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Recommended Habits</h2>
          <button
            onClick={() => loadSuggestions()}
            className="glass-button p-3"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions Grid */}
        <div className="space-y-4">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="glass-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{suggestion.emoji}</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {suggestion.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {suggestion.category}
                    </p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(suggestion.difficulty)}`}>
                  {suggestion.difficulty}
                </span>
              </div>

              <p className="text-gray-300 mb-4 leading-relaxed">
                {suggestion.description}
              </p>

              <div className="mb-4">
                <h4 className="text-white font-semibold text-sm mb-2">Benefits:</h4>
                <div className="space-y-1">
                  {suggestion.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                      <span className="text-gray-300 text-sm">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => addHabitFromSuggestion(suggestion)}
                className="w-full glass-button py-3 flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add to My Habits</span>
              </button>
            </div>
          ))}
        </div>

        {suggestions.length === 0 && (
          <div className="glass-card p-8 text-center">
            <Sparkles className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No suggestions yet</h3>
            <p className="text-gray-300 mb-4">
              Enter your goals above to get personalized AI recommendations
            </p>
          </div>
        )}
      </div>

      <BottomNav currentScreen="ai-suggestions" onNavigate={onNavigate} />
    </div>
  )
}

export default AISuggestions