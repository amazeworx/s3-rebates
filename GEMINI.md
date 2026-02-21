# Project Context: Dark War Survival - Rebate Calculator

## Objective
Build a Next.js (App Router) client-side application using Tailwind CSS and `shadcn/ui`. The app is a calculator for a game event called "Season Building Rebates." It allows users to calculate total earned "Season Medals" based on their building levels and spend them in a virtual "Shop Cart".

## Data Sources
- `data/tasksData.json`: Contains building categories, tiers, and milestone levels with medal rewards.
- `data/shopData.json`: Contains shop items, their medal costs, and maximum exchange limits.

## Core Rules & Logic
1. **Accumulative Rewards:** Building rewards are accumulated. If a user sets a building to Level 24, they receive the rewards for Level 15, Level 20, AND Level 24.
2. **Budgeting System:** - `Total Earned` = Sum of all accumulated rewards from the Tasks section.
   - `Total Spent` = Sum of all costs from items selected in the Shop section.
   - `Remaining Balance` = `Total Earned` - `Total Spent`.
3. **State Persistence:** Use a custom `useLocalStorage` hook to persist the user's `buildingLevels` and `cartItems` across sessions. Ensure hydration is handled correctly to avoid Next.js SSR mismatch errors.

## UI/UX Requirements
Use light-mode by default. The UI should be tactical and clean. Mobile First approach.

### Component 1: The Task Input (Building Levels)
- Map through `tasksData.json`. For each category (e.g., Smart Greenhouse), render a block.
- Inside the block, map through the available tiers (I, II, III, etc.).
- For each tier, use a `shadcn/ui` Slider, complemented by a minus `[-]` button, a plus `[+]` button, and a numeric input display. 
- The max value of the slider should be the highest level in that building's `milestones` array.
- As the slider moves, `Total Earned` updates immediately.

### Component 2: The Shop Cart (Redemption)
- Show a sticky header or fixed bar displaying: `Remaining Balance / Total Earned`.
- Map through `shopData.json` displaying the Item Name, Image/Icon placeholder, and Cost.
- Use the same `shadcn/ui` Slider/Button component pattern here.
- The slider's max limit is the `maxExchange` value of the item.
- **Constraint:** The user cannot increase the shop slider if the item's cost exceeds the `Remaining Balance`. Disable the `[+]` button dynamically.

## Step-by-Step Execution Plan for Cursor
1. Initialize `shadcn/ui` components: `slider`, `button`, `card`, `input`.
2. Create `hooks/useLocalStorage.ts` for safe SSR client-side persistence.
3. Build a generic `AdjustableSlider.tsx` component that accepts `min`, `max`, `value`, and `onChange`. It must include the `-`, `+`, and numerical input alongside the `shadcn` Slider.
4. Build `TasksSection.tsx` to handle building level inputs and calculate `Total Earned`.
5. Build `ShopSection.tsx` to handle cart inputs, constrained by `Remaining Balance`.
6. Assemble in `page.tsx` with a responsive grid layout (Tasks on the left/top, Shop on the right/bottom).