import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, X, Info } from 'lucide-react';
import {
  doc, getDoc, setDoc, updateDoc, increment, serverTimestamp, runTransaction,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  getUserId, canRecordView, incrementLocalViewCount,
  getUserRating, setUserRatingLocal,
} from '../lib/fingerprint';
import { getLocation } from '../lib/geo';

// ── Star display ──────────────────────────────────────────────────────────────
function StarDisplay({ rating, count }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="flex items-center justify-center gap-1 mb-4">
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
        <span className="text-[0.8rem] text-[#888] ml-2">{rating.toFixed(1)} ({count})</span>
      ) : (
        <span className="text-[0.8rem] text-[#aaa] ml-2">No ratings yet</span>
      )}
    </div>
  );
}

// ── Rating Modal ──────────────────────────────────────────────────────────────
function RatingModal({ book, onClose }) {
  const existing = getUserRating(book.id);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(existing);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

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
          // Update existing rating — adjust sum
          tx.update(ratingRef, { rating: selected });
          tx.update(bookRef, { ratingSum: increment(selected - oldRating) });
        } else {
          // First-time rating
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
    } catch (err) {
      console.error('Rating error:', err);
    } finally {
      setLoading(false);
    }
  };

  const labels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white max-w-md w-full p-8 relative animate-scale-in" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-[#888] hover:text-[#1a1a1a]">
          <X size={22} />
        </button>

        {!submitted ? (
          <>
            <h3 className="font-serif text-2xl text-[#1a1a1a] mb-2 text-center">Rate This Book</h3>
            <p className="text-[#888] text-center mb-8 text-sm">{book.title}</p>

            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHovered(star)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => setSelected(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={star <= (hovered || selected) ? 'fill-[#d4a84b] text-[#d4a84b]' : 'text-[#ddd]'}
                  />
                </button>
              ))}
            </div>

            <p className="text-center text-[#888] mb-8 text-sm h-5">
              {labels[hovered || selected]}
            </p>

            <button
              onClick={handleSubmit}
              disabled={!selected || loading}
              className={`w-full py-3 text-white font-bold uppercase tracking-wider text-sm transition-colors ${
                selected && !loading ? 'bg-[#d4a84b] hover:bg-[#c49a3d]' : 'bg-[#ddd] cursor-not-allowed'
              }`}
            >
              {loading ? 'Saving…' : existing ? 'Update Rating' : 'Submit Rating'}
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-4 text-green-500">✓</div>
            <h3 className="font-serif text-2xl text-[#1a1a1a] mb-2">Thank You!</h3>
            <p className="text-[#626262]">Your rating has been saved.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── BookCard ──────────────────────────────────────────────────────────────────
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

function BookCard({ book, onReadClick }) {
  const [showRating, setShowRating] = useState(false);
  const userRating = getUserRating(book.id);

  const rating = book.ratingCount > 0 ? (book.ratingSum / book.ratingCount) : 0;

  const handleRead = () => {
    if (book.id) recordBookView(book.id);
    onReadClick(book);
  };

  return (
    <>
      <div className="h-full flex flex-col text-center bg-white p-6 md:p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-2.5 border border-[#f0f0f0]">
        <div
          className="w-full aspect-[2/3] bg-[#333] mb-5 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:brightness-110"
          onClick={handleRead}
        >
          {book.coverUrl || book.cover ? (
            <img src={book.coverUrl || book.cover} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white font-serif text-2xl">Cover Art</span>
          )}
        </div>

        <h4 className="font-serif text-lg md:text-xl mb-2 text-[#1a1a1a]">{book.title}</h4>
        <p className="text-[0.75rem] text-[#d4a84b] font-bold tracking-wider uppercase mb-2">{book.genre}</p>

        <StarDisplay rating={rating} count={book.ratingCount || 0} />

        {book.viewCount > 0 && (
          <p className="text-[0.7rem] text-[#bbb] mb-2">{book.viewCount.toLocaleString()} views</p>
        )}

        <p className="text-[0.9rem] text-[#626262] mb-4 leading-relaxed line-clamp-3 flex-grow">
          {book.description}
        </p>

        <div className="flex gap-2 justify-center mt-auto">
          <button
            onClick={handleRead}
            className="px-4 py-2 bg-[#d4a84b] hover:bg-[#c49a3d] text-white uppercase text-[0.7rem] tracking-[1.5px] font-bold transition-colors whitespace-nowrap"
          >
            Read Now
          </button>
          <button
            onClick={() => setShowRating(true)}
            className="px-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] uppercase text-[0.7rem] tracking-[1.5px] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors whitespace-nowrap"
          >
            {userRating ? `Rated ${userRating}★` : 'Rate'}
          </button>
        </div>
      </div>

      {showRating && createPortal(
        <RatingModal book={book} onClose={() => setShowRating(false)} />,
        document.body
      )}
    </>
  );
}

export default BookCard;
