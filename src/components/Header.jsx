import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Menu, X, Moon, Sun, Search, MessageCircle, Mail } from 'lucide-react';

export default function Header({ currentPage, onNavigate, isHidden = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'faqs', label: 'FAQs', icon: <MessageCircle className="w-4 h-4" /> },
    { id: 'contact', label: 'Contact', icon: <Mail className="w-4 h-4" /> }
  ];

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isScrolled
            ? 'glass-strong shadow-strong border-b border-primary/30 py-3'
            : 'bg-transparent py-5'
        }`}
        initial={{ y: -100 }}
        animate={{ y: isHidden ? -100 : 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      >
        {/* Animated top border */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"
          animate={{
            backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo/Title */}
            <motion.div
              className="flex items-center gap-3 cursor-pointer group"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onNavigate('home')}
            >
              <motion.div
                className="relative w-12 h-12 bg-white/25 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 360 }}
                animate={{
                  rotate: [0, 5, 0, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{
                  rotate: { duration: 0.6 },
                  scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </motion.div>
              
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white tracking-wider font-serif">
                  Desk of Saar
                </span>
                <motion.span
                  className="text-xs text-white/70 font-serif tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Books Collection
                </motion.span>
              </div>
            </motion.div>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-6 py-3 rounded-xl font-medium transition-all group ${
                    currentPage === item.id
                      ? 'text-white'
                      : 'text-white/90 hover:text-white'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Background glow for active item */}
                  {currentPage === item.id && (
                    <motion.div
                      className="absolute inset-0 rounded-xl bg-white/25 backdrop-blur-md shadow-lg -z-10"
                      layoutId="headerNavIndicator"
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}

                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>

                    {/* Hover effect line */}
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent"
                      initial={false}
                      animate={{
                        width: currentPage === item.id ? '80%' : '0%',
                        x: '-50%'
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </motion.button>
              ))}
            </nav>

            {/* Right side - Search Button */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                onClick={() => {
                  const searchInput = document.getElementById('search-input');
                  if (searchInput) {
                    searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setTimeout(() => searchInput.focus(), 500);
                  }
                }}
                className="p-3 rounded-xl glass border border-white/30 hover:border-white/50 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Search className="w-5 h-5 text-white" />
              </motion.button>
              
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-3 rounded-xl glass border border-primary/20 shadow-soft"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
              animate={{ rotate: isMobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-primary" />
              ) : (
                <Menu className="w-6 h-6 text-text-light" />
              )}
              
              {/* Pulsing dot */}
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 rounded-full gradient-primary"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>
          </div>
        </div>

        {/* Animated bottom border on scroll */}
        {isScrolled && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-bg/90 backdrop-blur-xl"
              initial={{ backdropFilter: 'blur(0px)' }}
              animate={{ backdropFilter: 'blur(8px)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Animated particles - Reduced for performance */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B'][i % 3],
                    left: `${(i * 10) % 100}%`,
                    top: `${(i * 8) % 100}%`,
                  }}
                  animate={{
                    y: [0, -80, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 2,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>

            {/* Menu Panel */}
            <motion.nav
              className="absolute top-24 right-4 left-4 glass-strong rounded-2xl p-6 shadow-strong border border-primary/30"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25 }}
            >
              {/* Menu header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <span className="font-serif text-lg text-text-light">Navigation</span>
                </div>
                <motion.button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-text-light" />
                </motion.button>
              </div>

              {/* Menu Items */}
              <div className="space-y-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full text-left py-4 px-6 rounded-xl transition-all flex items-center gap-4 ${
                      currentPage === item.id
                        ? 'gradient-primary text-white shadow-glow'
                        : 'text-text-light hover:bg-primary/10'
                    }`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="flex items-center gap-2">
                      {item.icon}
                      <span className="text-lg">{item.label}</span>
                    </span>
                    
                    {currentPage === item.id && (
                      <motion.div
                        className="ml-auto"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-primary/20 text-center">
                <p className="text-xs text-text-dim font-serif tracking-widest">
                  Browse our free book collection
                </p>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}