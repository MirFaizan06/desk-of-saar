import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center z-10">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Main Title */}
          <motion.div className="space-y-6">
            <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.1] font-serif text-white drop-shadow-lg">
              <span className="block">Welcome to</span>
              <span className="block text-white/95 tracking-wide">Desk of Saar</span>
            </h1>

            {/* Decorative Underline */}
            <motion.div
              className="h-1 bg-white/70 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: '280px' }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </motion.div>

          {/* Tagline */}
          <motion.p
            className="text-2xl lg:text-3xl text-white/95 leading-relaxed max-w-xl font-serif italic drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            "A room without books is like a body without a soul."
          </motion.p>

          <motion.p
            className="text-lg lg:text-xl text-white/90 leading-relaxed max-w-xl font-medium drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            Explore our curated collection of timeless books. Download instantly, no sign-up required.
          </motion.p>

          {/* Start Reading Button with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <motion.button
              className="group relative overflow-hidden glass-strong text-white font-bold text-lg py-5 px-10 rounded-2xl shadow-medium hover:shadow-strong transition-all"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                document.getElementById('books-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <BookOpen className="w-6 h-6" />
                <span>Start Reading</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>

              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Right Side - Book Cover Image */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50, rotateY: 90 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.4, duration: 1, type: "spring" }}
        >
          <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center">
            {/* Book Cover Image */}
            <motion.div
              className="relative max-w-[280px] sm:max-w-[320px] lg:max-w-[400px] w-full px-4"
              initial={{ opacity: 0, scale: 0.8, rotateY: -30 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
              whileHover={{ scale: 1.05, rotateY: 5, transition: { duration: 0.3 } }}
            >
              <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white/20">
                <img
                  src="/covers/This is Why I DON'T Read Romance.jpg"
                  alt="This is Why I Don't Read Romance"
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '3/4' }}
                />
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Floating shadow */}
              <motion.div
                className="absolute -bottom-2 sm:-bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-6 sm:h-8 bg-black/30 blur-2xl rounded-full"
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </motion.div>

        {/* Commented out: Book Stack Illustration */}
        {/* <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50, rotateY: 90 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.4, duration: 1, type: "spring" }}
        >
          <div className="relative w-full h-[600px] flex items-end justify-center">
            <div className="relative flex flex-col-reverse items-center">
              {[
                { color: 'linear-gradient(135deg, #E57373 0%, #F06292 100%)', width: 180, height: 40, delay: 0 },
                { color: 'linear-gradient(135deg, #BA68C8 0%, #9575CD 100%)', width: 200, height: 45, delay: 0.1 },
                { color: 'linear-gradient(135deg, #4FC3F7 0%, #4DD0E1 100%)', width: 170, height: 42, delay: 0.2 },
                { color: 'linear-gradient(135deg, #81C784 0%, #66BB6A 100%)', width: 190, height: 38, delay: 0.3 },
                { color: 'linear-gradient(135deg, #FFD54F 0%, #FFCA28 100%)', width: 175, height: 44, delay: 0.4 },
                { color: 'linear-gradient(135deg, #FF8A65 0%, #FF7043 100%)', width: 185, height: 41, delay: 0.5 },
                { color: 'linear-gradient(135deg, #A1887F 0%, #8D6E63 100%)', width: 195, height: 39, delay: 0.6 },
                { color: 'linear-gradient(135deg, #90A4AE 0%, #78909C 100%)', width: 165, height: 43, delay: 0.7 },
              ].map((book, i) => (
                <motion.div
                  key={i}
                  className="rounded-lg shadow-2xl relative mb-1"
                  style={{
                    background: book.color,
                    width: `${book.width}px`,
                    height: `${book.height}px`,
                    transform: `rotate(${(Math.random() - 0.5) * 3}deg)`,
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: book.delay,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{
                    scale: 1.05,
                    zIndex: 10,
                    transition: { duration: 0.2 }
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-between px-4">
                    <div className="w-1 h-full bg-white/20 rounded-full"></div>
                    <div className="w-1 h-full bg-white/20 rounded-full"></div>
                  </div>
                  <div className="absolute inset-0 border-2 border-white/10 rounded-lg pointer-events-none"></div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full h-2 bg-black/20 blur-sm rounded-full"></div>
                </motion.div>
              ))}
            </div>
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-3 rounded-full"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                boxShadow: '0 2px 20px rgba(0,0,0,0.1)'
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            />
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-white/40"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 10}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        </motion.div> */}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs text-white/70 tracking-widest">SCROLL TO EXPLORE</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-white/50 flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1 h-3 rounded-full bg-white/70 mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}
