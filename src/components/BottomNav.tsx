import React from 'react';
import { Home, Plus, Trophy, User, Sparkles } from 'lucide-react';

type Screen = 'dashboard' | 'add-habit' | 'badges' | 'ai-suggestions' | 'profile';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    {
      id: 'dashboard' as Screen,
      icon: Home,
      label: 'Home'
    },
    {
      id: 'ai-suggestions' as Screen,
      icon: Sparkles,
      label: 'AI'
    },
    {
      id: 'add-habit' as Screen,
      icon: Plus,
      label: 'Add',
      isCenter: true
    },
    {
      id: 'badges' as Screen,
      icon: Trophy,
      label: 'Badges'
    },
    {
      id: 'profile' as Screen,
      icon: User,
      label: 'Profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-card mx-4 mb-4 rounded-2xl p-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            const isCenter = item.isCenter;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 ${
                  isCenter
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white scale-110 shadow-lg'
                    : isActive
                    ? 'bg-white/20 text-white'
                    : 'text-purple-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isCenter ? 'w-6 h-6' : ''}`} />
                <span className={`text-xs mt-1 ${isCenter ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;