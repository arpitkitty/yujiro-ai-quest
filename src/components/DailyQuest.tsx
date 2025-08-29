import { Progress } from "@/components/ui/progress"
import { CheckCircle, Flame } from "lucide-react"
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

  const getTypeIcon = () => {
    switch (type) {
      case 'strength': return '💪'
      case 'intelligence': return '🧠'  
      case 'health': return '❤️'
      default: return '⭐'
    }
  }

  return (
    <div className={cn(
      "p-4 rounded-lg border transition-glow cursor-pointer group card-glass",
      completed 
        ? "border-primary/50 glow-neon bg-primary/5" 
        : "border-border/30 hover:border-primary/30 hover:glow-neon"
    )}>
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-smooth",
          completed 
            ? "bg-primary border-primary text-primary-foreground glow-neon" 
            : "border-muted bg-background/50 group-hover:border-primary/50"
        )}>
          {completed ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <div className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors">
              {getTypeIcon()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className={cn(
              "font-bold text-base tracking-wide",
              completed ? "text-primary" : "text-foreground"
            )}>
              {title}
            </h4>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/20 border border-primary/30 rounded-full">
              <Flame className="w-4 h-4 text-primary" />
              <span className="font-bold text-primary text-sm">+{xpReward}</span>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
            {description}
          </p>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                Progress: {progress}/{maxProgress}
              </span>
              <span className={cn(
                "font-bold",
                completed ? "text-primary" : "text-foreground"
              )}>
                {Math.round(percentage)}%
              </span>
            </div>
            <div className="progress-glow">
              <Progress 
                value={percentage} 
                variant={type}
                className="h-2 bg-muted/30 border border-primary/20"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}