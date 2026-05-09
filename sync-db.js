import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, writeBatch, collection } from 'firebase/firestore';
import fs from 'fs';
import { books } from './src/data/books.js';

const env = fs.readFileSync('.env', 'utf8');
const config = {};
env.split('\n').forEach(line => {
  const [key, val] = line.split('=');
  if (key && val) config[key.trim()] = val.trim();
});

const app = initializeApp({
  apiKey: config.VITE_FIREBASE_API_KEY,
  projectId: config.VITE_FIREBASE_PROJECT_ID,
});

const db = getFirestore(app);

async function setup() {
  const batch = writeBatch(db);

  // 1. Add admin
  const adminRef = doc(db, 'admins', 'Llexx53SbyVH6TkD9AsozN1myUD3');
  batch.set(adminRef, { 
    email: 'mail.omarashidlone@gmail.com', 
    role: 'admin',
    createdAt: new Date().toISOString()
  });

  // 2. Add books
  books.forEach((book, index) => {
    const bookRef = doc(db, 'books', book.id);
    batch.set(bookRef, {
      ...book,
      order: index + 1,
      published: true
    }, { merge: true });
  });

  await batch.commit();
  console.log('Successfully added admin and synced 7 books to Firestore!');
}

setup().catch(console.error);
