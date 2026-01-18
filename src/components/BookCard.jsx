import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Star, X, Info } from 'lucide-react';

function StarRating({ rating, count }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center justify-center gap-1 mb-4">
      <div className="flex gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={16} className="fill-[#d4a84b] text-[#d4a84b]" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star size={16} className="text-[#ddd]" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star size={16} className="fill-[#d4a84b] text-[#d4a84b]" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={16} className="text-[#ddd]" />
        ))}
      </div>
      <span className="text-[0.8rem] text-[#888] ml-2">
        {rating.toFixed(1)} ({count})
      </span>
      <div className="relative group ml-1">
        <Info size={14} className="text-[#aaa] cursor-help hover:text-[#d4a84b] transition-colors" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-[#1a1a1a] text-white text-[0.7rem] rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-10 shadow-lg">
          Ratings are currently for display only while we're building something special!
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]"></div>
        </div>
      </div>
    </div>
  );
}

function RatingModal({ book, onClose, onSubmit }) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedRating > 0) {
      onSubmit(selectedRating);
      setSubmitted(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-lg max-w-md w-full p-8 relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#888] hover:text-[#1a1a1a]"
        >
          <X size={24} />
        </button>

        {!submitted ? (
          <>
            <h3 className="font-serif text-2xl text-[#1a1a1a] mb-2 text-center">Rate This Book</h3>
            <p className="text-[#888] text-center mb-4">{book.title}</p>

            <div className="flex items-center justify-center gap-2 bg-[#fff8e6] border border-[#f0e4c4] rounded-lg px-4 py-3 mb-6">
              <Info size={16} className="text-[#d4a84b] flex-shrink-0" />
              <p className="text-[0.75rem] text-[#8a7a4a]">
                Ratings are being set up! Your feedback will be saved once we finish building this feature.
              </p>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setSelectedRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`${
                      star <= (hoveredStar || selectedRating)
                        ? 'fill-[#d4a84b] text-[#d4a84b]'
                        : 'text-[#ddd]'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            <p className="text-center text-[#626262] mb-6 text-sm">
              {selectedRating === 0 && 'Select a rating'}
              {selectedRating === 1 && 'Poor'}
              {selectedRating === 2 && 'Fair'}
              {selectedRating === 3 && 'Good'}
              {selectedRating === 4 && 'Very Good'}
              {selectedRating === 5 && 'Excellent'}
            </p>

            <button
              onClick={handleSubmit}
              disabled={selectedRating === 0}
              className={`w-full py-3 text-white font-bold uppercase tracking-wider text-sm transition-colors ${
                selectedRating > 0
                  ? 'bg-[#d4a84b] hover:bg-[#c49a3d]'
                  : 'bg-[#ddd] cursor-not-allowed'
              }`}
            >
              Submit Rating
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <div className="text-4xl mb-4">&#10003;</div>
            <h3 className="font-serif text-2xl text-[#1a1a1a] mb-2">Thank You!</h3>
            <p className="text-[#626262] mb-6">Your rating has been recorded.</p>
            <p className="text-[#888] text-sm">(Ratings will be saved to Firebase in a future update)</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BookCard({ book, onReadClick }) {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(null);

  const handleRatingSubmit = (rating) => {
    setUserRating(rating);
  };

  return (
    <>
      <div className="h-full flex flex-col text-center bg-white p-6 md:p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-2.5 border border-[#f0f0f0]">
        <div
          className="w-full aspect-[2/3] bg-[#333] mb-5 flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:brightness-110"
          onClick={() => onReadClick(book)}
        >
          {book.cover ? (
            <img
              src={book.cover}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-serif text-2xl">Cover Art</span>
          )}
        </div>
        <h4 className="font-serif text-lg md:text-xl mb-2 text-[#1a1a1a]">{book.title}</h4>
        <p className="text-[0.75rem] text-[#d4a84b] font-bold tracking-wider uppercase mb-2">
          {book.genre}
        </p>
        <StarRating rating={book.rating} count={book.ratingCount} />
        <p className="text-[0.9rem] text-[#626262] mb-4 leading-relaxed line-clamp-3 flex-grow">
          {book.description}
        </p>
        <div className="flex gap-2 justify-center mt-auto">
          <button
            onClick={() => onReadClick(book)}
            className="px-4 py-2 bg-[#d4a84b] hover:bg-[#c49a3d] text-white uppercase text-[0.7rem] tracking-[1.5px] font-bold transition-colors whitespace-nowrap"
          >
            Read Now
          </button>
          <button
            onClick={() => setShowRatingModal(true)}
            className="px-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] uppercase text-[0.7rem] tracking-[1.5px] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors whitespace-nowrap"
          >
            {userRating ? `Rated ${userRating}★` : 'Rate'}
          </button>
        </div>
      </div>

      {showRatingModal && createPortal(
        <RatingModal
          book={book}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleRatingSubmit}
        />,
        document.body
      )}
    </>
  );
}

export default BookCard;
