import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { books as fallbackBooks } from '../data/books';

export function useBooks() {
  const [books, setBooks] = useState(fallbackBooks);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'books'),
      orderBy('order', 'asc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          setBooks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
        // If Firestore returns empty, keep using fallback — no error
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.warn('Books: Firestore unavailable, using local data.', err.message);
        // Silently fall back — no error banner
        setLoading(false);
        setError(null);
      }
    );

    return unsub;
  }, []);

  return { books, loading, error };
}
