import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import OnboardingScreen from './components/OnboardingScreen'
import Dashboard from './components/Dashboard'
import AddHabit from './components/AddHabit'
import HabitDetails from './components/HabitDetails'
import Profile from './components/Profile'
import Badges from './components/Badges'
import AISuggestions from './components/AISuggestions'

type Screen = 'onboarding' | 'dashboard' | 'add-habit' | 'habit-details' | 'profile' | 'badges' | 'ai-suggestions'

interface User {
  id: string
  email: string
  displayName?: string
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding')
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null)
  const [showOnboarding, setShowOnboarding] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
      
      if (state.user && showOnboarding) {
        // Check if user has seen onboarding
        const hasSeenOnboarding = localStorage.getItem('trackloom-onboarding-seen')
        if (hasSeenOnboarding) {
          setShowOnboarding(false)
          setCurrentScreen('dashboard')
        }
      }
    })
    return unsubscribe
  }, [showOnboarding])

  const handleOnboardingComplete = () => {
    localStorage.setItem('trackloom-onboarding-seen', 'true')
    setShowOnboarding(false)
    setCurrentScreen('dashboard')
  }

  const navigateToScreen = (screen: Screen, habitId?: string) => {
    setCurrentScreen(screen)
    if (habitId) {
      setSelectedHabitId(habitId)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass rounded-2xl p-8 animate-pulse">
          <div className="w-16 h-16 bg-gradient-primary rounded-full mx-auto mb-4 animate-pulse-glow"></div>
          <div className="text-white text-center">Loading TrackLoom...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-6 flex items-center justify-center animate-float">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">TrackLoom</h1>
          <p className="text-gray-300 mb-8">Build better habits, track your progress</p>
          <button
            onClick={() => blink.auth.login()}
            className="w-full bg-gradient-primary text-white py-3 px-6 rounded-xl font-medium hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </div>
      </div>
    )
  }

  if (showOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={navigateToScreen} />
      case 'add-habit':
        return <AddHabit onNavigate={navigateToScreen} />
      case 'habit-details':
        return <HabitDetails habitId={selectedHabitId} onNavigate={navigateToScreen} />
      case 'profile':
        return <Profile onNavigate={navigateToScreen} />
      case 'badges':
        return <Badges onNavigate={navigateToScreen} />
      case 'ai-suggestions':
        return <AISuggestions onNavigate={navigateToScreen} />
      default:
        return <Dashboard onNavigate={navigateToScreen} />
    }
  }

  return (
    <div className="min-h-screen">
      {renderScreen()}
    </div>
  )
}

export default App