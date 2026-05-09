import { useEffect } from 'react';

const BASE_URL = 'https://desk-of-saar.netlify.app';

/**
 * SEOInjector — dynamically injects JSON-LD structured data into <head>
 * for every book and project loaded from Firestore.
 * Re-runs whenever the data changes (new admin additions are picked up automatically).
 */
function SEOInjector({ books = [] }) {
  useEffect(() => {
    if (books.length === 0) return;

    const bookSchemas = books.map((book) => ({
      '@type': 'Book',
      'name': book.title,
      'author': {
        '@type': 'Person',
        'name': 'Omar Rashid Lone',
        'alternateName': 'Saar',
        'url': BASE_URL,
      },
      'url': BASE_URL,
      'genre': book.genre || '',
      'inLanguage': 'en',
      'bookFormat': 'EBook',
      'isAccessibleForFree': true,
      'description': book.description || '',
      ...(book.coverUrl ? { 'image': book.coverUrl } : {}),
    }));

    const allSchemas = [...bookSchemas];
    if (allSchemas.length === 0) return;

    const jsonld = {
      '@context': 'https://schema.org',
      '@graph': allSchemas,
    };

    const existing = document.getElementById('seo-dynamic-jsonld');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'seo-dynamic-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(jsonld, null, 0);
    document.head.appendChild(script);

    return () => {
      document.getElementById('seo-dynamic-jsonld')?.remove();
    };
  }, [books]);

  return null;
}

export default SEOInjector;
