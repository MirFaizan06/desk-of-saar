import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { projects as fallbackProjects } from '../data/projects';

export function useProjects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      where('published', '==', true),
      orderBy('order', 'asc')
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (!snap.empty) {
          setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        }
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Projects fetch error:', err);
        setError('Could not load projects from the server. Showing cached data.');
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  return { projects, loading, error };
}
