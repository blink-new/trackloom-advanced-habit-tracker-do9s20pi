import React from 'react'
import { CheckCircle, Circle, Flame, Calendar } from 'lucide-react'

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

interface HabitCardProps {
  habit: Habit
  onToggle: () => void
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggle }) => {
  const isCompleted = Number(habit.completedToday) > 0

  const getCategoryColor = (category: string) => {
    const colors = {
      Health: 'bg-green-500/20 text-green-300',
      Fitness: 'bg-red-500/20 text-red-300',
      Study: 'bg-blue-500/20 text-blue-300',
      Work: 'bg-yellow-500/20 text-yellow-300',
      Personal: 'bg-purple-500/20 text-purple-300',
      Social: 'bg-pink-500/20 text-pink-300',
      default: 'bg-gray-500/20 text-gray-300'
    }
    return colors[category as keyof typeof colors] || colors.default
  }

  return (
    <div className={`glass-card p-4 transition-all duration-300 ${isCompleted ? 'ring-2 ring-green-400/50' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <button
            onClick={onToggle}
            className={`transition-all duration-300 ${
              isCompleted 
                ? 'text-green-400 scale-110' 
                : 'text-gray-400 hover:text-green-400'
            }`}
          >
            {isCompleted ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>

          <div className="emoji-lg">{habit.emoji}</div>

          <div className="flex-1">
            <h3 className={`font-semibold transition-colors ${
              isCompleted ? 'text-green-300 line-through' : 'text-white'
            }`}>
              {habit.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(habit.category)}`}>
                {habit.category}
              </span>
              <span className="text-xs text-gray-400 flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {habit.frequency}
              </span>
            </div>
          </div>
        </div>

        {habit.streak > 0 && (
          <div className="flex items-center space-x-1 text-orange-400">
            <Flame className="w-4 h-4" />
            <span className="text-sm font-semibold">{habit.streak}</span>
          </div>
        )}
      </div>

      {/* Progress bar for visual feedback */}
      <div className="mt-3">
        <div className="w-full bg-gray-700/50 rounded-full h-1">
          <div 
            className={`h-1 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-green-400 w-full' : 'bg-purple-400 w-0'
            }`}
          />
        </div>
      </div>
    </div>
  )
}

export default HabitCard