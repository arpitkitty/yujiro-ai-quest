import React from 'react';
import { motion } from 'framer-motion';
import { User, Crown, Zap, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface HunterCardProps {
  name: string;
  title: string;
  level: number;
  rank: string;
  aura: number;
  currentXP: number;
  maxXP: number;
}

const rankColors = {
  Bronze: "text-orange-500 border-orange-500/30 bg-orange-500/10",
  Silver: "text-slate-400 border-slate-400/30 bg-slate-400/10", 
  Gold: "text-yellow-500 border-yellow-500/30 bg-yellow-500/10",
  Diamond: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
  Master: "text-purple-500 border-purple-500/30 bg-purple-500/10"
};

export function HunterCard({ name, title, level, rank, aura, currentXP, maxXP }: HunterCardProps) {
  const xpPercentage = (currentXP / maxXP) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full"
    >
      <Card className="p-6 card-glass h-full relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        
        {/* Avatar Section */}
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                {level}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-lg text-foreground">{name}</h3>
                <Crown className="w-4 h-4 text-yellow-500" />
              </div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <Badge 
                variant="outline" 
                className={`mt-1 ${rankColors[rank as keyof typeof rankColors] || rankColors.Bronze}`}
              >
                {rank} Rank
              </Badge>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Aura</span>
              </div>
              <div className="text-2xl font-bold text-primary">{aura}</div>
            </div>
            
            <div className="text-center p-3 rounded-lg bg-secondary/10 border border-secondary/20">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Star className="w-4 h-4 text-secondary" />
                <span className="text-xs text-muted-foreground">Level</span>
              </div>
              <div className="text-2xl font-bold text-secondary">{level}</div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">XP Progress</span>
              <span className="text-foreground font-medium">{currentXP} / {maxXP}</span>
            </div>
            <Progress value={xpPercentage} className="h-2" />
            <div className="text-xs text-center text-muted-foreground">
              {maxXP - currentXP} XP until Level {level + 1}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}