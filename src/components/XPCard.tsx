import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface XPCardProps {
  title: string
  currentXP: number
  maxXP: number
  level: number
  icon: React.ReactNode
  variant: "strength" | "intelligence" | "health"
  className?: string
}

export const XPCard = ({ 
  title, 
  currentXP, 
  maxXP, 
  level, 
  icon, 
  variant,
  className 
}: XPCardProps) => {
  const percentage = (currentXP / maxXP) * 100

  const variantStyles = {
    strength: "border-red-500/30 hover:border-red-500/50",
    intelligence: "border-blue-500/30 hover:border-blue-500/50", 
    health: "border-green-500/30 hover:border-green-500/50"
  }

  return (
    <Card className={cn(
      "p-4 transition-glow hover:glow-fire cursor-pointer",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-2xl">{icon}</div>
          <div>
            <h3 className="font-bold text-sm text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground">Level {level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold gradient-fire bg-clip-text text-transparent">
            {currentXP}
          </p>
          <p className="text-xs text-muted-foreground">/ {maxXP} XP</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="text-foreground font-medium">{Math.round(percentage)}%</span>
        </div>
        <Progress 
          value={percentage} 
          variant={variant}
          className="h-2"
        />
      </div>
    </Card>
  )
}