import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

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

async function check() {
  const snap = await getDocs(collection(db, 'books'));
  console.log('Total books:', snap.docs.length);
  snap.docs.forEach(doc => {
    console.log(doc.id, '=>', doc.data().title);
  });
}
check().catch(console.error);
