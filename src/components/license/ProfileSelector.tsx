import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Star, User } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLicense } from './LicenseProvider';

interface ProfileOption {
  id: string;
  name: string;
  avatar: string;
  type: 'owner' | 'premium' | 'free';
  level: number;
  xp: number;
}

const mockProfiles: ProfileOption[] = [
  {
    id: 'owner',
    name: 'Master Yujiro',
    avatar: '👑',
    type: 'owner',
    level: 99,
    xp: 999999
  },
  {
    id: 'premium',
    name: 'Elite Warrior',
    avatar: '⚡',
    type: 'premium',
    level: 45,
    xp: 48500
  },
  {
    id: 'free',
    name: 'Apprentice',
    avatar: '🥋',
    type: 'free',
    level: 12,
    xp: 2840
  }
];

interface ProfileSelectorProps {
  onSelectProfile: (profile: ProfileOption) => void;
}

export function ProfileSelector({ onSelectProfile }: ProfileSelectorProps) {
  const { isOwner, hasFeature } = useLicense();

  const getAvailableProfiles = () => {
    if (isOwner) return mockProfiles;
    if (hasFeature('premium')) return mockProfiles.filter(p => p.type !== 'owner');
    return mockProfiles.filter(p => p.type === 'free');
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'owner': return 'default';
      case 'premium': return 'secondary';
      default: return 'outline';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'owner': return <Crown className="w-4 h-4" />;
      case 'premium': return <Star className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-gradient mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Choose Your Fighter
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Select your warrior profile to begin your journey
          </motion.p>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {getAvailableProfiles().map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={`p-8 card-glass cursor-pointer transition-all duration-300 hover:glow-neon ${
                  profile.type === 'owner' ? 'border-primary glow-neon' : 
                  profile.type === 'premium' ? 'border-secondary' : 'border-border'
                }`}
                onClick={() => onSelectProfile(profile)}
              >
                {/* Avatar */}
                <div className="text-center mb-6">
                  <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center text-4xl mb-4 ${
                    profile.type === 'owner' ? 'bg-primary/20 border-2 border-primary' :
                    profile.type === 'premium' ? 'bg-secondary/20 border-2 border-secondary' :
                    'bg-muted border-2 border-border'
                  }`}>
                    {profile.avatar}
                  </div>
                  
                  {/* Type Badge */}
                  <Badge 
                    variant={getBadgeVariant(profile.type)}
                    className="mb-2"
                  >
                    {getTypeIcon(profile.type)}
                    {profile.type.toUpperCase()}
                  </Badge>
                </div>

                {/* Profile Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-2">{profile.name}</h3>
                  <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>Level {profile.level}</span>
                    <span>{profile.xp.toLocaleString()} XP</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-muted rounded-full h-2 mb-4 overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${
                        profile.type === 'owner' ? 'gradient-neon' :
                        profile.type === 'premium' ? 'bg-secondary' :
                        'bg-primary'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((profile.xp % 1000) / 10, 100)}%` }}
                      transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                    />
                  </div>

                  {/* Features */}
                  <div className="text-xs text-muted-foreground">
                    {profile.type === 'owner' && 'Unlimited Access • All Features'}
                    {profile.type === 'premium' && 'Premium Features • AI Coach'}
                    {profile.type === 'free' && 'Basic Tracking • Limited Features'}
                  </div>
                </div>

                {/* Special Effects for Owner */}
                {profile.type === 'owner' && (
                  <motion.div
                    className="absolute inset-0 rounded-lg pointer-events-none"
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(255, 0, 0, 0.3)',
                        '0 0 40px rgba(255, 0, 0, 0.5)',
                        '0 0 20px rgba(255, 0, 0, 0.3)'
                      ]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="text-center mt-12 text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p>Your progress syncs across all profiles • Switch anytime</p>
        </motion.div>
      </div>
    </div>
  );
}