import React, { useState } from 'react'
import { ChevronRight, Target, TrendingUp, Award } from 'lucide-react'

interface OnboardingScreenProps {
  onComplete: () => void
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      icon: <Target className="w-16 h-16 text-purple-400" />,
      title: "Track Your Habits",
      description: "Build lasting habits with our intuitive tracking system. Set custom frequencies and get personalized reminders."
    },
    {
      icon: <TrendingUp className="w-16 h-16 text-purple-400" />,
      title: "Visualize Progress",
      description: "See your progress with beautiful charts and analytics. Track streaks, completion rates, and personal growth."
    },
    {
      icon: <Award className="w-16 h-16 text-purple-400" />,
      title: "Earn Rewards",
      description: "Level up with XP points, unlock badges, and celebrate milestones. Gamification makes habits fun!"
    }
  ]

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      onComplete()
    }
  }

  const skipOnboarding = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-6">
      <div className="glass-card w-full max-w-md p-8 text-center">
        <div className="mb-8">
          {slides[currentSlide].icon}
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">
          {slides[currentSlide].title}
        </h1>
        
        <p className="text-gray-300 mb-8 leading-relaxed">
          {slides[currentSlide].description}
        </p>

        {/* Progress indicators */}
        <div className="flex justify-center space-x-2 mb-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentSlide ? 'bg-purple-400' : 'bg-gray-600'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={skipOnboarding}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Skip
          </button>
          
          <button
            onClick={nextSlide}
            className="glass-button flex items-center space-x-2 px-6 py-3"
          >
            <span>{currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingScreen