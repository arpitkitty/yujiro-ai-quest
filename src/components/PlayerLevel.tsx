import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Crown, Flame } from "lucide-react"

interface PlayerLevelProps {
  level: number
  currentXP: number
  maxXP: number
  playerName: string
}

export const PlayerLevel = ({ level, currentXP, maxXP, playerName }: PlayerLevelProps) => {
  const percentage = (currentXP / maxXP) * 100

  return (
    <Card className="p-6 card-glass border-primary/30 transition-glow hover:glow-neon level-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-neon border-2 border-primary/50 glow-neon">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background border-2 border-primary/50 rounded-full px-2 py-1">
              <span className="text-xs font-bold text-primary">{level}</span>
            </div>
          </div>
          <div>
            <h2 className="font-bold text-2xl text-foreground tracking-wide">{playerName}</h2>
            <p className="text-muted-foreground text-sm font-medium">Warrior Level {level}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-2 text-primary font-bold">
            <Flame className="w-5 h-5" />
            <span className="text-2xl">{currentXP}</span>
          </div>
          <p className="text-muted-foreground text-sm font-medium">/ {maxXP} XP</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground font-medium">Progress to Level {level + 1}</span>
          <span className="text-foreground font-bold">{Math.round(percentage)}%</span>
        </div>
        <div className="progress-glow">
          <Progress 
            value={percentage} 
            variant="fire"
            size="lg"
            className="bg-muted/30 border border-primary/20"
          />
        </div>
      </div>
    </Card>
  )
}