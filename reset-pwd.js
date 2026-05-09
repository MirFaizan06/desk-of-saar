import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
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

const auth = getAuth(app);

sendPasswordResetEmail(auth, 'mail.omarashidlone@gmail.com')
  .then(() => console.log('Password reset email sent!'))
  .catch(console.error);
