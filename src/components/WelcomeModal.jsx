import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Sparkles, Check } from 'lucide-react';

export default function WelcomeModal({ onClose, onAutoScrollChange, onModalStateChange }) {
  const [autoScroll, setAutoScroll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  // Notify parent about modal state changes
  useEffect(() => {
    if (onModalStateChange) {
      onModalStateChange(isOpen);
    }
  }, [isOpen, onModalStateChange]);

  const handleClose = () => {
    // Save preferences
    localStorage.setItem('hasSeenWelcome', 'true');
    localStorage.setItem('autoScrollCarousels', autoScroll.toString());

    // Notify parent component
    if (onAutoScrollChange) {
      onAutoScrollChange(autoScroll);
    }

    setIsOpen(false);
    if (onClose) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-bg/95 backdrop-blur-xl z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong border border-primary/30 rounded-3xl max-w-2xl w-full my-auto shadow-2xl shadow-primary/20 relative max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Scrollable Content Container */}
              <div className="p-4 sm:p-6 md:p-8">
              {/* Animated Background Particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: ['#8B5CF6', '#10B981', '#F59E0B'][i % 3],
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>

              {/* Close Button */}
              <motion.button
                onClick={handleClose}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-xl glass border-2 border-primary/40 hover:border-primary transition-all z-20 shadow-lg"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-primary stroke-[2.5]" />
              </motion.button>

              {/* Content */}
              <div className="relative z-10">
                {/* Logo/Icon */}
                <motion.div
                  className="flex justify-center mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center shadow-glow">
                      <BookOpen className="w-10 h-10 text-white" />
                    </div>
                    {/* Orbiting particles */}
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 rounded-full bg-accent"
                        style={{
                          left: '50%',
                          top: '50%',
                        }}
                        animate={{
                          x: Math.cos((i * 120 * Math.PI) / 180) * 50,
                          y: Math.sin((i * 120 * Math.PI) / 180) * 50,
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'linear',
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Welcome Text */}
                <motion.div
                  className="text-center mb-6 md:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-3 md:mb-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                    <span>Welcome to Desk of Saar!</span>
                    <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
                  </h2>
                  <p className="text-text-light text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto px-2">
                    Discover and download hundreds of free books. No sign-up required,
                    just pure reading pleasure at your fingertips.
                  </p>
                </motion.div>

                {/* Features */}
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 md:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {[
                    { icon: '📚', title: '100+ Books', desc: 'Growing collection' },
                    { icon: '⚡', title: 'Instant Access', desc: 'No registration' },
                    { icon: '🎯', title: 'All Free', desc: 'Forever free' },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="text-center p-3 sm:p-4 rounded-xl glass border border-primary/20"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="text-2xl sm:text-3xl mb-2">{feature.icon}</div>
                      <h3 className="font-bold text-text-light mb-1 text-sm sm:text-base">{feature.title}</h3>
                      <p className="text-xs sm:text-sm text-text-dim">{feature.desc}</p>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Auto-scroll Option */}
                <motion.div
                  className="mb-6 md:mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="glass border-2 border-primary/40 rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg">
                    <label className="flex items-start sm:items-center gap-3 sm:gap-4 cursor-pointer group">
                      <div className="relative flex-shrink-0 mt-1 sm:mt-0">
                        <input
                          type="checkbox"
                          checked={autoScroll}
                          onChange={(e) => setAutoScroll(e.target.checked)}
                          className="sr-only"
                        />
                        <motion.div
                          className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-xl border-3 transition-all duration-300 flex items-center justify-center ${
                            autoScroll
                              ? 'border-primary bg-gradient-primary shadow-glow scale-110'
                              : 'border-text-light bg-bg-soft hover:border-primary hover:scale-105'
                          }`}
                          whileHover={{ scale: autoScroll ? 1.1 : 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {autoScroll && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            >
                              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[3]" />
                            </motion.div>
                          )}
                        </motion.div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-text-light group-hover:text-primary transition-colors text-sm sm:text-base md:text-lg">
                          Auto-scroll Book Carousels?
                        </div>
                        <div className="text-xs sm:text-sm text-text-dim mt-1">
                          Carousels will automatically scroll through books at a gentle pace
                        </div>
                      </div>
                    </label>
                  </div>
                </motion.div>

                {/* Get Started Button */}
                <motion.div
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <motion.button
                    onClick={handleClose}
                    className="group relative overflow-hidden gradient-primary text-white font-bold py-3 sm:py-3.5 md:py-4 px-8 sm:px-10 md:px-12 rounded-xl shadow-lg hover:shadow-2xl transition-all w-full sm:w-auto"
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg">
                      Get Started
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                    </span>

                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>
                </motion.div>
              </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
