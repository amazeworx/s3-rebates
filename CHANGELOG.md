# Changelog

All notable changes to this project will be documented in this file.

## [1.1.0] - 2026-02-21

### Changed

- **Theme Overhaul**: Switched the entire application from dark mode to a tactical light mode.
- **UI Refinement**: Updated `TasksSection`, `ShopSection`, and main layout with high-contrast slate and amber themes for better readability in light environments.
- **Header**: Refined the sticky header and status indicators for a cleaner look.
- **Typography**: Standardized on the `Inter` font family for improved legibility.
- **Components**: Enhanced `AdjustableSlider` layout and interactivity; updated `Button` and `Card` styles.

### Added

- **Assets**: Integrated placeholder images for task categories and shop items.
- **Interactivity**: Added "Reset" button to clear building levels and "Clear" button to empty the shop cart.
- **Footer**: Added a "Made with Love" footer with ZWT branding.
- **Badges**: Added quantity badges to shop items for clearer summary.

## [1.0.0] - 2026-02-21

### Added

- **Initial Release**: Core functionality for "Season Building Rebates" calculation.
- **Tasks Section**: Support for multiple building categories and tiers with accumulative reward calculation.
- **Shop Section**: Interactive cart system with budget constraints and remaining balance tracking.
- **Persistence**: Integrated local storage for saving user progress across sessions.
- **Unit Tests**: Added verification tests for core calculation logic.
- **Base Components**: Integrated `shadcn/ui` (Slider, Button, Card, Input).
