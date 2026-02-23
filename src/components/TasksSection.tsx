'use client';

import * as React from 'react';
import tasksData from '../../data/tasksData.json';
import { AdjustableSlider } from './AdjustableSlider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateTotalEarned } from '@/lib/calculations';

interface Milestone {
  level: number;
  reward: number;
}

interface TaskCategory {
  category: string;
  image: string;
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
        <Card key={category.category} className='gap-4 py-4'>
          <CardContent className='px-4'>
            <div className="flex gap-4 items-end">
              <div className="grow-0"><img src={category.image} alt={category.category} className='rounded-xl w-20 h-20' /></div>
              <div className="grow font-bold pb-4">{category.category}</div>
            </div>
            <div className="flex gap-4">
              <div className="grow grid gap-4 pt-4">
                {category.tiers.map((tier) => {
                  const key = `${category.category}-${tier}`;
                  const currentLevel = levels[key] || 0;
                  const maxLevel = Math.max(...category.milestones.map((m) => m.level));

                  // Find next reward
                  const nextMilestone = category.milestones.find((m) => m.level > currentLevel);
                  const earnedInTier = category.milestones
                    .filter((m) => currentLevel >= m.level)
                    .reduce((sum, m) => sum + m.reward, 0);

                  return (
                    <div key={key} className="flex gap-4 border-b border-border/20 pb-4 last:border-b-0 last:pb-0">
                      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary p-1 font-mono font-semibold text-[10px] text-white">
                        {tier}
                      </div>
                      <div className="grow space-y-1">
                        <AdjustableSlider
                          min={0}
                          max={maxLevel}
                          value={currentLevel}
                          onChange={(val) => handleLevelChange(key, val)}
                        />
                        <div className="flex justify-between items-center">
                          <div className="text-xs font-semibold">{earnedInTier.toLocaleString()} Medals</div>
                          {nextMilestone && (
                            <div className="text-right text-[10px] font-medium text-slate-500">
                              Next Reward: {nextMilestone.reward.toLocaleString()} at Level {nextMilestone.level}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
