import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, X, ExternalLink } from 'lucide-react';
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
import { useTheme } from '../context/ThemeContext';

// ── Star display ──────────────────────────────────────────────────────────────
function StarDisplay({ rating, count }) {
  const safe = isNaN(rating) || rating < 0 ? 0 : Math.min(5, rating);
  const full = Math.floor(safe);
  const half = safe % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[...Array(full)].map((_, i) => (
          <Star key={`f${i}`} size={16} className="fill-[#d4a84b] text-[#d4a84b]" />
        ))}
        {half && (
          <div className="relative">
            <Star size={16} className="text-[#ddd]" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={16} className="fill-[#d4a84b] text-[#d4a84b]" />
            </div>
          </div>
        )}
        {[...Array(empty)].map((_, i) => (
          <Star key={`e${i}`} size={16} className="text-[#ddd]" />
        ))}
      </div>
      {count > 0 ? (
        <span className="text-[0.8rem] text-[#888]">{safe.toFixed(1)} ({count})</span>
      ) : (
        <span className="text-[0.8rem] text-[#aaa]">No ratings yet</span>
      )}
    </div>
  );
}

// ── Interactive Star Picker ───────────────────────────────────────────────────
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
      <div className="flex items-center gap-2 text-green-600 text-sm font-bold">
        <span>✓</span> Rating saved — thank you!
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-[0.75rem] uppercase tracking-[2px] text-[#aaa] font-bold">
        {existing ? 'Update Your Rating' : 'Rate This Book'}
      </p>
      <div className="flex items-center gap-3">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHovered(star)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setSelected(star)}
              className="transition-transform hover:scale-110 p-0.5"
            >
              <Star
                size={24}
                className={star <= (hovered || selected) ? 'fill-[#d4a84b] text-[#d4a84b]' : 'text-[#ddd]'}
              />
            </button>
          ))}
        </div>
        <span className="text-[0.8rem] text-[#888] min-w-[5rem]">
          {labels[hovered || selected]}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!selected || loading}
          className={`px-4 py-1.5 text-white text-[0.7rem] uppercase tracking-wider font-bold transition-colors ${
            selected && !loading ? 'bg-[#d4a84b] hover:bg-[#c49a3d]' : 'bg-[#ddd] cursor-not-allowed'
          }`}
        >
          {loading ? '...' : 'Submit'}
        </button>
      </div>
    </div>
  );
}

// ── Book Detail Modal ─────────────────────────────────────────────────────────
function BookDetailModal({ book, onClose }) {
  const { dark } = useTheme();
  const rating = book.ratingCount > 0 ? (book.ratingSum / book.ratingCount) : 0;
  const driveUrl = book.driveUrl || '';

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto p-4 py-10 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-[700px] relative animate-scale-in ${dark ? 'bg-[#1c1a17]' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center transition-colors shadow-sm ${
            dark ? 'bg-[#2a2824]/90 hover:bg-[#2a2824] text-[#8a857d] hover:text-[#eae6e0]' : 'bg-white/90 hover:bg-white text-[#888] hover:text-[#1a1a1a]'
          }`}
        >
          <X size={20} />
        </button>

        {/* Cover image — large */}
        <div className={`w-full flex items-center justify-center overflow-hidden ${dark ? 'bg-[#141210]' : 'bg-[#f5f5f5]'}`}
          style={{ maxHeight: '420px' }}
        >
          {book.coverUrl || book.cover ? (
            <img
              src={book.coverUrl || book.cover}
              alt={book.title}
              className="w-full h-full object-contain"
              style={{ maxHeight: '420px' }}
            />
          ) : (
            <div className="py-20 text-[#aaa] font-serif text-2xl">No Cover</div>
          )}
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-6">
          {/* Title + genre */}
          <div>
            <p className="text-[0.7rem] text-[#c9a14e] font-bold tracking-[2px] uppercase mb-2">
              {book.genre}
            </p>
            <h2 className={`font-serif text-2xl md:text-3xl leading-snug ${dark ? 'text-[#eae6e0]' : 'text-[#1a1a1a]'}`}>
              {book.title}
            </h2>
            <p className={`text-[0.85rem] mt-1 ${dark ? 'text-[#6a655d]' : 'text-[#888]'}`}>by {book.author}</p>
          </div>

          {/* Rating + views row */}
          <div className={`flex items-center gap-6 py-3 border-t border-b ${dark ? 'border-[#2a2824]' : 'border-[#f0f0f0]'}`}>
            <StarDisplay rating={rating} count={book.ratingCount || 0} />
            {book.viewCount > 0 && (
              <span className={`text-[0.8rem] ${dark ? 'text-[#5a5650]' : 'text-[#bbb]'}`}>
                {book.viewCount.toLocaleString()} views
              </span>
            )}
          </div>

          {/* Description */}
          <div className="space-y-4">
            {(book.description || '').split('\n\n').map((para, i) => (
              <p key={i} className={`text-[0.95rem] leading-relaxed ${dark ? 'text-[#a8a39d]' : 'text-[#626262]'}`}>{para}</p>
            ))}
          </div>

          {/* Action: Read on Drive */}
          {driveUrl && (
            <div className="pt-2">
              <a
                href={driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#c9a14e] hover:bg-[#b8903f] text-white uppercase text-[0.75rem] tracking-[1.5px] font-bold transition-colors"
              >
                <ExternalLink size={15} />
                Read on Google Drive
              </a>
            </div>
          )}

          {/* Inline rating */}
          <div className={`pt-4 border-t ${dark ? 'border-[#2a2824]' : 'border-[#f0f0f0]'}`}>
            <StarPicker book={book} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BookCard (compact: cover + title only) ────────────────────────────────────
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

function BookCard({ book }) {
  const { dark } = useTheme();
  const [showDetail, setShowDetail] = useState(false);

  const handleClick = () => {
    if (book.id) recordBookView(book.id);
    setShowDetail(true);
  };

  return (
    <>
      <div
        onClick={handleClick}
        className={`group cursor-pointer transition-all duration-600 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2.5 rounded-2xl h-full flex flex-col overflow-hidden ${
          dark
            ? 'bg-[#131110] hover:shadow-[0_20px_60px_rgba(184,150,78,0.06)]'
            : 'bg-white hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)]'
        }`}
      >
        {/* Cover */}
        <div className="p-2 pb-0">
          <div className={`relative w-full aspect-[2/3] overflow-hidden rounded-xl ${
            dark ? 'bg-[#0c0b09]' : 'bg-[#f0ece5]'
          }`}>
            {book.coverUrl || book.cover ? (
              <img
                src={book.coverUrl || book.cover}
                alt={book.title}
                className="w-full h-full object-cover transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05]"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#2a2520] to-[#111]">
                <span className="text-white/30 font-display text-base italic" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>No Cover</span>
              </div>
            )}
            {/* Hover vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-600" />
          </div>
        </div>

        {/* Info */}
        <div className="px-3 py-3.5 text-center mt-auto">
          <h4 className={`font-display text-[0.92rem] md:text-[1rem] leading-snug font-[400] clamp-2 transition-colors duration-500 ${
            dark ? 'text-[#d0cbc3] group-hover:text-[#b8964e]' : 'text-[#222] group-hover:text-[#b8964e]'
          }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {book.title}
          </h4>
          <p className={`text-[0.52rem] font-medium tracking-[2px] uppercase mt-1.5 clamp-1 transition-colors duration-500 ${
            dark ? 'text-[#4a4540] group-hover:text-[#b8964e]/60' : 'text-[#ccc] group-hover:text-[#b8964e]/70'
          }`}>
            {book.genre}
          </p>
        </div>
      </div>

      {showDetail && createPortal(
        <BookDetailModal book={book} onClose={() => setShowDetail(false)} />,
        document.body
      )}
    </>
  );
}

export default BookCard;

