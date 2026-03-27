import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { books as fallbackBooks } from '../data/books';

export function useBooks() {
  const [books, setBooks] = useState(fallbackBooks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'books'),
      where('published', '==', true),
      orderBy('order', 'asc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          setBooks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
        setLoading(false);
      },
      () => {
        // Firestore unavailable — keep fallback data
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  return { books, loading };
}
