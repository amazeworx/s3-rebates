'use client';

import * as React from "react";
import tasksData from "../../data/tasksData.json";
import { AdjustableSlider } from "./AdjustableSlider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateTotalEarned } from "@/lib/calculations";

interface Milestone {
  level: number;
  reward: number;
}

interface TaskCategory {
  category: string;
  tiers: string[];
  milestones: Milestone[];
}

interface TasksSectionProps {
  levels: Record<string, number>;
  setLevels: (levels: Record<string, number>) => void;
  onTotalEarnedChange: (total: number) => void;
}

export function TasksSection({ levels, setLevels, onTotalEarnedChange }: TasksSectionProps) {
  React.useEffect(() => {
    onTotalEarnedChange(calculateTotalEarned(levels));
  }, [levels, onTotalEarnedChange]);

  const handleLevelChange = (key: string, value: number) => {
    const nextLevels = { ...levels, [key]: value };
    setLevels(nextLevels);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
      {(tasksData as TaskCategory[]).map((category) => (
        <Card key={category.category} className="bg-white border-slate-200 text-slate-900 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold uppercase tracking-wider text-amber-600">
              {category.category}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            {category.tiers.map((tier) => {
              const key = `${category.category}-${tier}`;
              const currentLevel = levels[key] || 0;
              const maxLevel = Math.max(...category.milestones.map((m) => m.level));
              
              // Find next reward
              const nextMilestone = category.milestones.find(m => m.level > currentLevel);
              const earnedInTier = category.milestones
                .filter(m => currentLevel >= m.level)
                .reduce((sum, m) => sum + m.reward, 0);

              return (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between items-end text-sm">
                    <span className="font-semibold text-slate-700">Tier {tier}</span>
                    <span className="text-amber-600 font-mono font-bold">
                      {earnedInTier} Medals
                    </span>
                  </div>
                  <AdjustableSlider
                    min={0}
                    max={maxLevel}
                    value={currentLevel}
                    onChange={(val) => handleLevelChange(key, val)}
                  />
                  {nextMilestone && (
                    <div className="text-[10px] text-slate-500 text-right font-medium">
                      Next Reward: {nextMilestone.reward} at Level {nextMilestone.level}
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
