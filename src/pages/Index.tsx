import { XPCard } from "@/components/XPCard"
import { DailyQuest } from "@/components/DailyQuest"
import { PlayerLevel } from "@/components/PlayerLevel"
import { BossBattle } from "@/components/BossBattle"
import { Card } from "@/components/ui/card"
import { Dumbbell, Brain, Heart, Target, Calendar } from "lucide-react"

const Index = () => {
  // Mock data - this would come from your Supabase backend
  const playerData = {
    name: "Yujiro Warrior",
    level: 12,
    currentXP: 2840,
    maxXP: 3000,
    stats: {
      strength: { current: 450, max: 500, level: 8 },
      intelligence: { current: 320, max: 400, level: 6 },
      health: { current: 180, max: 300, level: 4 }
    }
  }

  const dailyQuests = [
    {
      title: "Morning Workout",
      description: "Complete 20 push-ups and 30 squats",
      progress: 1,
      maxProgress: 1,
      xpReward: 50,
      completed: true,
      type: "strength" as const
    },
    {
      title: "Study Session",
      description: "Study for 30 minutes",
      progress: 25,
      maxProgress: 30,
      xpReward: 40,
      completed: false,
      type: "intelligence" as const
    },
    {
      title: "Hydration Goal",
      description: "Drink 8 glasses of water",
      progress: 6,
      maxProgress: 8,
      xpReward: 25,
      completed: false,
      type: "health" as const
    }
  ]

  const completedQuests = dailyQuests.filter(q => q.completed).length

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/5267d277-93f2-4cf0-80d6-d8dba26514f1.png" 
            alt="Yujiro Mode Logo" 
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-xl font-bold gradient-fire bg-clip-text text-transparent">
              Yujiro Mode
            </h1>
            <p className="text-xs text-muted-foreground">Unleash Your Inner Warrior</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 max-w-md mx-auto">
        {/* Player Level Card */}
        <PlayerLevel 
          level={playerData.level}
          currentXP={playerData.currentXP}
          maxXP={playerData.maxXP}
          playerName={playerData.name}
        />

        {/* XP Stats Grid */}
        <div className="grid grid-cols-1 gap-4">
          <XPCard
            title="Strength"
            currentXP={playerData.stats.strength.current}
            maxXP={playerData.stats.strength.max}
            level={playerData.stats.strength.level}
            icon={<Dumbbell className="text-red-500" />}
            variant="strength"
          />
          <XPCard
            title="Intelligence"
            currentXP={playerData.stats.intelligence.current}
            maxXP={playerData.stats.intelligence.max}
            level={playerData.stats.intelligence.level}
            icon={<Brain className="text-blue-500" />}
            variant="intelligence"
          />
          <XPCard
            title="Health"
            currentXP={playerData.stats.health.current}
            maxXP={playerData.stats.health.max}
            level={playerData.stats.health.level}
            icon={<Heart className="text-green-500" />}
            variant="health"
          />
        </div>

        {/* Daily Quests Section */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-lg">Daily Quests</h2>
            <span className="text-xs text-muted-foreground">
              ({completedQuests}/{dailyQuests.length} completed)
            </span>
          </div>
          <div className="space-y-3">
            {dailyQuests.map((quest, index) => (
              <DailyQuest key={index} {...quest} />
            ))}
          </div>
        </Card>

        {/* Boss Battle Section */}
        <BossBattle
          bossName="Shadow Demon"
          bossLevel={15}
          completedQuests={completedQuests}
          totalQuests={dailyQuests.length}
          canBattle={completedQuests === dailyQuests.length}
        />

        {/* AI Coach Teaser */}
        <Card className="p-4 border-secondary/30">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-secondary" />
            <h3 className="font-bold">AI Coach</h3>
            <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">
              Premium
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Get personalized workout plans, study schedules, and anime-style motivation from your AI trainer.
          </p>
          <p className="text-xs text-primary font-medium">
            🔥 Connect to Supabase to unlock AI features!
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Index;
