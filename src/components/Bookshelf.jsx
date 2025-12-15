import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { tagAtlas } from '../data/tags';

export default function Bookshelf({ title, subtitle, books, onBookClick, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    accent: 'text-white',
    mystic: 'text-white'
  };

  return (
    <div className="mb-32">
      {/* Header */}
      <div className="flex items-center gap-4 mb-12">
        <motion.div
          className={`${colorClasses[color]}`}
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {icon}
        </motion.div>
        <div>
          <h2 className="text-4xl font-bold text-white mb-1 font-serif drop-shadow-lg">{title}</h2>
          <p className="text-white text-lg font-medium drop-shadow-sm">{subtitle}</p>
        </div>
      </div>

      {/* Modern Bookshelf - Clean Card Grid */}
      <div className="relative">
        {/* Subtle shelf base */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full"></div>

        {/* Books Grid - Horizontal Scrolling */}
        <div className="overflow-x-auto overflow-y-visible pb-12 px-2 scroll-smooth scrollbar-hide">
          <div className="flex gap-6 min-w-max">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                onClick={() => onBookClick(book)}
                className="relative group cursor-pointer flex-shrink-0"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                {/* Book Card - Fixed structure for alignment */}
                <motion.div
                  className="relative w-[200px] flex flex-col"
                  whileHover={{ y: -12 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  {/* Cover Container with Shadow */}
                  <div className="relative">
                    {/* Book Cover */}
                    <div className="relative h-[300px] rounded-lg overflow-hidden shadow-2xl group-hover:shadow-3xl transition-shadow duration-300 bg-white/5 backdrop-blur-sm">
                      <img
                        src={book.cover}
                        alt={book.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect width="200" height="300" fill="%238E9E93"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" fill="%23FFFFFF" font-size="16" font-family="Arial"%3EBook Cover%3C/text%3E%3C/svg%3E';
                        }}
                      />

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            className="p-4 rounded-full bg-white/95 backdrop-blur-sm shadow-2xl"
                            whileHover={{ scale: 1.1, rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <Download className="w-7 h-7 text-[#6B8E7F]" />
                          </motion.div>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <p className="text-white/90 text-xs mb-2 drop-shadow-sm">{book.author}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-white bg-white/25 px-3 py-1 rounded-full backdrop-blur-sm">
                              {book.genre}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Subtle page effect on right edge */}
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-black/20 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Realistic shadow */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[85%] h-3 bg-black/30 blur-lg rounded-full"></div>
                  </div>

                  {/* Book Info Below - Fixed height structure for alignment */}
                  <div className="mt-4 px-1 h-[120px] flex flex-col">
                    {/* Title - Fixed height container */}
                    <div className="h-[48px] mb-3">
                      <h3 className="text-white font-bold text-base leading-tight line-clamp-2 drop-shadow-md group-hover:text-[#D4AF6A] transition-colors">
                        {book.title}
                      </h3>
                    </div>

                    {/* Tags - Subtle and secondary, fixed height */}
                    <div className="h-[22px] mb-3 flex items-start gap-1.5 overflow-hidden">
                      {book.tags.slice(0, 2).map((tag) => {
                        const tagInfo = tagAtlas[tag];
                        if (!tagInfo) return null;

                        return (
                          <motion.span
                            key={tag}
                            className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/25 text-white/85 border border-white/30 shadow-sm"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                          >
                            {tagInfo.display}
                          </motion.span>
                        );
                      })}
                    </div>

                    {/* eBook badge - Always aligned at same position */}
                    <div>
                      <motion.div
                        className="inline-block bg-white/25 text-white font-semibold text-[10px] py-1.5 px-3 rounded-md border border-white/35 backdrop-blur-sm shadow-sm"
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.3)' }}
                      >
                        eBook
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Hide scrollbar CSS */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
