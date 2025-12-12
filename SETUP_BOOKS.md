# Setting Up Real Books - Complete Guide

This guide explains how to add real books to your eBooks website, including Firebase configuration, cover images, PDF uploads, and tag management.

## Prerequisites

- Firebase account (free tier works fine)
- Book cover images (JPEG/PNG recommended)
- PDF files of your books
- Basic knowledge of JavaScript objects

---

## Part 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it (e.g., "ebooks-storage")
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 1.2 Enable Firebase Storage

1. In Firebase Console, click "Storage" in left sidebar
2. Click "Get Started"
3. Start in **production mode** (or test mode temporarily)
4. Choose a storage location (closest to your users)
5. Click "Done"

### 1.3 Configure Storage Rules

Go to Storage → Rules tab and update:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /books/{allPaths=**} {
      allow read: if true;  // Public read access
      allow write: if false; // No public write
    }
  }
}
```

Click "Publish". This allows anyone to download but not upload books.

### 1.4 Get Firebase Config

1. Go to Project Settings (⚙️ icon → Project settings)
2. Scroll down to "Your apps"
3. Click web icon (</>) to add web app
4. Register app (name it "eBooks Web")
5. Copy the `firebaseConfig` object

### 1.5 Add Config to Project

Edit `src/lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

**Important:** Replace with your actual config values.

---

## Part 2: Uploading Books to Firebase

### 2.1 Create Books Folder in Firebase Storage

1. Go to Firebase Console → Storage
2. Click "Create folder"
3. Name it `books`
4. Click "Create"

### 2.2 Upload PDF Files

1. Click into the `books` folder
2. Click "Upload file"
3. Select your PDF files
4. Wait for upload to complete

**Naming Convention:**
- Use: `book-001.pdf`, `book-002.pdf`, etc.
- Or: `the-midnight-library.pdf` (lowercase, hyphens)
- Avoid spaces and special characters

### 2.3 Verify Upload

1. Click on uploaded file
2. Copy the "Download URL" (for testing)
3. Open in browser to confirm it loads

---

## Part 3: Adding Book Covers

### 3.1 Prepare Cover Images

**Requirements:**
- Format: JPEG or PNG (JPEG preferred for smaller size)
- Dimensions: 400x600px minimum (3:4 aspect ratio)
- File size: Under 200KB each
- Naming: Match book ID (e.g., `book-001.jpg`)

**Quick Resize (using online tools):**
- Go to [iloveimg.com/resize-image](https://www.iloveimg.com/resize-image)
- Upload cover
- Resize to 600x900px
- Download and save

### 3.2 Add Covers to Project

1. Save cover images to `public/covers/` folder
2. Name them to match your book file names
3. Example: `book-001.jpg`, `book-002.jpg`

---

## Part 4: Understanding Tags System

### 4.1 Available Tags

Check `src/data/tags.js` for all available tags:

**Special Tags:**
- `new` - Auto-applied, removed after 14 days
- `recommended` - Yellow badge, featured prominently

**Genre Tags:**
- `fiction`, `non-fiction`
- `science-fiction`, `thriller`, `mystery`, `horror`
- `romance`, `adventure`, `gothic`
- `self-help`, `productivity`, `history`, `mythology`

### 4.2 Tag Colors & Styles

Each tag has a `color` property in `tags.js`:

```javascript
fiction: {
  display: "Fiction",
  color: "bg-blue/10 dark:bg-blue/20 text-blue-dark dark:text-blue border border-blue/20 dark:border-blue/30 font-medium"
}
```

**Color system:**
- Blue: Fiction, Sci-Fi, Productivity
- Orange: Thriller, Romance, Adventure
- Yellow: Recommended, Self-Help
- Gray: Non-fiction, History, Mystery

### 4.3 Adding Custom Tags

Edit `src/data/tags.js` to add new tags:

```javascript
export const tagAtlas = {
  // ... existing tags
  "your-new-tag": {
    display: "Your Tag Name",
    color: "bg-blue/10 dark:bg-blue/20 text-blue dark:text-blue-light border border-blue/20 dark:border-blue/30 font-medium"
  }
}
```

**Color pattern:** `bg-{color}/{opacity} dark:bg-{color}/{opacity} text-{color} dark:text-{color}-light border border-{color}/{opacity} dark:border-{color}/{opacity} font-medium`

---

## Part 5: Adding Books to Catalog

### 5.1 Book Object Structure

Edit `src/data/books.js` and add your book to the `books` array:

```javascript
export const books = [
  // ... existing books
  {
    id: "book-009",                    // Unique ID (required)
    title: "The Great Gatsby",         // Book title (required)
    author: "F. Scott Fitzgerald",     // Author name (required)
    priceINR: 0,                       // Always 0 (free books only)
    description: "The story primarily concerns the young and mysterious millionaire Jay Gatsby and his quixotic passion and obsession to reunite with his ex-lover, the beautiful former debutante Daisy Buchanan.",
    cover: "/covers/book-009.jpg",     // Path to cover image
    file: "book-009.pdf",              // Filename in Firebase Storage
    tags: ["new", "fiction", "romance"], // Array of tag IDs
    createdAt: "2025-12-12",           // Today's date (YYYY-MM-DD)
    genre: "Fiction"                   // Main genre category
  }
];
```

### 5.2 Field Details

**id (string, required):**
- Format: `book-XXX` where XXX is a number
- Must be unique across all books
- Used for localStorage keys and tracking

**title (string, required):**
- Full book title
- Displayed in cards, modals, reading mode
- Keep under 60 characters for best display

**author (string, required):**
- Author's full name
- Use format: "First Last" or "First Middle Last"

**priceINR (number, required):**
- Always set to `0` (this is a free books site)
- Field kept for potential future use

**description (string, required):**
- Compelling book summary (2-4 sentences)
- 150-300 characters recommended
- Avoid spoilers
- Include genre hints and themes

**cover (string, required):**
- Path: `/covers/filename.jpg` or `.png`
- Must match file in `public/covers/`
- Relative path (starts with `/`)

**file (string, required):**
- Filename only: `book-009.pdf`
- Must exist in Firebase Storage `books/` folder
- No path prefix needed

**tags (array, required):**
- Array of tag IDs from `tags.js`
- Always include `"new"` for new books (auto-removed after 14 days)
- Add 2-4 tags per book
- Examples: `["new", "fiction", "thriller"]`

**createdAt (string, required):**
- Format: `YYYY-MM-DD` (e.g., "2025-12-12")
- Use today's date for new books
- Used for "new" tag expiration (14 days)

**genre (string, required):**
- Main genre category
- Must match one of: Fiction, Thriller, Science Fiction, Romance, Mystery, Horror, Self-Help, Non-Fiction, History, Adventure
- Used for genre filtering

---

## Part 6: Tag Management Strategy

### 6.1 Automatic Tag Removal

The system automatically removes the `"new"` tag after 14 days:

```javascript
// In bookUtils.js
const daysSinceCreation = Math.floor(
  (new Date() - createdDate) / (1000 * 60 * 60 * 24)
);
if (daysSinceCreation > 14) {
  // Remove 'new' tag
}
```

### 6.2 Tag Selection Best Practices

**For Fiction Books:**
```javascript
tags: ["new", "fiction", "thriller"]  // Main genre + subgenre
```

**For Non-Fiction Books:**
```javascript
tags: ["new", "non-fiction", "self-help"]
```

**For Recommended Books:**
```javascript
tags: ["recommended", "fiction", "mystery"]  // Featured book
```

**For Popular Genres:**
```javascript
tags: ["new", "science-fiction", "adventure"]
```

### 6.3 Tag Combinations to Avoid

❌ Don't use: `["fiction", "non-fiction"]` - Contradictory
❌ Don't use: `["new", "new"]` - Duplicate tags
❌ Don't use: `["thriller", "mystery", "horror", "gothic"]` - Too many genre tags

✅ Do use: `["new", "recommended", "fiction"]` - Good mix
✅ Do use: `["thriller", "mystery"]` - Related subgenres

---

## Part 7: Complete Example

Here's a complete workflow for adding a new book:

### Step 1: Prepare Files
```
- Book PDF: the-silent-patient.pdf (5.2 MB)
- Cover image: book-010.jpg (142 KB, 600x900px)
```

### Step 2: Upload to Firebase
1. Go to Firebase Storage → books folder
2. Upload `the-silent-patient.pdf`
3. Verify upload successful

### Step 3: Add Cover to Project
1. Copy `book-010.jpg` to `public/covers/`
2. Verify image displays correctly

### Step 4: Add to books.js
```javascript
{
  id: "book-010",
  title: "The Silent Patient",
  author: "Alex Michaelides",
  priceINR: 0,
  description: "Alicia Berenson's life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows. One evening her husband returns home late, and Alicia shoots him five times in the face, and then never speaks another word.",
  cover: "/covers/book-010.jpg",
  file: "the-silent-patient.pdf",
  tags: ["new", "recommended", "thriller", "mystery"],
  createdAt: "2025-12-12",
  genre: "Thriller"
}
```

### Step 5: Test Locally
```bash
npm run dev
```

1. Check book appears in "New Arrivals"
2. Click book card to open modal
3. Click "Read Now" to test PDF loads
4. Click "Download" to verify download works

### Step 6: Update Credits (if needed)
If using a copyrighted cover image, add to `public/credits.txt`:

```
[IMAGE] The Silent Patient Book Cover
Author: Celadon Books / Macmillan Publishers
Source: Official Publisher
URL: https://example.com/cover-source
License: Fair Use (book promotion)
---
```

---

## Part 8: Troubleshooting

### Book doesn't appear:
- Check `books.js` syntax (commas, quotes, brackets)
- Verify `id` is unique
- Ensure file exists in Firebase Storage

### Cover not loading:
- Check file exists in `public/covers/`
- Verify filename matches `cover` field exactly (case-sensitive)
- Try hard refresh (Ctrl+Shift+R)

### PDF download fails:
- Verify Firebase config is correct in `firebase.js`
- Check Storage rules allow read access
- Ensure PDF exists in Firebase `books/` folder
- Check browser console for errors

### Tags not displaying:
- Verify tag IDs exist in `tags.js`
- Check spelling matches exactly
- Ensure `tags` is an array, not a string

### "New" tag not disappearing:
- Wait 14 days from `createdAt` date
- Verify `createdAt` format is `YYYY-MM-DD`
- Check system date/time is correct

---

## Part 9: Production Checklist

Before deploying:

- [ ] All books have valid Firebase PDF links
- [ ] All cover images exist in `public/covers/`
- [ ] All tags exist in `tags.js`
- [ ] No duplicate book IDs
- [ ] All `createdAt` dates are valid
- [ ] Firebase Storage rules are configured
- [ ] Credits updated for new images/resources
- [ ] Tested download functionality
- [ ] Tested reading mode with PDFs
- [ ] Run `npm run build` successfully

---

## Quick Reference

**Book Template:**
```javascript
{
  id: "book-XXX",
  title: "Title Here",
  author: "Author Name",
  priceINR: 0,
  description: "Description here...",
  cover: "/covers/book-XXX.jpg",
  file: "book-XXX.pdf",
  tags: ["new", "genre1", "genre2"],
  createdAt: "YYYY-MM-DD",
  genre: "MainGenre"
}
```

**Firebase Paths:**
- PDFs: `books/filename.pdf`
- Covers: `public/covers/filename.jpg`
- Storage Rules: Allow read, deny write

**Tag Categories:**
- Special: `new`, `recommended`
- Fiction: `fiction`, `science-fiction`, `romance`, `mystery`, `thriller`, `horror`, `adventure`, `gothic`
- Non-Fiction: `non-fiction`, `self-help`, `productivity`, `history`, `mythology`

---

## Need Help?

- Check browser console for errors (F12)
- Verify Firebase setup in Console
- Review existing book entries in `books.js`
- Test with a small PDF first (under 1MB)
- Check [Firebase Documentation](https://firebase.google.com/docs/storage)

---

**Last Updated:** 2025-12-12
**Version:** 1.0.0
