# Desk of Saar

A minimal portfolio website for showcasing and reading eBooks online.

## Features

- Clean, minimal design with Playfair Display and Inter fonts
- Responsive layout for desktop and mobile
- PDF reader with full-screen mode
- Book gallery with hover effects

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Firebase (storage configuration ready)

## Quick Start

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── data/          # Book data and contact info
├── lib/           # Firebase configuration
├── pages/         # Page components
├── App.jsx        # Main app component
└── index.css      # Global styles

public/
├── books/         # PDF files
├── covers/        # Book cover images
└── favicon.svg    # Site favicon
```

## Adding Books

Add book entries to `src/data/books.js`:

```javascript
{
  id: "book-xxx",
  title: "Book Title",
  author: "Author Name",
  description: "Book description",
  cover: "/covers/cover-image.jpg",
  file: "book-file.pdf",
  genre: "Genre"
}
```

Place the PDF in `public/books/` and the cover image in `public/covers/`.

## License

All rights reserved. Books are free to read.
