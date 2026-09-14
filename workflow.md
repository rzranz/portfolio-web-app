# Project Workflow

## Phase 1: Initialization
1. Initialize the project using Vite:
   `npm create vite@latest . -- --template react-ts` (if React) or `vue-ts` (if Vue).
2. Install Tailwind CSS:
   `npm install -D tailwindcss postcss autoprefixer` and initialize it.
3. Install core libraries:
   `npm install motion @phosphor-icons/react`

## Phase 2: Design System & Theming
1. Set up `index.css` with the strict color palette (Light: White/Dark Purple, Dark: B&W Minimalism).
2. Configure Tailwind theme and add the chosen fonts (Inter/Geist/Plus Jakarta Sans).
3. Create global layout components enforcing the macro-whitespace rules (generous padding, constrained max-widths).

## Phase 3: Content Integration
1. Create `src/data/portfolio.json` for all dynamic data.
2. Build utility functions to parse and load this JSON data into the UI.

## Phase 4: Component Development
1. **Hero Section:** Build the "Interaction First" entry point using Motion. Focus on scroll reveals and hover physics.
2. **Product UI Bento Grids:** Build the Recent Works section using CSS Grid. Enforce 1px borders, no heavy shadows.

## Phase 5: Polish & Pre-Flight
1. **Contrast Check:** Ensure dark purple is readable on white, and dark mode contrast is perfectly tuned.
2. **Copy Audit:** Remove any accidental AI clichés.
3. **Responsive Check:** Ensure all grids collapse cleanly on mobile (explicit `< 768px` behavior).
