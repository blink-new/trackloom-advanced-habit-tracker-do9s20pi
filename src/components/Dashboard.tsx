import React, { useState, useEffect } from 'react'
import { Plus, Calendar, TrendingUp, Award } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts'
import HabitCard from './HabitCard'
import BottomNav from './BottomNav'
import { blink } from '../blink/client'

interface Habit {
  id: string
  name: string
  emoji: string
  category: string
  frequency: string
  streak: number
  completedToday: string
  createdAt: string
  userId: string
}

interface User {
  id: string
  email: string
  displayName?: string
}

type Screen = 'dashboard' | 'add-habit' | 'habit-details' | 'profile' | 'badges' | 'ai-suggestions'

interface DashboardProps {
  onNavigate: (screen: Screen, habitId?: string) => void
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Mock data for charts
  const weeklyData = [
    { day: 'Mon', completed: 4 },
    { day: 'Tue', completed: 6 },
    { day: 'Wed', completed: 3 },
    { day: 'Thu', completed: 8 },
    { day: 'Fri', completed: 5 },
    { day: 'Sat', completed: 7 },
    { day: 'Sun', completed: 6 }
  ]

  const monthlyData = [
    { week: 'W1', completion: 85 },
    { week: 'W2', completion: 92 },
    { week: 'W3', completion: 78 },
    { week: 'W4', completion: 88 }
  ]

  const loadHabits = async (userId: string) => {
    try {
      const habitsData = await blink.db.habits.list({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' }
      })
      setHabits(habitsData)
    } catch (error) {
      console.error('Error loading habits:', error)
    }
  }

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser({
          id: state.user.id,
          email: state.user.email,
          displayName: state.user.displayName
        })
        loadHabits(state.user.id)
      }
      setLoading(state.isLoading)
    })

    return unsubscribe
  }, [])

  const toggleHabitCompletion = async (habitId: string) => {
    try {
      const habit = habits.find(h => h.id === habitId)
      if (!habit) return

      const isCompleted = Number(habit.completedToday) > 0
      const newCompletionStatus = isCompleted ? "0" : "1"
      const newStreak = isCompleted ? Math.max(0, habit.streak - 1) : habit.streak + 1

      await blink.db.habits.update(habitId, {
        completedToday: newCompletionStatus,
        streak: newStreak
      })

      // Update local state
      setHabits(habits.map(h => 
        h.id === habitId 
          ? { ...h, completedToday: newCompletionStatus, streak: newStreak }
          : h
      ))
    } catch (error) {
      console.error('Error updating habit:', error)
    }
  }



  const motivationalQuotes = [
    "Success is the sum of small efforts repeated day in and day out.",
    "The secret of getting ahead is getting started.",
    "Don't watch the clock; do what it does. Keep going.",
    "The future depends on what you do today."
  ]

  const todayQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading your habits...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-white mb-4">Please sign in to continue</p>
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

  const completedToday = habits.filter(h => Number(h.completedToday) > 0).length
  const totalHabits = habits.length
  const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-20">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user.displayName || user.email.split('@')[0]}!
            </h1>
            <p className="text-gray-300">Keep building great habits!</p>
          </div>
        </div>

        {/* Daily Quote */}
        <div className="glass-card p-4 mb-6">
          <p className="text-purple-200 italic text-center">"{todayQuote}"</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">{completedToday}</div>
            <div className="text-sm text-gray-300">Completed</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">{completionRate}%</div>
            <div className="text-sm text-gray-300">Success Rate</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">
              {Math.max(...habits.map(h => h.streak), 0)}
            </div>
            <div className="text-sm text-gray-300">Best Streak</div>
          </div>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Weekly Progress
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis hide />
                <Bar dataKey="completed" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Monthly Trend
            </h3>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={monthlyData}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                <YAxis hide />
                <Line type="monotone" dataKey="completion" stroke="#A855F7" strokeWidth={3} dot={{ fill: '#A855F7', strokeWidth: 2, r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Today's Habits */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Today's Habits</h2>
            <button 
              className="glass-button p-2"
              onClick={() => onNavigate('add-habit')}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {habits.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Award className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No habits yet!</h3>
              <p className="text-gray-300 mb-4">Start building better habits today</p>
              <button 
                className="glass-button px-6 py-3"
                onClick={() => onNavigate('add-habit')}
              >
                Create Your First Habit
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onToggle={() => toggleHabitCompletion(habit.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav currentScreen="dashboard" onNavigate={onNavigate} />
    </div>
  )
}

export default Dashboard