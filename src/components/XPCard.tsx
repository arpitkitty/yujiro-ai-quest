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

  const getVariantColor = () => {
    switch (variant) {
      case 'strength': return 'text-red-400'
      case 'intelligence': return 'text-blue-400'
      case 'health': return 'text-green-400'
      default: return 'text-primary'
    }
  }

  return (
    <Card className={cn(
      "p-5 card-glass transition-glow hover:glow-neon cursor-pointer group",
      variantStyles[variant],
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-3 rounded-lg border transition-smooth",
            variant === 'strength' && "bg-red-500/20 border-red-500/30",
            variant === 'intelligence' && "bg-blue-500/20 border-blue-500/30",
            variant === 'health' && "bg-green-500/20 border-green-500/30"
          )}>
            <div className={getVariantColor()}>{icon}</div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-foreground tracking-wide">{title}</h3>
            <p className="text-sm text-muted-foreground font-medium">Level {level}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gradient">
            {currentXP}
          </p>
          <p className="text-sm text-muted-foreground font-medium">/ {maxXP} XP</p>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground font-medium">Progress</span>
          <span className="text-foreground font-bold">{Math.round(percentage)}%</span>
        </div>
        <div className="progress-glow">
          <Progress 
            value={percentage} 
            variant={variant}
            className="h-3 bg-muted/30 border border-primary/20"
          />
        </div>
      </div>
    </Card>
  )
}