import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Play, RefreshCw, Clock, Target, Flame } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const workoutTypes = [
  { name: "Strength Training", color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/30" },
  { name: "HIIT Cardio", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30" },
  { name: "Endurance", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
  { name: "Flexibility", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" }
];

const sampleWorkouts = [
  {
    name: "Shadow Strike Combo",
    type: "Strength Training",
    duration: "25 min",
    difficulty: "Master",
    exercises: ["Push-ups", "Pull-ups", "Burpees", "Mountain Climbers"],
    xpReward: 300,
    auraReward: 0.5
  },
  {
    name: "Lightning Sprint",
    type: "HIIT Cardio", 
    duration: "15 min",
    difficulty: "Elite",
    exercises: ["High Knees", "Jump Squats", "Sprints", "Rest"],
    xpReward: 250,
    auraReward: 0.4
  },
  {
    name: "Iron Will",
    type: "Endurance",
    duration: "30 min", 
    difficulty: "Advanced",
    exercises: ["Plank", "Wall Sit", "Dead Hang", "Isometric Holds"],
    xpReward: 200,
    auraReward: 0.3
  }
];

export function WorkoutGenerator() {
  const [currentWorkout, setCurrentWorkout] = useState(sampleWorkouts[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateWorkout = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomWorkout = sampleWorkouts[Math.floor(Math.random() * sampleWorkouts.length)];
      setCurrentWorkout(randomWorkout);
      setIsGenerating(false);
    }, 1500);
  };

  const workoutTypeStyle = workoutTypes.find(t => t.name === currentWorkout.type) || workoutTypes[0];

  return (
    <Card className="p-6 card-glass h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20 border border-primary/30">
              <Wand2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-xl text-foreground">AI Workout Generator</h2>
              <p className="text-sm text-muted-foreground">Custom routines tailored for you</p>
            </div>
          </div>
          
          <Button 
            onClick={generateWorkout} 
            disabled={isGenerating}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
            Generate
          </Button>
        </div>

        {/* Current Workout */}
        <motion.div
          key={currentWorkout.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg border ${workoutTypeStyle.bg} ${workoutTypeStyle.border}`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-foreground">{currentWorkout.name}</h3>
              <Badge className={workoutTypeStyle.color}>
                {currentWorkout.difficulty}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {currentWorkout.duration}
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {currentWorkout.type}
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4" />
                +{currentWorkout.xpReward} XP
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Exercises:</p>
              <div className="flex flex-wrap gap-2">
                {currentWorkout.exercises.map((exercise, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {exercise}
                  </Badge>
                ))}
              </div>
            </div>

            <Button className="w-full gap-2" size="lg">
              <Play className="w-4 h-4" />
              Start Workout
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-foreground">24</div>
            <div className="text-xs text-muted-foreground">Workouts</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-foreground">12h</div>
            <div className="text-xs text-muted-foreground">This Week</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-muted/50">
            <div className="text-2xl font-bold text-foreground">7</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>
      </div>
    </Card>
  );
}