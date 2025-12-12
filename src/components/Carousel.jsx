import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BookCard from './BookCard';

export default function Carousel({ title, subtitle, books, onBookClick, icon, color = 'primary', autoScroll = false }) {
  const scrollContainerRef = useRef(null);
  const autoScrollInterval = useRef(null);

  useEffect(() => {
    // Auto-scroll functionality
    if (autoScroll && scrollContainerRef.current) {
      autoScrollInterval.current = setInterval(() => {
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          const maxScroll = container.scrollWidth - container.clientWidth;

          // If at the end, scroll back to start
          if (container.scrollLeft >= maxScroll - 10) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            // Scroll forward by a small amount
            container.scrollBy({ left: 1, behavior: 'auto' });
          }
        }
      }, 30); // Slow, smooth scrolling (30ms intervals)

      return () => {
        if (autoScrollInterval.current) {
          clearInterval(autoScrollInterval.current);
        }
      };
    }
  }, [autoScroll]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const colorClasses = {
    primary: 'text-primary',
    secondary: 'text-secondary',
    accent: 'text-accent',
    mystic: 'text-mystic'
  };

  return (
    <div className="mb-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            className={`${colorClasses[color]}`}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            {icon}
          </motion.div>
          <div>
            <h2 className="text-3xl font-bold text-text mb-1">{title}</h2>
            <p className="text-text-dim">{subtitle}</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <motion.button
            onClick={() => scroll('left')}
            className="p-3 rounded-xl glass border border-primary/20 hover:border-primary/40 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 text-text-light" />
          </motion.button>
          <motion.button
            onClick={() => scroll('right')}
            className="p-3 rounded-xl glass border border-primary/20 hover:border-primary/40 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5 text-text-light" />
          </motion.button>
        </div>
      </div>

      {/* Scrollable Container */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <BookCard book={book} onClick={onBookClick} />
            </motion.div>
          ))}
        </div>

        {/* Fade edge - right side only for dark mode */}
        <div className="absolute right-0 top-0 bottom-4 w-20 bg-gradient-to-l from-bg to-transparent pointer-events-none dark:block hidden"></div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
