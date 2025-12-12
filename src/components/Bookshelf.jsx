import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { tagAtlas } from '../data/tags';

export default function Bookshelf({ title, subtitle, books, onBookClick, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'text-white',
    secondary: 'text-white',
    accent: 'text-white',
    mystic: 'text-white'
  };

  return (
    <div className="mb-20">
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
          <p className="text-white/90 text-lg font-medium drop-shadow-sm">{subtitle}</p>
        </div>
      </div>

      {/* Bookshelf with standing books */}
      <div className="relative">
        {/* White ledge/shelf line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40 rounded-full shadow-lg"></div>
        <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-black/10 to-transparent rounded-full blur-sm"></div>

        {/* Books standing upright */}
        <div className="flex gap-4 overflow-x-auto pb-8 px-4 scroll-smooth">
          {books.map((book, index) => (
            <motion.div
              key={book.id}
              onClick={() => onBookClick(book)}
              className="relative group cursor-pointer flex-shrink-0"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -15, scale: 1.05 }}
            >
              {/* Book standing upright */}
              <div className="relative w-[180px] h-[280px]">
                {/* Book cover */}
                <div className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl transform perspective-1000">
                  <img
                    src={book.cover}
                    alt={book.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="180" height="280"%3E%3Crect width="180" height="280" fill="%238E9E93"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" fill="%23FFFFFF" font-size="16" font-family="Arial"%3EBook Cover%3C/text%3E%3C/svg%3E';
                    }}
                  />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 drop-shadow-md">{book.title}</h3>
                      <p className="text-white/90 text-xs mb-3 drop-shadow-sm">{book.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                          {book.genre}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Download icon overlay */}
                  <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.2 }}
                  >
                    <div className="p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-glow">
                      <Download className="w-6 h-6 text-[#6B8E7F]" />
                    </div>
                  </motion.div>
                </div>

                {/* Book spine edge effect */}
                <div className="absolute -left-1 top-0 bottom-0 w-2 bg-gradient-to-r from-black/30 to-transparent rounded-l-lg"></div>
                <div className="absolute -right-1 top-0 bottom-0 w-2 bg-gradient-to-l from-black/20 to-transparent rounded-r-lg"></div>

                {/* Shadow under book */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[160px] h-4 bg-black/30 blur-lg rounded-full"></div>

                {/* Tags */}
                <div className="absolute -top-3 -right-2 z-10">
                  {book.tags.slice(0, 1).map((tag) => {
                    const tagInfo = tagAtlas[tag];
                    if (!tagInfo) return null;

                    return (
                      <motion.div
                        key={tag}
                        className={`px-3 py-1.5 rounded-full text-xs ${tagInfo.color} backdrop-blur-sm border border-white/20 shadow-lg`}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 + 0.2 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <span className="font-semibold">{tagInfo.display}</span>
                      </motion.div>
                    );
                  })}
                </div>

                {/* FREE badge */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-10">
                  <motion.div
                    className="bg-white text-[#6B8E7F] font-bold text-xs py-1 px-3 rounded-full shadow-lg"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 + 0.3 }}
                  >
                    FREE
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
}
