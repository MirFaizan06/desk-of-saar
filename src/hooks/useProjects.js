import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { projects as fallbackProjects } from '../data/projects';

export function useProjects() {
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(true);

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
      },
      () => {
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  return { projects, loading };
}
