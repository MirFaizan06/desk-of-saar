# Setup Guide

## Prerequisites

- Node.js 18+
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Adding Books

### Step 1: Prepare Files

- PDF file for the book
- Cover image (JPG/JPEG recommended, aspect ratio 2:3)

### Step 2: Add Files to Public Folder

- Place PDF in `public/books/`
- Place cover image in `public/covers/`

### Step 3: Update Book Data

Edit `src/data/books.js` and add a new book entry:

```javascript
{
  id: "book-005",
  title: "Your Book Title",
  author: "Author Name",
  priceINR: 0,
  description: "A brief description of the book.",
  cover: "/covers/your-cover.jpg",
  file: "your-book.pdf",
  tags: ["fiction", "new"],
  createdAt: "2026-01-18",
  genre: "Fiction"
}
```

## Firebase Setup (Optional)

The project is configured for Firebase Storage. To enable:

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Storage in your Firebase project
3. Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

4. Upload books to Firebase Storage under `books/` folder
5. Update `src/lib/firebase.js` to use Firebase URLs instead of local paths

## Building for Production

```bash
npm run build
```

Output will be in the `dist/` folder.

## Preview Production Build

```bash
npm run preview
```

## Updating Contact Information

Edit `src/data/contact.js` to update email and social links.

## Customization

### Fonts

Fonts are loaded via Google Fonts in `src/index.css`. To change:
- Update the `@import` URL
- Modify `--font-serif` and `--font-sans` variables

### Colors

Edit CSS variables in `src/index.css` under `@theme`:
- `--color-bg`: Background color
- `--color-text-main`: Main text color
- `--color-text-gray`: Secondary text color
