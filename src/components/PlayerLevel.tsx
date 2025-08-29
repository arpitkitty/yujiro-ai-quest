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
    <Card className="p-6 gradient-fire glow-fire pulse-glow border-primary/50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background/20 border-2 border-primary/50">
            <Crown className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-white">{playerName}</h2>
            <p className="text-white/80 text-sm">Warrior Level {level}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center gap-1 text-white font-bold">
            <Flame className="w-4 h-4" />
            <span className="text-lg">{currentXP}</span>
          </div>
          <p className="text-white/80 text-xs">/ {maxXP} XP</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-white/90">
          <span>Progress to Level {level + 1}</span>
          <span className="font-medium">{Math.round(percentage)}%</span>
        </div>
        <Progress 
          value={percentage} 
          variant="fire"
          size="lg"
          className="bg-background/20"
        />
      </div>
    </Card>
  )
}