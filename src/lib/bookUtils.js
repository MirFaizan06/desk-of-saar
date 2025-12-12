export function updateTags(book) {
  const createdDate = new Date(book.createdAt);
  const now = new Date();
  const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24);

  if (diffInDays > 14) {
    return {
      ...book,
      tags: book.tags.filter(tag => tag !== "new")
    };
  }

  return book;
}

export function getViewCount(bookId) {
  const count = localStorage.getItem(`views_${bookId}`);
  return parseInt(count) || 0;
}

export function incrementViewCount(bookId) {
  const currentCount = getViewCount(bookId);
  localStorage.setItem(`views_${bookId}`, (currentCount + 1).toString());
}

export function getPopularityScore(book) {
  const views = getViewCount(book.id);
  return Math.log(1 + views);
}

export function getBooksWithUpdatedTags(books) {
  return books.map(updateTags);
}

export function getNewBooks(books) {
  return getBooksWithUpdatedTags(books)
    .filter(book => book.tags.includes("new"))
    .slice(0, 10);
}

export function getRecommendedBooks(books) {
  return getBooksWithUpdatedTags(books)
    .filter(book => book.tags.includes("recommended"))
    .slice(0, 10);
}

export function getPopularBooks(books) {
  return getBooksWithUpdatedTags(books)
    .sort((a, b) => getPopularityScore(b) - getPopularityScore(a))
    .slice(0, 10);
}

export function getBooksByTag(books, tag) {
  return getBooksWithUpdatedTags(books)
    .filter(book => book.tags.includes(tag));
}

export function getBooksByGenre(books, genre) {
  return getBooksWithUpdatedTags(books)
    .filter(book => book.genre === genre);
}

export function getAllGenres(books) {
  const genres = new Set(books.map(book => book.genre));
  return Array.from(genres);
}

export function getRandomBooks(books, count = 3) {
  const shuffled = [...books].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
