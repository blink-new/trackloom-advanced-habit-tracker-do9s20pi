// Simple notification utility for habit reminders
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'granted') {
    return true
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  return false
}

export const showNotification = (title: string, options?: NotificationOptions) => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      ...options
    })
  }
}

export const scheduleHabitReminder = (habitName: string, emoji: string, reminderTime: string) => {
  const now = new Date()
  const [hours, minutes] = reminderTime.split(':').map(Number)
  
  const reminderDate = new Date()
  reminderDate.setHours(hours, minutes, 0, 0)
  
  // If the time has passed today, schedule for tomorrow
  if (reminderDate <= now) {
    reminderDate.setDate(reminderDate.getDate() + 1)
  }
  
  const timeUntilReminder = reminderDate.getTime() - now.getTime()
  
  setTimeout(() => {
    showNotification(`${emoji} Time for your habit!`, {
      body: `Don't forget to complete: ${habitName}`,
      tag: `habit-${habitName}`,
      requireInteraction: true
    })
  }, timeUntilReminder)
  
  return reminderDate
}