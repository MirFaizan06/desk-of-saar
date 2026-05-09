import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, X, ExternalLink, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import {
  doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, runTransaction,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  getUserId, canRecordView, incrementLocalViewCount,
  getUserRating, setUserRatingLocal,
} from '../lib/fingerprint';
import { getLocation } from '../lib/geo';
import { useToast } from '../context/ToastContext';

/* ── Helper: parse genres (handles both array and string) ─────────────────── */
function parseGenres(genre) {
  if (!genre) return [];
  if (Array.isArray(genre)) return genre;
  return genre.split(/[·,]/).map(g => g.trim()).filter(Boolean);
}

/* ── Star Display ─────────────────────────────────────────────────────────── */
function StarDisplay({ rating, count }) {
  const safe = isNaN(rating) || rating < 0 ? 0 : Math.min(5, rating);
  const full = Math.floor(safe);
  const half = safe % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {[...Array(full)].map((_, i) => (
          <Star key={`f${i}`} size={14} className="fill-[var(--color-kaki)] text-[var(--color-kaki)]" />
        ))}
        {half && (
          <div className="relative">
            <Star size={14} className="text-[var(--color-kinu)]" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={14} className="fill-[var(--color-kaki)] text-[var(--color-kaki)]" />
            </div>
          </div>
        )}
        {[...Array(empty)].map((_, i) => (
          <Star key={`e${i}`} size={14} className="text-[var(--color-kinu)]" />
        ))}
      </div>
      {count > 0 ? (
        <span className="text-[0.75rem] text-[var(--color-hai)]">{safe.toFixed(1)} ({count})</span>
      ) : (
        <span className="text-[0.75rem] text-[var(--color-hai-light)]">No ratings yet</span>
      )}
    </div>
  );
}

/* ── Interactive Star Picker ──────────────────────────────────────────────── */
function StarPicker({ book, onRated }) {
  const { showToast } = useToast();
  const existing = getUserRating(book.id);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(existing);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleSubmit = async () => {
    if (!selected) return;
    setLoading(true);
    try {
      const uid = getUserId();
      const ratingId = `${book.id}_${uid}`;
      const ratingRef = doc(db, 'ratings', ratingId);
      const bookRef = doc(db, 'books', book.id);

      const existingSnap = await getDoc(ratingRef);
      const oldRating = existingSnap.exists() ? existingSnap.data().rating : 0;

      await runTransaction(db, async (tx) => {
        if (existingSnap.exists()) {
          tx.update(ratingRef, { rating: selected });
          tx.update(bookRef, { ratingSum: increment(selected - oldRating) });
        } else {
          tx.set(ratingRef, {
            bookId: book.id,
            uid,
            rating: selected,
            createdAt: serverTimestamp(),
          });
          tx.update(bookRef, {
            ratingSum: increment(selected),
            ratingCount: increment(1),
          });
        }
      });

      setUserRatingLocal(book.id, selected);
      setSubmitted(true);
      if (onRated) onRated();
    } catch (err) {
      console.error('Rating error:', err);
      showToast('Could not save your rating. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center gap-2 text-[var(--color-kaki)] text-sm font-semibold">
        <span>✓</span> Rating saved — thank you!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[0.7rem] uppercase tracking-[2px] text-[var(--color-hai)] font-semibold">
        {existing ? 'Update Your Rating' : 'Rate This Book'}
      </p>
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
              className="transition-transform hover:scale-125 p-0.5"
            >
              <Star
                size={22}
                className={star <= (hovered || selected)
                  ? 'fill-[var(--color-kaki)] text-[var(--color-kaki)]'
                  : 'text-[var(--color-kinu)]'
                }
              />
            </button>
          ))}
        </div>
        <span className="text-[0.78rem] text-[var(--color-hai)] min-w-[4rem]">
          {labels[hovered || selected]}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className={`px-5 py-2 text-white text-[0.68rem] uppercase tracking-[1.5px] font-bold transition-all duration-300 rounded-sm ${
            selected && !loading
              ? 'bg-[var(--color-kaki)] hover:bg-[var(--color-kaki-deep)] hover:-translate-y-0.5'
              : 'bg-[var(--color-kinu)] cursor-not-allowed text-[var(--color-hai)]'
          }`}
        >
          {loading ? '...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BOOK DETAIL MODAL — Spirited Away / Studio Ghibli Text Layout
   ─────────────────────────────────────────────────────────────────────────
   Layout reference (Image 1):
   ┌─────────────────────────────────────────────────────────────────────┐
   │  Nav bar (About Studio · Movie List · Merchandise)        ☰       │
   │                                                                     │
   │  2001                              ┌─────────────────────┐         │
   │                                    │                     │         │
   │  Spirited                          │  [Character Image]  │         │
   │  Away                              │                     │  desc   │
   │                                    │                     │  text   │
   │  ▶ WATCH TRAILER   IMDB            └─────────────────────┘         │
   │                                                                     │
   │  ← My Neighbour Totoro             Castle In The Sky →             │
   └─────────────────────────────────────────────────────────────────────┘
   ═══════════════════════════════════════════════════════════════════════ */
function BookDetailModal({ book, onClose, books = [] }) {
  const rating = book.ratingCount > 0 ? (book.ratingSum / book.ratingCount) : 0;
  const driveUrl = book.driveUrl || '';
  const genres = parseGenres(book.genre);
  const coverSrc = book.coverUrl || book.cover || '';

  // Navigation between books
  const currentIdx = books.findIndex(b => b.id === book.id);
  const prevBook = currentIdx > 0 ? books[currentIdx - 1] : null;
  const nextBook = currentIdx < books.length - 1 ? books[currentIdx + 1] : null;
  const [navBook, setNavBook] = useState(null);

  if (navBook) {
    return <BookDetailModal book={navBook} onClose={onClose} books={books} />;
  }

  return (
    <div
      className="fixed inset-0 z-50 animate-fade-in"
      onClick={onClose}
    >
      {/* Blurred background from cover */}
      <div className="absolute inset-0 overflow-hidden">
        {coverSrc && (
          <img src={coverSrc} alt="" className="w-full h-full object-cover scale-110 blur-3xl opacity-25" />
        )}
        <div className="absolute inset-0 bg-[var(--color-shiro)]/85" />
      </div>

      {/* Main content container */}
      <div
        className="relative z-10 w-full h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="fixed top-6 right-6 z-50 w-11 h-11 flex items-center justify-center bg-[var(--color-sumi)]/80 hover:bg-[var(--color-kaki)] text-white rounded-full transition-all duration-400 hover:rotate-90 backdrop-blur-sm"
        >
          <X size={18} />
        </button>

        {/* ──── SPIRITED AWAY LAYOUT ──── */}
        <div className="min-h-screen flex flex-col">

          {/* Top nav area — genre tags */}
          <div className="container pt-8 pb-4 anim-enter-down" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center gap-4 text-[0.68rem] uppercase tracking-[3px] text-[var(--color-hai)] font-medium">
              {genres.map((g, i) => (
                <span key={i} className="hover:text-[var(--color-kaki)] transition-colors cursor-default">
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Main body: title left, image center-right, description far right */}
          <div className="flex-1 container flex flex-col lg:flex-row items-stretch gap-8 py-8">

            {/* LEFT: Year + Large Title + Actions (like "2001 / Spirited Away") */}
            <div className="flex-1 flex flex-col justify-center max-w-xl">
              {/* Author as year-like label */}
              <p className="text-[0.75rem] text-[var(--color-hai-light)] mb-3 anim-enter-up" style={{ animationDelay: '0.15s' }}>
                {book.author}
              </p>

              {/* Title — massive, cinematic, like "Spirited Away" */}
              <h1
                className="text-6xl md:text-7xl lg:text-[5.5rem] font-bold text-[var(--color-sumi)] leading-[0.92] mb-8 anim-enter-up"
                style={{ fontFamily: 'var(--font-display)', animationDelay: '0.25s' }}
              >
                {book.title}
              </h1>

              {/* Actions row — like "WATCH TRAILER / IMDB" */}
              <div className="flex flex-wrap items-center gap-4 anim-enter-up" style={{ animationDelay: '0.4s' }}>
                {driveUrl ? (
                  <a
                    href={driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 px-7 py-3.5 bg-[var(--color-sumi)] hover:bg-[var(--color-kaki)] text-white uppercase text-[0.68rem] tracking-[2px] font-bold transition-all duration-500 hover:-translate-y-0.5 hover:shadow-lg rounded-sm group"
                  >
                    <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <ExternalLink size={12} />
                    </span>
                    Read Book
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 px-7 py-3.5 border border-[var(--color-kinu)] text-[var(--color-hai-light)] uppercase text-[0.68rem] tracking-[2px] font-bold rounded-sm">
                    Coming Soon
                  </span>
                )}

                {/* Stats badge */}
                <div className="flex items-center gap-4">
                  <StarDisplay rating={rating} count={book.ratingCount || 0} />
                  {book.viewCount > 0 && (
                    <span className="flex items-center gap-1.5 text-[0.75rem] text-[var(--color-hai-light)]">
                      <Eye size={13} /> {book.viewCount.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Rating section */}
              <div className="mt-10 pt-6 border-t border-[var(--color-kinu)] anim-enter-up" style={{ animationDelay: '0.5s' }}>
                <StarPicker book={book} />
              </div>
            </div>

            {/* CENTER-RIGHT: Cover Image (like the character in Spirited Away) */}
            <div className="lg:w-[40%] flex items-center justify-center anim-enter-right" style={{ animationDelay: '0.3s' }}>
              {coverSrc ? (
                <div className="relative">
                  <img
                    src={coverSrc}
                    alt={book.title}
                    className="w-full max-w-sm lg:max-w-md h-auto max-h-[75vh] object-contain shadow-2xl"
                    style={{ borderRadius: '3px' }}
                  />
                  {/* Subtle glow behind cover */}
                  <div className="absolute -inset-4 bg-[var(--color-kaki)]/5 blur-3xl rounded-full -z-10" />
                </div>
              ) : (
                <div className="w-64 h-96 bg-[var(--color-kami)] flex items-center justify-center rounded-sm">
                  <span className="text-xl italic text-[var(--color-hai-light)]" style={{ fontFamily: 'var(--font-display)' }}>
                    No Cover
                  </span>
                </div>
              )}
            </div>

            {/* FAR RIGHT: Description text (like the synopsis in Spirited Away) */}
            <div className="lg:w-[22%] flex flex-col justify-center anim-enter-up" style={{ animationDelay: '0.45s' }}>
              {(book.description || '').split('\n\n').map((para, i) => (
                <p key={i} className="text-[0.82rem] leading-[1.9] text-[var(--color-hai)] mb-4">
                  {para}
                </p>
              ))}

              {/* "Director: Hayao Miyazaki" equivalent */}
              <div className="mt-6 pt-4 border-t border-[var(--color-kinu)]">
                <p className="text-[0.68rem] uppercase tracking-[2px] text-[var(--color-kaki)] font-semibold">
                  Written by:
                </p>
                <p className="text-[0.85rem] font-bold text-[var(--color-sumi)] mt-1">
                  {book.author}
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Nav — prev/next like "← My Neighbour Totoro / Castle In The Sky →" */}
          <div className="border-t border-[var(--color-kinu)] bg-[var(--color-shiro)]/90 backdrop-blur-sm">
            <div className="container flex items-center justify-between h-16">
              {prevBook ? (
                <button
                  onClick={() => setNavBook(prevBook)}
                  className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[2px] font-semibold text-[var(--color-hai)] hover:text-[var(--color-kaki)] transition-colors group"
                >
                  <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  <span className="hidden sm:inline">{prevBook.title}</span>
                  <span className="sm:hidden">Previous</span>
                </button>
              ) : <div />}

              {nextBook ? (
                <button
                  onClick={() => setNavBook(nextBook)}
                  className="flex items-center gap-2 text-[0.72rem] uppercase tracking-[2px] font-semibold text-[var(--color-hai)] hover:text-[var(--color-kaki)] transition-colors group"
                >
                  <span className="hidden sm:inline">{nextBook.title}</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              ) : <div />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BOOK CARD — Grid Card (4 per row)
   Clean cover image + title + author below
   ═══════════════════════════════════════════════════════════════════════════ */
async function recordBookView(bookId) {
  if (!canRecordView(bookId)) return;
  try {
    const uid = getUserId();
    const location = await getLocation();
    await setDoc(
      doc(db, 'view_logs', crypto.randomUUID()),
      {
        itemId: bookId,
        itemType: 'book',
        uid,
        country: location.country,
        city: location.city,
        countryCode: location.countryCode,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    );
    await updateDoc(doc(db, 'books', bookId), { viewCount: increment(1) });
    incrementLocalViewCount(bookId);
  } catch (err) {
    console.error('View tracking error:', err);
  }
}

function BookCard({ book, index = 0, books = [] }) {
  const [showDetail, setShowDetail] = useState(false);
  const genres = parseGenres(book.genre);

  const handleClick = () => {
    if (book.id) recordBookView(book.id);
    setShowDetail(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className="group cursor-pointer relative bg-[var(--color-kami)]/50 overflow-hidden transition-all duration-700 hover:shadow-xl hover:-translate-y-1"
        style={{ borderRadius: '6px' }}
      >
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={book.coverUrl || book.cover || '/saar_img.jpeg'}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
          />
          {/* Hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-sumi)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Genre badges on hover */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
            {genres.slice(0, 3).map((g, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-white/90 text-[var(--color-sumi)] text-[0.58rem] uppercase tracking-[1.5px] font-bold rounded-sm backdrop-blur-sm"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Number */}
          <div className="absolute top-4 left-4 text-[0.6rem] tracking-[3px] uppercase font-bold text-white/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            {String(index + 1).padStart(2, '0')}
          </div>
        </div>

        {/* Text below cover */}
        <div className="p-4 pb-5">
          <h3
            className="text-[0.95rem] font-bold text-[var(--color-sumi)] leading-snug mb-1 group-hover:text-[var(--color-kaki)] transition-colors duration-400 clamp-2"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {book.title}
          </h3>
          <p className="text-[0.72rem] text-[var(--color-hai)] font-medium">
            {book.author}
          </p>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-[var(--color-kaki)] group-hover:w-full transition-all duration-700" />
      </div>

      {showDetail && createPortal(
        <BookDetailModal book={book} onClose={() => setShowDetail(false)} books={books} />,
        document.body
      )}
    </>
  );
}

export default BookCard;
