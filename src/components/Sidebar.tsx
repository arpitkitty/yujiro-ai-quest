import { Dumbbell, Brain, Heart, Home, Target, Trophy, Settings } from "lucide-react"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"

const sidebarItems = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Strength", href: "/strength", icon: Dumbbell },
  { name: "Intelligence", href: "/intelligence", icon: Brain },
  { name: "Health", href: "/health", icon: Heart },
  { name: "Quests", href: "/quests", icon: Target },
  { name: "Achievements", href: "/achievements", icon: Trophy },
  { name: "Settings", href: "/settings", icon: Settings },
]

export const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-background border-r border-border/30 flex flex-col items-center py-4 z-50">
      {/* Logo */}
      <div className="mb-8 p-2 rounded-lg card-neon">
        <img 
          src="/lovable-uploads/5267d277-93f2-4cf0-80d6-d8dba26514f1.png" 
          alt="Yujiro Mode" 
          className="w-8 h-8"
        />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-3 flex-1">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "p-3 rounded-lg transition-glow group relative",
                "hover:card-neon hover:glow-neon",
                isActive 
                  ? "card-neon glow-neon text-primary" 
                  : "text-muted-foreground hover:text-primary"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            
            {/* Tooltip */}
            <div className="absolute left-full ml-3 px-2 py-1 bg-card border border-border/50 rounded-md text-xs text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.name}
            </div>
          </NavLink>
        ))}
      </nav>

      {/* Level indicator at bottom */}
      <div className="mt-auto p-2 rounded-lg card-neon text-center">
        <div className="text-xs text-primary font-bold">12</div>
        <div className="text-[10px] text-muted-foreground">LVL</div>
      </div>
    </div>
  )
}