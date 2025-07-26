import React, { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Calendar, TrendingUp, Target, Edit, Trash2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { blink } from '../blink/client'

type Screen = 'dashboard' | 'add-habit' | 'habit-details' | 'profile' | 'badges' | 'ai-suggestions'

interface HabitDetailsProps {
  habitId: string | null
  onNavigate: (screen: Screen) => void
}

const HabitDetails: React.FC<HabitDetailsProps> = ({ habitId, onNavigate }) => {
  const [habit, setHabit] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Mock analytics data
  const weeklyProgress = [
    { day: 'Mon', completed: 1 },
    { day: 'Tue', completed: 1 },
    { day: 'Wed', completed: 0 },
    { day: 'Thu', completed: 1 },
    { day: 'Fri', completed: 1 },
    { day: 'Sat', completed: 1 },
    { day: 'Sun', completed: 0 }
  ]

  const monthlyTrend = [
    { week: 'W1', rate: 85 },
    { week: 'W2', rate: 92 },
    { week: 'W3', rate: 78 },
    { week: 'W4', rate: 88 }
  ]

  const loadHabitDetails = useCallback(async () => {
    if (!habitId) {
      setLoading(false)
      return
    }
    
    try {
      // In a real app, you'd fetch the specific habit by ID
      // For now, we'll create mock data
      setHabit({
        id: habitId,
        name: 'Drink Water',
        emoji: '💧',
        category: 'Health',
        frequency: 'daily',
        streak: 12,
        completed_today: "1",
        created_at: '2024-01-01',
        total_completions: 45,
        success_rate: 85,
        best_streak: 15
      })
    } catch (error) {
      console.error('Error loading habit details:', error)
    } finally {
      setLoading(false)
    }
  }, [habitId])

  useEffect(() => {
    loadHabitDetails()
  }, [loadHabitDetails])

  const deleteHabit = async () => {
    if (!confirm('Are you sure you want to delete this habit?')) return
    
    try {
      if (habitId) {
        await blink.db.habits.delete(habitId)
      }
      onNavigate('dashboard')
    } catch (error) {
      console.error('Error deleting habit:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading habit details...</p>
        </div>
      </div>
    )
  }

  if (!habit) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-white mb-4">Habit not found</p>
          <button onClick={() => onNavigate('dashboard')} className="glass-button px-6 py-3">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('dashboard')} className="glass-button p-3">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">Habit Details</h1>
          <div className="flex space-x-2">
            <button className="glass-button p-3">
              <Edit className="w-5 h-5" />
            </button>
            <button onClick={deleteHabit} className="glass-button p-3 text-red-400">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Habit Overview */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-4xl">{habit.emoji}</div>
            <div>
              <h2 className="text-2xl font-bold text-white">{habit.name}</h2>
              <p className="text-gray-300 capitalize">{habit.category} • {habit.frequency}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{habit.streak}</div>
              <div className="text-sm text-gray-300">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{habit.success_rate}%</div>
              <div className="text-sm text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{habit.total_completions}</div>
            <div className="text-xs text-gray-300">Total</div>
          </div>
          <div className="glass-card p-4 text-center">
            <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">{habit.best_streak}</div>
            <div className="text-xs text-gray-300">Best Streak</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Calendar className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {Math.floor((Date.now() - new Date(habit.created_at).getTime()) / (1000 * 60 * 60 * 24))}
            </div>
            <div className="text-xs text-gray-300">Days Active</div>
          </div>
        </div>

        {/* Weekly Progress Chart */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            This Week's Progress
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyProgress}>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              />
              <YAxis hide />
              <Bar 
                dataKey="completed" 
                fill="#8B5CF6" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Trend */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2" />
            Monthly Success Rate
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <XAxis 
                dataKey="week" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#9CA3AF', fontSize: 12 }} 
              />
              <YAxis hide />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#A855F7" 
                strokeWidth={3} 
                dot={{ fill: '#A855F7', strokeWidth: 2, r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="glass-card p-6">
          <h3 className="text-white font-semibold mb-4">Insights</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <p className="text-gray-300 text-sm">
                You're on a {habit.streak}-day streak! Keep it up!
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <p className="text-gray-300 text-sm">
                Your success rate has improved by 12% this month
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <p className="text-gray-300 text-sm">
                Best performance days: Monday, Tuesday, Friday
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HabitDetails