import { calculateTotalEarned, calculateTotalSpent } from './calculations';
import assert from 'assert';

console.log('Running calculation tests...');

// Test 1: Calculate Total Earned - Basic Accumulation
// Thermal Lab:
// Level 10 -> 500
// Level 15 -> 500
// Level 20 -> 1000

const levels1 = {
  'Thermal Lab-I': 10,
};
// Expect 500
assert.strictEqual(calculateTotalEarned(levels1), 500, 'Level 10 should give 500 medals');

const levels2 = {
  'Thermal Lab-I': 15,
};
// Expect 500 + 500 = 1000 (accumulative)
assert.strictEqual(
  calculateTotalEarned(levels2),
  1000,
  'Level 15 should give 1000 medals (500+500)'
);

const levels3 = {
  'Thermal Lab-I': 20,
};
// Expect 500 + 500 + 1000 = 2000
assert.strictEqual(
  calculateTotalEarned(levels3),
  2000,
  'Level 20 should give 2000 medals (500+500+1000)'
);

// Test 2: Multiple Tiers
const levelsMultiple = {
  'Thermal Lab-I': 10,
  'Smart Greenhouse-I': 15,
};
// Thermal Lab-I (10) -> 500
// Smart Greenhouse-I (15) -> 500 (milestones: 15, 20, 24...)
// Total: 1000
assert.strictEqual(calculateTotalEarned(levelsMultiple), 1000, 'Multiple tiers calculation failed');

// Test 3: Calculate Total Spent
// dx-blueprint cost: 250
// precision-part cost: 60

const cart1 = {
  'dx-blueprint': 2,
  'precision-part': 1,
};
// (2 * 250) + (1 * 60) = 500 + 60 = 560
assert.strictEqual(calculateTotalSpent(cart1), 560, 'Total spent calculation failed');

console.log('All tests passed!');
