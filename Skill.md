---
name: portfolio-anti-slop-skill
description: Strict guidelines for coding the Portfolio UI to avoid AI clichés, enforcing a minimalist product UI aesthetic and a specific light/dark color scheme.
---

# Portfolio Design & Engineering Skill

## 1. Absolute Negative Constraints (Anti-AI Slop)
- **NO AI COPY:** Do not use words like "Elevate", "Seamless", "Unleash", "Next-Gen", "Game-changer", "Delve", "Robust". Write plain, human, specific language.
- **NO EMOJIS:** Do not use emojis in code, markup, or content. Use Phosphor Icons instead.
- **NO GENERIC SHADOWS:** Do not use `shadow-md`, `shadow-lg` etc. Shadows must be non-existent or ultra-subtle (`< 0.04` opacity).
- **NO BORDER RADIUS ABUSE:** Do not use `rounded-full` for massive containers. Stick to crisp `4px`, `8px`, or `12px` radii.
- **NO FAKE SCREENSHOTS:** Use real images or structured bento layouts, not `div`-based fake browser windows unless specifically requested.

## 2. Color Palette Discipline
- **Light Mode:** Canvas must be Pure White (`#FFFFFF`). Primary accent color must be **Dark Purple** (e.g., `#4B0082` or similar deep indigo/purple).
- **Dark Mode (Minimalism):** Pure B&W minimalism. Canvas is Off-Black (`#111111` or `#0A0A0A`). Text is off-white (`#EAEAEA`). Structural borders are `rgba(255,255,255,0.1)`. No neon gradients, no purple in dark mode.

## 3. Layout & Product UI (Recent Works)
- Use **Bento Grids** for features and showcases.
- Asymmetrical CSS Grid layouts with exactly `border: 1px solid` (light gray in light mode, dark gray in dark mode).
- Internal padding must be generous (e.g., `24px` to `40px`).
- Do not repeat the same zigzag split-screen layout more than twice.

## 4. Typography
- Do not use default Serifs.
- Rely on extreme typographic contrast using Sans-Serif (Geist, Inter, or Plus Jakarta Sans).
- Never use pure black `#000000` for text; use `#111111` instead.

## 5. Interaction
- Use Motion (`motion/react`) for subtle entry animations.
- Hover states on cards: micro-scale `transform: scale(0.98)` or ultra-subtle shadow shift. No bouncy/exaggerated spring physics unless it's explicitly the Hero interaction.
