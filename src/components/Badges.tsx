import React, { useState, useEffect, useCallback } from 'react'
import { Award, Star } from 'lucide-react'
import BottomNav from './BottomNav'
import { blink } from '../blink/client'

type Screen = 'dashboard' | 'add-habit' | 'habit-details' | 'profile' | 'badges' | 'ai-suggestions'

interface BadgesProps {
  onNavigate: (screen: Screen) => void
}

interface Badge {
  id: string
  name: string
  description: string
  emoji: string
  unlocked: boolean
  progress: number
  requirement: number
  category: string
}

const mockBadges: Badge[] = [
    {
      id: '1',
      name: 'First Steps',
      description: 'Complete your first habit',
      emoji: '👶',
      unlocked: true,
      progress: 1,
      requirement: 1,
      category: 'Milestones'
    },
    {
      id: '2',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      emoji: '🔥',
      unlocked: true,
      progress: 7,
      requirement: 7,
      category: 'Streaks'
    },
    {
      id: '3',
      name: 'Habit Builder',
      description: 'Create 5 different habits',
      emoji: '🏗️',
      unlocked: true,
      progress: 5,
      requirement: 5,
      category: 'Milestones'
    },
    {
      id: '4',
      name: 'Perfect Day',
      description: 'Complete all habits in a day',
      emoji: '⭐',
      unlocked: false,
      progress: 6,
      requirement: 8,
      category: 'Completion'
    }
  ]

const Badges: React.FC<BadgesProps> = ({ onNavigate }) => {
  const [badges, setBadges] = useState<Badge[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', 'Streaks', 'Completion', 'Milestones']

  const loadBadges = useCallback(async () => {
    try {
      // In a real app, you'd fetch user's badge progress from the database
      setBadges(mockBadges)
    } catch (error) {
      console.error('Error loading badges:', error)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser(state.user)
        loadBadges()
      }
      setLoading(state.isLoading)
    })

    return unsubscribe
  }, [loadBadges])

  const filteredBadges = selectedCategory === 'All' 
    ? badges 
    : badges.filter(badge => badge.category === selectedCategory)

  const unlockedCount = badges.filter(badge => badge.unlocked).length
  const totalBadges = badges.length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading badges...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-white mb-4">Please sign in to view your badges</p>
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
          <h1 className="text-2xl font-bold text-white mb-2">Achievements</h1>
          <p className="text-gray-300">
            {unlockedCount} of {totalBadges} badges unlocked
          </p>
        </div>

        {/* Progress Overview */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-yellow-400" />
              <span className="text-white font-semibold">Badge Progress</span>
            </div>
            <span className="text-purple-300 font-bold">
              {Math.round((unlockedCount / totalBadges) * 100)}%
            </span>
          </div>
          
          <div className="w-full bg-gray-700/50 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-400 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / totalBadges) * 100}%` }}
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`glass-card p-4 text-center transition-all ${
                badge.unlocked 
                  ? 'ring-2 ring-yellow-400/50 bg-yellow-500/5' 
                  : 'opacity-75'
              }`}
            >
              <div className="relative mb-3">
                <div className={`text-4xl mb-2 ${badge.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {badge.emoji}
                </div>
                {badge.unlocked && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <Star className="w-3 h-3 text-yellow-900" />
                  </div>
                )}
              </div>

              <h3 className={`font-semibold mb-2 ${
                badge.unlocked ? 'text-white' : 'text-gray-400'
              }`}>
                {badge.name}
              </h3>

              <p className="text-xs text-gray-300 mb-3 leading-relaxed">
                {badge.description}
              </p>

              {!badge.unlocked && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{badge.progress}</span>
                    <span>{badge.requirement}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-1">
                    <div 
                      className="bg-purple-400 h-1 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((badge.progress / badge.requirement) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {badge.unlocked && (
                <div className="text-xs text-yellow-400 font-semibold">
                  ✨ Unlocked!
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Motivational Message */}
        {unlockedCount < totalBadges && (
          <div className="glass-card p-6 mt-6 text-center">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold mb-2">Keep Going!</h3>
            <p className="text-gray-300 text-sm">
              You're doing great! Complete more habits to unlock new badges and show off your achievements.
            </p>
          </div>
        )}
      </div>

      <BottomNav currentScreen="badges" onNavigate={onNavigate} />
    </div>
  )
}

export default Badges