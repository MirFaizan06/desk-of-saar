# Desk of Saar

A luxury, editorial-style portfolio and book gallery built with React, Vite, and Firebase. This project features the premium **Ivory & Ink** design system.

## Features

- **Ivory & Ink Aesthetic:** A premium typographic-first design with `Cormorant Garamond` and `Outfit` fonts, subtle glassmorphism, and cinematic scroll-reveal micro-animations.
- **Dynamic Projects & Books Showcase:** Integrated Firestore backend for fetching live updates to books and portfolio projects without requiring redeploys.
- **Secure Administration:** Fully integrated admin dashboard with CMS capabilities, analytics tracking, and layout builders for dynamic database updates.
- **Enhanced SEO:** Out-of-the-box support for auto-generated sitemaps, robots.txt routing, and JSON-LD structured data injection for Google Search indexing.
- **Lightweight Architecture:** Cloudflare and AWS configurations have been removed in favor of a lean metadata footprint allowing links out to fast localized platforms.

## Tech Stack

- **Framework:** React 18 & Vite
- **Routing:** React Router v7
- **Database / Auth:** Firebase (Firestore + Firebase Auth)
- **Icons:** Lucide React
- **Design System:** Custom CSS3 with robust structural theming constraints via React context.

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Environment Config:
   Copy `.env.example` -> `.env` and fill out your Firebase initialization metrics (see `FIREBASE_SETUP.md` and `SETUP.md`).

3. Start development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # UI elements (Cards, Forms, Navbars, Footers)
├── context/        # Global state (Theme, Auth, Toasts, Dialogs)
├── data/           # Mock data fallbacks for non-DB deployments
├── hooks/          # Async data resolution blocks (useBooks, useProjects)
├── lib/            # External config services (Firebase, Geo Tracking)
├── pages/          # App and Admin view rendering layers
├── App.jsx         # React tree root
└── index.css       # Core Ivory & Ink CSS tokens and layout anchors
```

## Adding and Modifying Content 

1. **Dashboard:** Content is strictly maintained through the admin tools found via `/admin`.
2. **Assets:** Cover images for books are kept within `public/covers/`.

## License

All rights reserved. Designed and engineered for MirFaizan06.
