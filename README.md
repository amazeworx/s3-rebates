# Dark War Survival - Rebate Calculator

A professional Next.js (App Router) application designed to calculate "Season Building Rebates" rewards and manage exchange shop spending for the game Dark War Survival.

## Features

- **Accumulative Rewards**: Automatically calculates total medals earned across multiple building tiers and milestones.
- **Budgeting System**: Real-time tracking of "Total Earned" vs "Total Spent" with a remaining balance indicator.
- **Smart Constraints**: Automatically prevents adding shop items that exceed the remaining balance.
- **Persistent State**: Automatically saves your building progress and shopping cart to local storage.
- **Clean Tactical UI**: High-contrast light mode interface built with Tailwind CSS and `shadcn/ui`.

## Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS 4
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Persistence**: Custom `useLocalStorage` hook

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Build for production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/app/page.tsx`: Main dashboard layout and state orchestration.
- `src/components/TasksSection.tsx`: Building level management and reward logic.
- `src/components/ShopSection.tsx`: Shop inventory management and budget control.
- `src/components/AdjustableSlider.tsx`: Reusable control component for levels and quantities.
- `src/lib/calculations.ts`: Pure functions for rewards and spending calculations.
- `data/`: Contains `tasksData.json` and `shopData.json` for game event specifications.

## Testing

Verify calculation logic with the test suite:
```bash
npm test
```

## License

MIT
