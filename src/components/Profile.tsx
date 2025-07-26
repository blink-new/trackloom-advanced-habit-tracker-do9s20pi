import React, { useState, useEffect } from 'react'
import { User, Settings, Bell, LogOut, Star } from 'lucide-react'
import BottomNav from './BottomNav'
import { blink } from '../blink/client'

type Screen = 'dashboard' | 'add-habit' | 'habit-details' | 'profile' | 'badges' | 'ai-suggestions'

interface ProfileProps {
  onNavigate: (screen: Screen) => void
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<any>(null)
  const [notifications, setNotifications] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      if (state.user) {
        setUser({
          ...state.user,
          totalHabits: 8,
          completedToday: 6,
          longestStreak: 23
        })
      }
      setLoading(state.isLoading)
    })

    return unsubscribe
  }, [])



  const handleLogout = () => {
    blink.auth.logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
          <p className="text-white mt-4 text-center">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <p className="text-white mb-4">Please sign in to view your profile</p>
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
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
        </div>

        {/* User Info Card */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {user.displayName || user.email.split('@')[0]}
              </h2>
              <p className="text-gray-300">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-white">{user.totalHabits}</div>
            <div className="text-sm text-gray-300">Total Habits</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{user.completedToday}</div>
            <div className="text-sm text-gray-300">Completed Today</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-2xl font-bold text-orange-400">{user.longestStreak}</div>
            <div className="text-sm text-gray-300">Longest Streak</div>
          </div>
        </div>

        {/* Achievements Preview */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            Recent Achievements
          </h3>
          <div className="flex space-x-3">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">🔥</span>
              </div>
              <p className="text-xs text-gray-300">7-Day Streak</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">💪</span>
              </div>
              <p className="text-xs text-gray-300">Fitness Master</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                <span className="text-2xl">🌱</span>
              </div>
              <p className="text-xs text-gray-300">Habit Builder</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="glass-card p-6 mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Settings
          </h3>
          
          <div className="space-y-4">
            {/* Notifications Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="w-5 h-5 text-gray-300" />
                <span className="text-white">Notifications</span>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-purple-500' : 'bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  notifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full glass-card p-4 flex items-center justify-center space-x-2 text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>

      <BottomNav currentScreen="profile" onNavigate={onNavigate} />
    </div>
  )
}

export default Profile