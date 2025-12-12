import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Sparkles, Download, Users, Clock } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/10"
            style={{
              width: `${300 + i * 150}px`,
              height: `${300 + i * 150}px`,
            }}
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: {
                duration: 40 + i * 10,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 3,
                repeat: Infinity,
                delay: i * 0.5,
              },
            }}
          />
        ))}
        
        {/* Floating Icons - Reduced for performance */}
        {[BookOpen, Download].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${20 + i * 40}%`,
              top: `${25 + i * 20}%`,
            }}
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              y: {
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <Icon className="w-8 h-8 text-primary/20" />
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center z-10">
        {/* Left Side - Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3 glass px-6 py-3 rounded-full border border-primary/30"
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <div className="relative">
              <Sparkles className="w-5 h-5 text-primary" />
              <motion.div
                className="absolute -inset-1 rounded-full bg-primary/20 blur-sm"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <span className="text-text-light text-sm font-medium">
              Free eBook Collection
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.div className="space-y-4">
            <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] hero-title">
              <span className="block text-text-light">Discover Your Next</span>
              <span className="gradient-text block">
                Adventure
              </span>
            </h1>
            
            {/* Animated Underline */}
            <motion.div
              className="h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: '200px' }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-xl text-text-light leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            Explore my free eBook collection. Download instantly with no sign-up required.
            From fiction to non-fiction, find your next favorite book today.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-wrap items-center gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <motion.button
              className="group relative overflow-hidden gradient-primary text-white font-semibold py-4 px-8 rounded-xl shadow-medium hover:shadow-strong transition-all"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                document.getElementById('books-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="relative z-10 flex items-center gap-3">
                <BookOpen className="w-5 h-5" />
                <span>Browse Books</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.8 }}
              />
            </motion.button>

            <motion.button
              className="glass text-text-light font-semibold py-4 px-8 rounded-xl shadow-soft hover:shadow-medium border border-primary/20 hover:border-primary/40 transition-all"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <span className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" />
                <span>How It Works</span>
              </span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 pt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            {[
              { value: '100+', label: 'Free Books', icon: <BookOpen className="w-6 h-6" />, color: 'text-primary' },
              { value: '24/7', label: 'Available', icon: <Clock className="w-6 h-6" />, color: 'text-secondary' },
              { value: 'No', label: 'Sign-up', icon: <Users className="w-6 h-6" />, color: 'text-accent' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${stat.color} bg-opacity-10`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-text-dim">{stat.label}</div>
                
                {/* Hover line */}
                <div className="h-0.5 w-0 mx-auto bg-gradient-to-r from-transparent via-current to-transparent group-hover:w-16 transition-all duration-300 mt-2"></div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right Side - Book Display */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, x: 50, rotateY: 90 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ delay: 0.4, duration: 1, type: "spring" }}
        >
          <div className="relative w-full h-[500px] flex items-center justify-center">
            {/* Stacked Books */}
            <div className="relative">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="absolute w-64 h-80 rounded-xl shadow-2xl overflow-hidden"
                  style={{
                    transform: `translate(${i * 20}px, ${i * 15}px) rotate(${i * 2}deg)`,
                    zIndex: 3 - i,
                  }}
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3 + i,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5
                  }}
                >
                  <div className={`w-full h-full ${
                    i === 0 ? 'gradient-primary' : 
                    i === 1 ? 'gradient-secondary' : 'gradient-accent'
                  } relative`}>
                    {/* Book Details */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-1 bg-white/50 rounded-full mb-3"></div>
                        <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-white text-lg font-bold mb-2">FREE EBOOK</h3>
                        <div className="w-16 h-0.5 bg-white/50 mx-auto mb-2"></div>
                        <p className="text-white/70 text-sm">Instant Download</p>
                      </div>
                      
                      <div className="flex justify-end">
                        <BookOpen className="w-8 h-8 text-white/50" />
                      </div>
                    </div>
                    
                    {/* Embossed Effect */}
                    <div className="absolute inset-0 border-2 border-white/10 rounded-xl pointer-events-none"></div>
                  </div>
                  
                  {/* Glow Effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 blur-xl rounded-3xl -z-10"></div>
                </motion.div>
              ))}
            </div>

            {/* Floating Download Icons */}
            {[
              { color: 'primary', delay: 0 },
              { color: 'secondary', delay: 0.3 },
              { color: 'accent', delay: 0.6 }
            ].map((item, index) => (
              <motion.div
                key={index}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center shadow-glow ${
                  item.color === 'primary' ? 'gradient-primary' :
                  item.color === 'secondary' ? 'gradient-secondary' : 'gradient-accent'
                }`}
                style={{
                  left: `${15 + index * 25}%`,
                  top: `${5 + index * 30}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: 360,
                }}
                transition={{
                  y: {
                    duration: 2,
                    repeat: Infinity,
                    delay: item.delay,
                    ease: "easeInOut"
                  },
                  rotate: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                  }
                }}
              >
                <Download className="w-5 h-5 text-white" />
                
                {/* Pulsing ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-white/30"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: item.delay }}
                />
              </motion.div>
            ))}
          </div>

          {/* Bottom Decorative Line */}
          <motion.div
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 h-px w-64 bg-gradient-to-r from-transparent via-primary to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-xs text-text-dim tracking-widest">SCROLL TO EXPLORE</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-primary/50 flex justify-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-1 h-3 rounded-full gradient-primary mt-2"></div>
        </motion.div>
      </motion.div>
    </section>
  );
}