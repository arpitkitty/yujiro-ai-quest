import { XPCard } from "@/components/XPCard"
import { DailyQuest } from "@/components/DailyQuest"
import { PlayerLevel } from "@/components/PlayerLevel"
import { BossBattle } from "@/components/BossBattle"
import { Sidebar } from "@/components/Sidebar"
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
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 ml-16">
        {/* Header */}
        <div className="p-6 border-b border-border/30">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg card-neon glow-neon">
              <img 
                src="/lovable-uploads/5267d277-93f2-4cf0-80d6-d8dba26514f1.png" 
                alt="Yujiro Mode Logo" 
                className="w-8 h-8"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gradient tracking-wide">
                YUJIRO MODE
              </h1>
              <p className="text-sm text-muted-foreground font-medium">
                Unleash Your Inner Warrior
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-4xl mx-auto">
        {/* Player Level Card */}
        <PlayerLevel 
          level={playerData.level}
          currentXP={playerData.currentXP}
          maxXP={playerData.maxXP}
          playerName={playerData.name}
        />

        {/* XP Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <XPCard
            title="Strength"
            currentXP={playerData.stats.strength.current}
            maxXP={playerData.stats.strength.max}
            level={playerData.stats.strength.level}
            icon={<Dumbbell className="w-5 h-5" />}
            variant="strength"
          />
          <XPCard
            title="Intelligence"
            currentXP={playerData.stats.intelligence.current}
            maxXP={playerData.stats.intelligence.max}
            level={playerData.stats.intelligence.level}
            icon={<Brain className="w-5 h-5" />}
            variant="intelligence"
          />
          <XPCard
            title="Health"
            currentXP={playerData.stats.health.current}
            maxXP={playerData.stats.health.max}
            level={playerData.stats.health.level}
            icon={<Heart className="w-5 h-5" />}
            variant="health"
          />
        </div>

        {/* Daily Quests Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 card-glass transition-glow hover:glow-neon">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-foreground">Daily Quests</h2>
                <p className="text-sm text-muted-foreground">
                  {completedQuests}/{dailyQuests.length} completed today
                </p>
              </div>
            </div>
            <div className="space-y-4">
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
        </div>

        {/* AI Coach Teaser */}
        <Card className="p-6 card-glass border-secondary/30 transition-glow hover:glow-purple">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-secondary/20 border border-secondary/30">
              <Target className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-foreground">AI Coach</h3>
                <span className="text-xs bg-secondary/20 text-secondary px-3 py-1 rounded-full font-medium border border-secondary/30">
                  Premium
                </span>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
            Get personalized workout plans, study schedules, and anime-style motivation from your AI trainer.
          </p>
          <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-primary font-medium">
              🔥 Connect to Supabase to unlock AI features!
            </p>
          </div>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default Index;
