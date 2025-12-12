# Desk of Saar - Free eBooks Collection

A stunning, fully responsive eBook platform built with React, Vite, Tailwind CSS v4, Three.js, and Framer Motion. Features an immersive reading mode with background music, intelligent book categorization, and a beautiful dark/light theme.

## Features

### Core Features
- **Immersive Reading Mode**: Fullscreen PDF viewer with focus music, brightness control, reading timer, and bookmarks
- **Background Music Player**: 5 classical music tracks with play/pause, volume control, skip/forward, and auto-play next
- **Welcome Modal**: First-visit greeting with auto-scroll carousel option (persisted in localStorage)
- **Smart Collections**: Auto-categorized books (New, Recommended, Popular, Genre-based)
- **Auto Tag Management**: Automatically removes "new" tag after 14 days
- **Popularity Tracking**: Client-side view tracking with localStorage
- **Credits System**: Comprehensive attribution page for images, music, and fonts with downloadable credits.txt
- **Search & Filter**: Real-time search across title, author, genre, and description

### Design & UX
- **Premium Design**: Elegant UI with glassmorphic modals and smooth transitions
- **Dark/Light Themes**: Beautiful theme system with optimized colors for both modes (theme toggle hidden by default)
- **3D Backgrounds**: Animated Three.js waves and particles (starfield + hero)
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Fully Responsive**: Mobile-first design with proper spacing and scrolling on all devices
- **Auto-Scroll Carousels**: Optional gentle auto-scrolling for book carousels

### Technical
- **No Backend Required**: Fully frontend with Firebase Storage for PDFs
- **SEO Optimized**: Comprehensive meta tags, Open Graph, and Twitter Cards
- **Production Ready**: Optimized builds with code splitting and lazy loading
- **Performance First**: Reduced particle counts, memoized components, lazy loading

## Tech Stack

- **React 18** with Vite
- **Tailwind CSS v4** (latest @themes setup)
- **Three.js** + React Three Fiber for 3D effects
- **Framer Motion** for animations
- **Firebase Storage** for PDF hosting
- **Lucide React** for icons

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure Firebase (optional, for actual downloads):
   - Edit `src/lib/firebase.js`
   - Add your Firebase project credentials
   - Upload PDFs to Firebase Storage in a `books/` folder

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown (usually http://localhost:5173)

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder, ready for deployment to Vercel, Netlify, or any static hosting.

## Project Structure

```
├── public/
│   ├── covers/            # Book cover images
│   ├── illustrations/     # Page illustrations (Unsplash)
│   ├── music/             # Background music tracks (.mp3)
│   ├── credits.txt        # Attribution file (downloadable)
│   ├── version.txt        # App version number
│   └── favicon.svg        # Custom book icon
├── src/
│   ├── components/        # React components
│   │   ├── HeroBackground.jsx      # Three.js animated waves
│   │   ├── Starfield.jsx           # Three.js starfield background
│   │   ├── Hero.jsx                # Hero section
│   │   ├── Header.jsx              # Navigation header (with hidden theme toggle)
│   │   ├── ScrollProgress.jsx      # Reading progress indicator
│   │   ├── BookCard.jsx            # Individual book card
│   │   ├── Carousel.jsx            # Auto-scrolling carousel
│   │   ├── BookModal.jsx           # Book details modal (mobile responsive)
│   │   ├── ReadingMode.jsx         # Fullscreen PDF reader with music player
│   │   └── WelcomeModal.jsx        # First-visit welcome screen
│   ├── pages/             # Page components
│   │   ├── Home.jsx                # Main landing page
│   │   ├── FAQs.jsx                # FAQ page (with Reading Mode FAQs)
│   │   ├── Contact.jsx             # Contact page
│   │   └── Credits.jsx             # Attribution page
│   ├── data/              # Data management
│   │   ├── books.js                # Book catalog
│   │   ├── tags.js                 # Tag definitions with colors
│   │   ├── faqs.js                 # FAQ content
│   │   └── contact.js              # Contact information
│   ├── lib/               # Utilities
│   │   ├── bookUtils.js            # Book logic and filtering
│   │   └── firebase.js             # Firebase Storage configuration
│   ├── App.jsx            # Main app with footer
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles (dark/light themes)
├── vite.config.js         # Vite config (optimized for production)
├── SETUP_BOOKS.md         # Guide for adding real books
└── package.json
```

## Quick Start - Adding Books

For detailed instructions on setting up real books with Firebase, see **[SETUP_BOOKS.md](./SETUP_BOOKS.md)**

Basic book structure in `src/data/books.js`:

```javascript
{
  id: "book-009",
  title: "Your Book Title",
  author: "Author Name",
  priceINR: 0, // Always 0 for free books
  description: "Compelling book description...",
  cover: "/covers/book-009.jpg",
  file: "book-009.pdf", // Filename in Firebase Storage
  tags: ["new", "fiction", "adventure"], // Use tags from tags.js
  createdAt: "2025-12-12", // Format: YYYY-MM-DD
  genre: "Fiction" // Main genre
}
```

**Required Steps:**
1. Add book object to `src/data/books.js`
2. Add cover image to `public/covers/`
3. Upload PDF to Firebase Storage `books/` folder
4. Update `public/credits.txt` if needed

## Reading Mode Music

Add background music for the reading mode:

1. Add `.mp3` files to `public/music/` folder
2. Update `src/components/ReadingMode.jsx` (line 37-43) with track names
3. Add attribution to `public/credits.txt` and `src/pages/Credits.jsx`

**Current tracks:**
- 5 Classical music pieces (Chopin, Liszt)
- Auto-play next track
- Volume control and mute
- Track progress indicator

## Customizing

### Colors

Edit `src/index.css` to change the theme colors:

```css
@theme {
  --color-bg: #F7F5F2;
  --color-warm: #D9CFC3;
  --color-stone: #9DA3A6;
  --color-accent: #B99B6B;
  --color-gold: #D4AF37;
  --color-silver: #C0C0C0;
  --color-text: #222222;
}
```

### Tags

Edit `src/data/tags.js` to add or modify tag styles:

```javascript
export const tagAtlas = {
  "your-tag": {
    display: "Your Tag",
    color: "bg-gold text-text",
    icon: "🏷️"
  }
}
```

### FAQs

Edit `src/data/faqs.js` to add or modify FAQ items.

### Contact Info

Edit `src/data/contact.js` to update contact details and social links.

## Performance Optimizations

- Lazy loading for Three.js components
- Optimized particle count for smooth animations
- Memoized book filtering and sorting
- Efficient localStorage caching
- Code splitting with Vite

## Deployment

### Vercel
```bash
vercel deploy
```

### Netlify
```bash
netlify deploy --prod
```

Or connect your Git repository for automatic deployments.

## License

MIT
