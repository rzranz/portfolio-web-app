# Product Requirements Document (PRD)

## 1. Project Overview
**Name:** Portfolio Web App - Randi Zakaria Putra
**Role:** Full Stack Web Developer
**Goal:** Create a stunning, high-performance portfolio website that merges "Interaction First" principles with a clean "Product UI" aesthetic.

## 2. Tech Stack & Architecture
- **Framework:** Vite + React (Extremely flexible, lightweight, and fast).
- **Styling:** Tailwind CSS (for rapid, consistent UI building).
- **Animations:** Motion (Framer Motion) or GSAP (for Interaction First hero section).
- **Icons:** Phosphor Icons or Radix UI Icons.
- **Content Management:** Local JSON / Markdown files (No CMS for now, keeping it lightweight).

## 3. Design & Theming
### Theme Modes
- **Light Mode:** Pure White background with **Dark Purple** accents.
- **Dark Mode:** Strict Black & White Minimalism (Pure off-black backgrounds, white text, gray structural borders).

### Typography
- **Primary Display (Headlines):** *Plus Jakarta Sans* or *Geist* (Modern, techy, bold).
- **Body & Product UI:** *Inter* or *Geist Sans* (Clean legibility for data-dense areas).
- **Monospace:** *Geist Mono* (For code snippets or technical metadata).

### Section Requirements
1. **Hero Section (Interaction First):**
   - Must be dynamic, relying on micro-interactions or scroll-driven animations.
   - Minimalist text layout (max 4 elements: eyebrow, headline, subtext, CTA).
   - Avoid centered generic blobs. Use asymmetric or split layouts.
2. **Recent Works (Product UI):**
   - Designed like a real dashboard/software interface, not just standard website cards.
   - Use Bento Box grids for features/showcases.
   - Crisp 1px borders, generous padding, muted structural dividers.

## 4. Content Structure (JSON)
Data will be stored in `src/data/` (e.g., `works.json`, `experience.json`).
