import { motion } from 'framer-motion';
import { Download, Eye } from 'lucide-react';
import { tagAtlas } from '../data/tags';

export default function BookCard({ book, onClick }) {
  return (
    <motion.div
      onClick={() => onClick(book)}
      className="relative group cursor-pointer min-w-[260px] max-w-[260px]"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="bg-bg-card backdrop-blur-sm rounded-2xl overflow-hidden shadow-soft group-hover:shadow-medium group-hover:shadow-glow/20 transition-all duration-300 border border-primary/10"
        whileHover={{ scale: 1.02 }}
      >
        <div className="relative h-[360px] bg-bg-soft overflow-hidden">
          {/* Book Cover - Lazy loaded for performance */}
          <img
            src={book.cover}
            alt={book.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="260" height="360"%3E%3Crect width="260" height="360" fill="%231E293B"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" fill="%238B5CF6" font-size="20" font-family="Arial"%3EBook Cover%3C/text%3E%3C/svg%3E';
            }}
          />

          {/* Tags - Only show "new" and "recommended" tags on home page */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {book.tags.filter(tag => tag === 'new' || tag === 'recommended').slice(0, 1).map((tag) => {
              const tagInfo = tagAtlas[tag];
              if (!tagInfo) return null;

              return (
                <motion.div
                  key={tag}
                  className={`px-3 py-1.5 rounded-full text-xs ${tagInfo.color} backdrop-blur-sm border border-white/10`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span>{tagInfo.display}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Overlay with Description */}
          <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <motion.div
            className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-bg to-transparent"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          >
            <p className="text-sm text-text-light line-clamp-2">{book.description}</p>
          </motion.div>

          {/* Download Button Overlay */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <div className="p-3 rounded-full gradient-primary shadow-glow">
              <Download className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        </div>

        {/* Book Info */}
        <div className="p-5 bg-bg-card">
          <h3 className="font-bold text-lg mb-1 text-text-light line-clamp-1 group-hover:text-primary transition-colors">
            {book.title}
          </h3>
          <p className="text-text-dim text-sm mb-3">{book.author}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                {book.genre}
              </span>
              {book.views && (
                <div className="flex items-center gap-1 text-xs text-text-dim">
                  <Eye className="w-3 h-3" />
                  <span>{book.views}</span>
                </div>
              )}
            </div>
            <span className="bg-primary text-white font-semibold text-xs py-1 px-2.5 rounded-md">eBook</span>
          </div>
        </div>
      </motion.div>

      {/* Border Glow Effect */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl border border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        initial={{ scale: 0.98 }}
        whileHover={{ scale: 1 }}
      />

      {/* Floating Download Badge */}
      <motion.div
        className="absolute -top-2 -right-2 z-10"
        animate={{ 
          y: [0, -5, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shadow-glow">
          <Download className="w-4 h-4 text-white" />
        </div>
      </motion.div>
    </motion.div>
  );
}