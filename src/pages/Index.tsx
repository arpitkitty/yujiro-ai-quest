import { XPCard } from "@/components/XPCard"
import { DailyQuest } from "@/components/DailyQuest"
import { PlayerLevel } from "@/components/PlayerLevel"
import { BossBattle } from "@/components/BossBattle"
import { Sidebar } from "@/components/Sidebar"
import { HunterCard } from "@/components/HunterCard"
import { WorkoutGenerator } from "@/components/WorkoutGenerator"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Brain, Heart, Target, Calendar, Zap, Star, Trophy, User } from "lucide-react"

const Index = () => {
  // Mock data - this would come from your Supabase backend
  const playerData = {
    name: "Shadow Hunter",
    title: "Elite Warrior",
    level: 12,
    currentXP: 2840,
    maxXP: 3000,
    rank: "Diamond",
    aura: 4.2,
    streak: 7,
    stats: {
      strength: { current: 450, max: 500, level: 8 },
      agility: { current: 380, max: 450, level: 7 },
      endurance: { current: 320, max: 400, level: 6 },
      spirit: { current: 180, max: 300, level: 4 }
    }
  }

  const dailyQuests = [
    {
      title: "Shadow Strike Training",
      description: "Complete 4 sets of 15 push-ups",
      progress: 4,
      maxProgress: 4,
      xpReward: 150,
      auraReward: 0.2,
      completed: true,
      type: "strength" as const,
      difficulty: "Elite"
    },
    {
      title: "Lightning Sprint",
      description: "15-minute HIIT cardio session",
      progress: 12,
      maxProgress: 15,
      xpReward: 200,
      auraReward: 0.3,
      completed: false,
      type: "agility" as const,
      difficulty: "Master"
    },
    {
      title: "Iron Will Challenge",
      description: "Hold plank for 2 minutes total",
      progress: 90,
      maxProgress: 120,
      xpReward: 120,
      auraReward: 0.1,
      completed: false,
      type: "endurance" as const,
      difficulty: "Advanced"
    },
    {
      title: "Meditation Mastery",
      description: "10 minutes focused breathing",
      progress: 0,
      maxProgress: 10,
      xpReward: 80,
      auraReward: 0.2,
      completed: false,
      type: "spirit" as const,
      difficulty: "Beginner"
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg card-neon glow-neon">
                <img 
                  src="/lovable-uploads/5267d277-93f2-4cf0-80d6-d8dba26514f1.png" 
                  alt="Arise Logo" 
                  className="w-8 h-8"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gradient tracking-wide">
                  ARISE AI
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Level Up Your Fitness Solo
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-2">
                <Trophy className="w-4 h-4" />
                Streak: {playerData.streak} days
              </Badge>
              <Badge variant="outline" className="gap-2">
                <Star className="w-4 h-4" />
                Aura: {playerData.aura}
              </Badge>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-6xl mx-auto">
        {/* Hunter Card & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <HunterCard 
              name={playerData.name}
              title={playerData.title}
              level={playerData.level}
              rank={playerData.rank}
              aura={playerData.aura}
              currentXP={playerData.currentXP}
              maxXP={playerData.maxXP}
            />
          </div>
          <div className="lg:col-span-2">
            <WorkoutGenerator />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <XPCard
            title="Strength"
            currentXP={playerData.stats.strength.current}
            maxXP={playerData.stats.strength.max}
            level={playerData.stats.strength.level}
            icon={<Dumbbell className="w-5 h-5" />}
            variant="strength"
          />
          <XPCard
            title="Agility"
            currentXP={playerData.stats.agility.current}
            maxXP={playerData.stats.agility.max}
            level={playerData.stats.agility.level}
            icon={<Zap className="w-5 h-5" />}
            variant="agility"
          />
          <XPCard
            title="Endurance"
            currentXP={playerData.stats.endurance.current}
            maxXP={playerData.stats.endurance.max}
            level={playerData.stats.endurance.level}
            icon={<Heart className="w-5 h-5" />}
            variant="endurance"
          />
          <XPCard
            title="Spirit"
            currentXP={playerData.stats.spirit.current}
            maxXP={playerData.stats.spirit.max}
            level={playerData.stats.spirit.level}
            icon={<Brain className="w-5 h-5" />}
            variant="spirit"
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
