import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Check, Flame } from "lucide-react"
import { cn } from "@/lib/utils"

interface DailyQuestProps {
  title: string
  description: string
  progress: number
  maxProgress: number
  xpReward: number
  completed?: boolean
  type: "strength" | "intelligence" | "health"
}

export const DailyQuest = ({
  title,
  description,
  progress,
  maxProgress,
  xpReward,
  completed = false,
  type
}: DailyQuestProps) => {
  const percentage = (progress / maxProgress) * 100

  const typeColors = {
    strength: "bg-red-500/20 text-red-400 border-red-500/30",
    intelligence: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    health: "bg-green-500/20 text-green-400 border-green-500/30"
  }

  return (
    <Card className={cn(
      "p-4 transition-glow",
      completed ? "border-primary/50 glow-fire" : "hover:border-primary/30"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm">{title}</h4>
            {completed && (
              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 border border-primary/50">
                <Check className="w-3 h-3 text-primary" />
              </div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">{description}</p>
        </div>
        
        <Badge variant="outline" className={cn("ml-2", typeColors[type])}>
          <Flame className="w-3 h-3 mr-1" />
          {xpReward} XP
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">
            Progress: {progress}/{maxProgress}
          </span>
          <span className="text-foreground font-medium">
            {Math.round(percentage)}%
          </span>
        </div>
        <Progress 
          value={percentage} 
          variant={completed ? "fire" : type}
          className="h-2"
        />
      </div>
    </Card>
  )
}