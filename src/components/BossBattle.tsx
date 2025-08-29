import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Skull, Swords, Target } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <Card className="p-6 card-glass border-destructive/30 transition-glow hover:glow-neon group">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/20 border-2 border-destructive/50 glow-purple">
            <Skull className="w-8 h-8 text-destructive" />
          </div>
          <div className="absolute -top-1 -right-1 bg-destructive/20 border border-destructive/50 rounded-full px-2 py-1">
            <span className="text-xs font-bold text-destructive">{bossLevel}</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-xl text-foreground tracking-wide">{bossName}</h3>
          <p className="text-muted-foreground text-sm font-medium">Level {bossLevel} Boss</p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/30">
          <Target className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground font-medium">
            Complete daily quests to unlock battle
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground font-medium">
              Quest Progress: {completedQuests}/{totalQuests}
            </span>
            <span className="text-foreground font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="progress-glow">
            <Progress 
              value={progress} 
              variant="fire"
              className="h-3 bg-muted/30 border border-destructive/20"
            />
          </div>
        </div>

        <Button 
          disabled={!canBattle}
          className={cn(
            "w-full font-bold text-base py-6 transition-smooth",
            canBattle 
              ? "gradient-neon glow-neon hover:scale-105 text-white" 
              : "bg-muted/30 text-muted-foreground border-muted/50"
          )}
        >
          <Swords className="w-5 h-5 mr-3" />
          {canBattle ? "BATTLE BOSS!" : "Complete Quests First"}
        </Button>
      </div>
    </Card>
  )
}