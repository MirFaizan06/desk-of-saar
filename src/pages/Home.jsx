import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, TrendingUp, Grid, MessageCircle, Search, X, BookOpen, Clock, Flame, Rocket } from 'lucide-react';
import Hero from '../components/Hero';
import Bookshelf from '../components/Bookshelf';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import HeroBackground from '../components/HeroBackground';
import WelcomeModal from '../components/WelcomeModal';
import { books } from '../data/books';
import {
  getNewBooks,
  getRecommendedBooks,
  getPopularBooks,
  getAllGenres,
  getBooksByGenre,
  getBooksWithUpdatedTags
} from '../lib/bookUtils';

export default function Home({ onModalChange }) {
  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [showAllGenres, setShowAllGenres] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [scrollY, setScrollY] = useState(0);
  const [autoScrollCarousels, setAutoScrollCarousels] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (onModalChange) {
      // Hide header if either book modal or welcome modal is open
      onModalChange(isModalOpen || isWelcomeModalOpen);
    }
  }, [isModalOpen, isWelcomeModalOpen, onModalChange]);

  useEffect(() => {
    // Load auto-scroll preference from localStorage
    const savedAutoScroll = localStorage.getItem('autoScrollCarousels');
    if (savedAutoScroll === 'true') {
      setAutoScrollCarousels(true);
    }
  }, []);

  const handleAutoScrollChange = (enabled) => {
    setAutoScrollCarousels(enabled);
  };

  const handleWelcomeModalStateChange = (isOpen) => {
    setIsWelcomeModalOpen(isOpen);
  };

  const newBooks = useMemo(() => getNewBooks(books), []);
  const recommendedBooks = useMemo(() => getRecommendedBooks(books), []);
  const popularBooks = useMemo(() => getPopularBooks(books), []);
  const genres = useMemo(() => getAllGenres(books), []);
  const allBooks = useMemo(() => getBooksWithUpdatedTags(books), []);

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedBook(null), 300);
  };

  const visibleGenres = showAllGenres ? genres : genres.slice(0, 4);

  // Filter books based on search query
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return allBooks;
    const query = searchQuery.toLowerCase();
    return allBooks.filter(book =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.genre.toLowerCase().includes(query) ||
      book.description.toLowerCase().includes(query)
    );
  }, [searchQuery, allBooks]);

  const displayBooks = searchQuery.trim() ? filteredBooks : null;

  // Category filter
  const categories = [
    { id: 'all', label: 'All Books', icon: <BookOpen className="w-5 h-5" />, count: allBooks.length },
    { id: 'new', label: 'New Arrivals', icon: <Sparkles className="w-5 h-5" />, count: newBooks.length },
    { id: 'popular', label: 'Popular', icon: <Flame className="w-5 h-5" />, count: popularBooks.length },
    { id: 'recommended', label: 'Recommended', icon: <Star className="w-5 h-5" />, count: recommendedBooks.length }
  ];

  const filteredByCategory = useMemo(() => {
    if (activeCategory === 'all') return allBooks;
    if (activeCategory === 'new') return newBooks;
    if (activeCategory === 'popular') return popularBooks;
    if (activeCategory === 'recommended') return recommendedBooks;
    return allBooks;
  }, [activeCategory, allBooks, newBooks, popularBooks, recommendedBooks]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <HeroBackground scrollY={scrollY} />
      
      {/* Floating Particles - Sage green theme */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              left: `${(i * 12) % 100}%`,
              top: `${(i * 14) % 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 5 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      <Hero />

      <div id="books-section" className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Category Filters - Commented out */}
          {/* <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-wrap gap-3 justify-center mb-8">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl font-semibold transition-all drop-shadow-md ${
                    activeCategory === category.id
                      ? 'bg-white/35 text-white shadow-xl backdrop-blur-md border-2 border-white/40'
                      : 'glass text-white hover:bg-white/25 hover:shadow-medium border border-white/20'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {category.icon}
                  <span className="drop-shadow-sm">{category.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeCategory === category.id ? 'bg-white/25' : 'bg-white/15'
                  }`}>
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div> */}

          {/* Search Bar - Commented out */}
          {/* <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-white/10 blur-xl"></div>
              <div className="relative flex items-center glass-strong rounded-2xl p-2 border border-white/30">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                <input
                  type="text"
                  placeholder="Search books by title, author, or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-transparent text-white placeholder:text-white/70 focus:outline-none focus:ring-0 text-lg font-medium drop-shadow-sm"
                  id="search-input"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-white/10 transition-colors"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-white/70" />
                  </motion.button>
                )}
              </div>

              <motion.div
                className="flex flex-wrap justify-center gap-3 mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {['Fiction', 'Science', 'History', 'Romance', 'Mystery'].map((hint) => (
                  <motion.button
                    key={hint}
                    onClick={() => setSearchQuery(hint)}
                    className="text-xs px-3 py-1.5 rounded-full glass border border-white/30 hover:border-white/50 text-white font-semibold transition-colors drop-shadow-sm"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {hint}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div> */}

          {/* Search Results */}
          {displayBooks !== null && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                  {displayBooks.length} {displayBooks.length === 1 ? 'Book Found' : 'Books Found'}
                </h2>
                <p className="text-white/90 text-lg font-medium drop-shadow-sm">
                  Results for: <span className="text-white font-bold">"{searchQuery}"</span>
                </p>
                
                {/* Divider */}
                <div className="flex items-center justify-center my-6">
                  <div className="h-px w-32 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                  <BookOpen className="w-6 h-6 mx-4 text-primary" />
                  <div className="h-px w-32 bg-gradient-to-l from-transparent via-primary to-transparent"></div>
                </div>
              </div>
              
              {displayBooks.length > 0 ? (
                <motion.div 
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                  layout
                >
                  {displayBooks.map((book) => (
                    <motion.div
                      key={book.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      whileHover={{ y: -8 }}
                    >
                      <BookCard book={book} onClick={handleBookClick} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="text-center py-16 glass rounded-2xl border border-primary/30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="max-w-md mx-auto">
                    <Search className="w-16 h-16 text-white mx-auto mb-4 opacity-70 drop-shadow-lg" />
                    <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-md">
                      No Books Found
                    </h3>
                    <p className="text-white/80 mb-6 text-base font-medium drop-shadow-sm">
                      We couldn't find any books matching your search.
                      Try different keywords or browse all books.
                    </p>
                    <motion.button
                      onClick={() => setSearchQuery('')}
                      className="gradient-primary text-white font-bold py-3 px-6 rounded-xl shadow-medium hover:shadow-glow transition-all"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      View All Books
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Show regular content only when not searching */}
          {!displayBooks && (
            <>
              {/* Decorative Image Section - Reading Inspiration */}
              <motion.div
                className="mb-20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-primary/20">
                  <img
                    src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&q=80"
                    alt="Cozy reading corner with books"
                    className="w-full h-64 md:h-80 object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-center">
                    <motion.h3
                      className="text-3xl md:text-4xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      Start Your Reading Journey
                    </motion.h3>
                    <motion.p
                      className="text-text-light text-lg"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                    >
                      Explore our curated collections below
                    </motion.p>
                  </div>
                </div>
              </motion.div>

              {/* Featured Collections */}
              <div className="space-y-20">
                {/* New Arrivals */}
                {newBooks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                  >
                    <Bookshelf
                      title="New Arrivals"
                      subtitle="Recently added books"
                      books={newBooks}
                      onBookClick={handleBookClick}
                      icon={<Sparkles className="w-8 h-8 text-white" />}
                      color="mystic"
                    />
                  </motion.div>
                )}

                {/* Recommended - Commented out */}
                {/* {recommendedBooks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Bookshelf
                      title="Recommended"
                      subtitle="Curated selections"
                      books={recommendedBooks}
                      onBookClick={handleBookClick}
                      icon={<Star className="w-8 h-8 text-white" />}
                      color="accent"
                    />
                  </motion.div>
                )} */}

                {/* Popular - Commented out */}
                {/* {popularBooks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Bookshelf
                      title="Popular Reads"
                      subtitle="Most downloaded books"
                      books={popularBooks}
                      onBookClick={handleBookClick}
                      icon={<Flame className="w-8 h-8 text-white" />}
                      color="primary"
                    />
                  </motion.div>
                )} */}

                {/* Genre Exploration - Commented out */}
                {/*
                <motion.div
                  className="mt-20"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center mb-12">
                    // Decorative Image with Icon Overlay
                    <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl border border-primary/20 max-w-4xl mx-auto">
                      <img
                        src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1200&q=80"
                        alt="Library shelves with books"
                        className="w-full h-48 md:h-64 object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="inline-flex items-center justify-center p-6 rounded-2xl glass-strong border border-primary/30 backdrop-blur-xl">
                          <Grid className="w-12 h-12 text-primary" />
                        </div>
                      </div>
                    </div>

                    <h2 className="text-4xl font-bold text-text mb-4">
                      Browse by Genre
                    </h2>
                    <p className="text-text-light text-lg max-w-2xl mx-auto">
                      Explore books across different genres
                    </p>

                    // Divider
                    <div className="relative my-10">
                      <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <div className="w-12 h-12 rounded-full border-2 border-primary/50 flex items-center justify-center bg-bg-card">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {visibleGenres.map((genre, index) => {
                    const genreBooks = getBooksByGenre(filteredByCategory, genre);
                    if (genreBooks.length === 0) return null;

                    return (
                      <motion.div
                        key={genre}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Bookshelf
                          title={genre}
                          subtitle={`${genreBooks.length} books`}
                          books={genreBooks}
                          onBookClick={handleBookClick}
                          icon={<BookOpen className="w-7 h-7 text-white" />}
                          color={['primary', 'secondary', 'accent', 'mystic'][index % 4]}
                        />
                      </motion.div>
                    );
                  })}

                  {!showAllGenres && genres.length > 4 && (
                    <div className="text-center mt-12">
                      <motion.button
                        className="group relative overflow-hidden gradient-primary text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-2xl transition-all"
                        whileHover={{ scale: 1.05, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowAllGenres(true)}
                      >
                        <span className="relative z-10 flex items-center gap-3">
                          View More Genres ({genres.length - 4} more)
                          <Sparkles className="w-5 h-5" />
                        </span>

                        // Shimmer effect
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
                */}

                {/* Manga's Coming Soon Section */}
                <motion.div
                  className="mt-32 mb-20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative overflow-hidden rounded-3xl border border-white/30 shadow-2xl min-h-[500px]">
                    {/* Blurred Anime/Manga Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1600&q=80"
                        alt="Anime and Manga collection"
                        className="w-full h-full object-cover blur-sm"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?w=1600&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#4D2C54]/95 via-[#4D2C54]/80 to-[#4D2C54]/60"></div>
                    </div>

                    {/* Glass Card Overlay */}
                    <div className="relative glass-strong p-16 text-center min-h-[500px] flex flex-col items-center justify-center">
                      <motion.div
                        animate={{
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Rocket className="w-24 h-24 mx-auto mb-8 text-white" />
                      </motion.div>

                      <motion.h2
                        className="text-5xl md:text-6xl font-bold text-white mb-6 font-serif"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                      >
                        Manga's Coming Soon
                      </motion.h2>

                      <motion.div
                        className="h-1 w-32 bg-white/60 rounded-full mx-auto mb-8"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      />

                      <motion.p
                        className="text-white/90 text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                      >
                        We're working on bringing you an amazing collection of manga.
                        Get ready to dive into exciting new worlds of Japanese storytelling, from action-packed adventures to heartwarming slice-of-life tales!
                      </motion.p>

                      {/* Animated circles */}
                      <div className="flex gap-3 justify-center">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-4 h-4 rounded-full bg-white/80"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              delay: i * 0.2,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div
                  className="mt-20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative overflow-hidden rounded-3xl border border-white/30 shadow-2xl">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80"
                        alt="Person reading in a cozy library"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#4D2C54]/95 via-[#4D2C54]/80 to-[#4D2C54]/70"></div>
                    </div>

                    <div className="relative glass-strong p-12 text-center">
                      <MessageCircle className="w-20 h-20 mx-auto mb-6 text-white" />

                      <h2 className="text-3xl font-bold text-white mb-6">
                        Can't Find What You're Looking For?
                      </h2>

                      <p className="text-white/90 text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                        We're constantly adding new books. Check back soon or contact us with suggestions!
                      </p>

                      <div className="flex flex-wrap justify-center gap-4">
                        <motion.button
                          className="glass-strong text-white font-bold py-4 px-10 rounded-xl shadow-lg hover:shadow-2xl transition-all border border-white/30"
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                        >
                          <span className="flex items-center gap-3">
                            Back to Top
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                          </span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      <motion.button
        className="fixed bottom-8 right-8 z-40 p-4 rounded-full glass-strong shadow-lg border border-white/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: scrollY > 500 ? 1 : 0, y: scrollY > 500 ? 0 : 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>

      <BookModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <WelcomeModal
        onAutoScrollChange={handleAutoScrollChange}
        onModalStateChange={handleWelcomeModalStateChange}
      />
    </div>
  );
}