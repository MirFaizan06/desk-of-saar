import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, TrendingUp, Grid, MessageCircle, Search, X, BookOpen, Clock, Flame } from 'lucide-react';
import Hero from '../components/Hero';
import Carousel from '../components/Carousel';
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
      
      {/* Floating Particles - Reduced for performance */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B'][i % 3],
              left: `${(i * 16) % 100}%`,
              top: `${(i * 14) % 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <Hero />

      <div id="books-section" className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-20">
          {/* Category Filters */}
          <motion.div
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
                  className={`flex items-center gap-3 px-5 py-3 rounded-xl font-medium transition-all ${
                    activeCategory === category.id
                      ? 'gradient-primary text-white shadow-glow'
                      : 'glass text-text-light hover:text-primary hover:shadow-medium'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {category.icon}
                  <span>{category.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeCategory === category.id ? 'bg-white/20' : 'bg-primary/10'
                  }`}>
                    {category.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            className="mb-16 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 blur-xl opacity-50"></div>
              <div className="relative flex items-center glass-strong rounded-2xl p-2 border border-primary/30">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                <input
                  type="text"
                  placeholder="Search books by title, author, or genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 bg-transparent text-text placeholder:text-text-dim/70 focus:outline-none focus:ring-0 text-lg"
                  id="search-input"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-primary/10 transition-colors"
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="w-5 h-5 text-text-dim" />
                  </motion.button>
                )}
              </div>
              
              {/* Search hints */}
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
                    className="text-xs px-3 py-1.5 rounded-full glass border border-primary/20 hover:border-primary/40 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {hint}
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Search Results */}
          {displayBooks !== null && (
            <motion.div
              className="mb-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-3">
                  {displayBooks.length} {displayBooks.length === 1 ? 'Book Found' : 'Books Found'}
                </h2>
                <p className="text-text-light text-lg">
                  Results for: <span className="text-accent">"{searchQuery}"</span>
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
                    <Search className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                    <h3 className="text-2xl font-bold text-text-light mb-3">
                      No Books Found
                    </h3>
                    <p className="text-text-dim mb-6">
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
                    <Carousel
                      title="New Arrivals"
                      subtitle="Recently added books"
                      books={newBooks}
                      onBookClick={handleBookClick}
                      icon={<Sparkles className="w-8 h-8 text-mystic" />}
                      color="mystic"
                      autoScroll={autoScrollCarousels}
                    />
                  </motion.div>
                )}

                {/* Recommended */}
                {recommendedBooks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Carousel
                      title="Recommended"
                      subtitle="Curated selections"
                      books={recommendedBooks}
                      onBookClick={handleBookClick}
                      icon={<Star className="w-8 h-8 text-accent" />}
                      color="accent"
                      autoScroll={autoScrollCarousels}
                    />
                  </motion.div>
                )}

                {/* Popular */}
                {popularBooks.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Carousel
                      title="Popular Reads"
                      subtitle="Most downloaded books"
                      books={popularBooks}
                      onBookClick={handleBookClick}
                      icon={<Flame className="w-8 h-8 text-primary" />}
                      color="primary"
                      autoScroll={autoScrollCarousels}
                    />
                  </motion.div>
                )}

                {/* Genre Exploration */}
                <motion.div
                  className="mt-20"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="text-center mb-12">
                    {/* Decorative Image with Icon Overlay */}
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

                    {/* Divider */}
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
                        <Carousel
                          title={genre}
                          subtitle={`${genreBooks.length} books`}
                          books={genreBooks}
                          onBookClick={handleBookClick}
                          icon={<BookOpen className="w-7 h-7 text-secondary" />}
                          color={['primary', 'secondary', 'accent', 'mystic'][index % 4]}
                          autoScroll={autoScrollCarousels}
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
                        
                        {/* Shimmer effect */}
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

                {/* Call to Action */}
                <motion.div
                  className="mt-20"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="relative overflow-hidden rounded-3xl border border-primary/30 shadow-2xl">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <img
                        src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1200&q=80"
                        alt="Person reading in a cozy library"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/90 to-bg/70"></div>
                    </div>

                    <div className="relative glass-strong p-12 text-center">
                      <MessageCircle className="w-20 h-20 mx-auto mb-6 text-primary" />
                      
                      <h2 className="text-3xl font-bold text-text mb-6">
                        Can't Find What You're Looking For?
                      </h2>

                      <p className="text-text-light text-lg mb-8 max-w-3xl mx-auto leading-relaxed">
                        We're constantly adding new books. Check back soon or contact us with suggestions!
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-4">
                        <motion.button
                          className="gradient-primary text-white font-bold py-4 px-10 rounded-xl shadow-glow hover:shadow-2xl transition-all"
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
        className="fixed bottom-8 right-8 z-40 p-4 rounded-full gradient-primary shadow-glow"
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