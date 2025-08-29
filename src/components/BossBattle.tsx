import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skull, Swords, Target } from "lucide-react"

interface BossBattleProps {
  bossName: string
  bossLevel: number
  completedQuests: number
  totalQuests: number
  canBattle: boolean
}

export const BossBattle = ({ 
  bossName, 
  bossLevel, 
  completedQuests, 
  totalQuests, 
  canBattle 
}: BossBattleProps) => {
  const progress = (completedQuests / totalQuests) * 100

  return (
    <Card className="p-6 border-destructive/30 hover:border-destructive/50 transition-glow">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/20 border-2 border-destructive/50">
          <Skull className="w-6 h-6 text-destructive" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-foreground">{bossName}</h3>
          <p className="text-muted-foreground text-sm">Level {bossLevel} Boss</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Target className="w-4 h-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Complete daily quests to unlock battle
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Quests: {completedQuests}/{totalQuests}
            </span>
            <span className="text-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress 
            value={progress} 
            variant="fire"
            className="h-2"
          />
        </div>

        <Button 
          disabled={!canBattle}
          className={canBattle ? "gradient-fire glow-fire hover:scale-105 transition-all" : ""}
          size="sm"
        >
          <Swords className="w-4 h-4 mr-2" />
          {canBattle ? "Battle Boss!" : "Complete Quests"}
        </Button>
      </div>
    </Card>
  )
}