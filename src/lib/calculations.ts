import tasksData from '../../data/tasksData.json';
import shopData from '../../data/shopData.json';

interface Milestone {
  level: number;
  reward: number;
}

interface TaskCategory {
  category: string;
  tiers: string[];
  milestones: Milestone[];
}

interface ShopItem {
  id: string;
  cost: number;
}

export function calculateTotalEarned(levels: Record<string, number>): number {
  let total = 0;
  (tasksData as TaskCategory[]).forEach((category) => {
    category.tiers.forEach((tier) => {
      const key = `${category.category}-${tier}`;
      const level = levels[key] || 0;

      category.milestones.forEach((milestone) => {
        if (level >= milestone.level) {
          total += milestone.reward;
        }
      });
    });
  });
  return total;
}

export function calculateTotalSpent(cartItems: Record<string, number>): number {
  let total = 0;
  (shopData as ShopItem[]).forEach((item) => {
    const quantity = cartItems[item.id] || 0;
    total += quantity * item.cost;
  });
  return total;
}
