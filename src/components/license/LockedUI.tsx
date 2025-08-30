import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Zap, Crown } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LicenseUploadModal } from './LicenseUploadModal';

const lockedFeatures = [
  {
    title: '⚡ Boss Mode',
    description: 'Epic daily challenges with anime-style battles',
    icon: <Zap className="w-6 h-6" />,
    tier: 'premium'
  },
  {
    title: '📊 Pro Analytics',
    description: 'Deep insights into your warrior journey',
    icon: <Star className="w-6 h-6" />,
    tier: 'premium'
  },
  {
    title: '🤖 AI Coach Squad',
    description: 'Multiple AI personalities to motivate you',
    icon: <Crown className="w-6 h-6" />,
    tier: 'owner'
  }
];

export function LockedUI() {
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="p-4 rounded-full bg-primary/10 border border-primary/30 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Lock className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gradient mb-4">
            Unlock Your Potential
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Enter your license to access premium Yujiro Mode features
          </p>
          
          <Button 
            size="lg" 
            onClick={() => setShowUploadModal(true)}
            className="mr-4"
          >
            <Lock className="w-5 h-5 mr-2" />
            Unlock Now
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </motion.div>

        {/* Locked Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {lockedFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 card-glass relative overflow-hidden opacity-60">
                <div className="absolute inset-0 bg-gradient-to-br from-background/50 to-background/80 backdrop-blur-sm" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    {feature.icon}
                    <Badge variant={feature.tier === 'owner' ? 'default' : 'secondary'}>
                      <Lock className="w-3 h-3 mr-1" />
                      {feature.tier.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <LicenseUploadModal 
        open={showUploadModal} 
        onOpenChange={setShowUploadModal} 
      />
    </div>
  );
}