import React, { useState } from 'react'
import { ArrowLeft, Save, Clock, Tag, Repeat } from 'lucide-react'
import { blink } from '../blink/client'
import { scheduleHabitReminder, requestNotificationPermission } from '../utils/notifications'

type Screen = 'dashboard' | 'add-habit' | 'habit-details' | 'profile' | 'badges' | 'ai-suggestions'

interface AddHabitProps {
  onNavigate: (screen: Screen) => void
}

const AddHabit: React.FC<AddHabitProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    emoji: '🎯',
    category: 'Personal',
    frequency: 'daily',
    reminderTime: '09:00',
    notes: ''
  })
  const [loading, setLoading] = useState(false)

  const categories = [
    'Health', 'Fitness', 'Study', 'Work', 'Personal', 'Social', 'Finance', 'Hobbies'
  ]

  const frequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'weekdays', label: 'Weekdays' },
    { value: 'weekends', label: 'Weekends' },
    { value: 'custom', label: 'Custom' }
  ]

  const popularEmojis = [
    '🎯', '💪', '📚', '🏃‍♂️', '🧘‍♀️', '💧', '🥗', '😴', 
    '📝', '🎨', '🎵', '🌱', '☀️', '🔥', '⭐', '🚀'
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setLoading(true)
    try {
      const user = await blink.auth.me()
      
      await blink.db.habits.create({
        name: formData.name.trim(),
        emoji: formData.emoji,
        category: formData.category,
        frequency: formData.frequency,
        reminderTime: formData.reminderTime,
        notes: formData.notes,
        streak: 0,
        completedToday: "0",
        userId: user.id,
        createdAt: new Date().toISOString()
      })

      // Request notification permission and schedule reminder
      const hasPermission = await requestNotificationPermission()
      if (hasPermission) {
        scheduleHabitReminder(formData.name.trim(), formData.emoji, formData.reminderTime)
      }

      onNavigate('dashboard')
    } catch (error) {
      console.error('Error creating habit:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-20">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => onNavigate('dashboard')}
            className="glass-button p-3"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-white">Create New Habit</h1>
          <div className="w-11" /> {/* Spacer */}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Habit Name */}
          <div className="glass-card p-6">
            <label className="block text-white font-semibold mb-3">
              Habit Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Drink 8 glasses of water"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          {/* Emoji Selection */}
          <div className="glass-card p-6">
            <label className="block text-white font-semibold mb-3">
              Choose an Icon
            </label>
            <div className="grid grid-cols-8 gap-3">
              {popularEmojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, emoji })}
                  className={`emoji-lg p-2 rounded-lg transition-all ${
                    formData.emoji === emoji
                      ? 'bg-purple-500/50 ring-2 ring-purple-400'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="glass-card p-6">
            <label className="block text-white font-semibold mb-3 flex items-center">
              <Tag className="w-5 h-5 mr-2" />
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-gray-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <div className="glass-card p-6">
            <label className="block text-white font-semibold mb-3 flex items-center">
              <Repeat className="w-5 h-5 mr-2" />
              Frequency
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {frequencies.map((freq) => (
                <option key={freq.value} value={freq.value} className="bg-gray-800">
                  {freq.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reminder Time */}
          <div className="glass-card p-6">
            <label className="block text-white font-semibold mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Reminder Time
            </label>
            <input
              type="time"
              value={formData.reminderTime}
              onChange={(e) => setFormData({ ...formData, reminderTime: e.target.value })}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          {/* Notes */}
          <div className="glass-card p-6">
            <label className="block text-white font-semibold mb-3">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any additional notes or motivation..."
              rows={3}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !formData.name.trim()}
            className="w-full glass-button py-4 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Create Habit</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddHabit