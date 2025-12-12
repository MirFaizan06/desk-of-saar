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
    <div className="mb-24">
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

      {/* 3D Bookshelf Container */}
      <div className="relative px-4">
        {/* Wooden shelf background */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-b from-[#8B7355] to-[#6D5A45] rounded-lg shadow-2xl">
          {/* Wood grain texture effect */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent"></div>
          </div>
          {/* Shelf edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          {/* Shelf bottom shadow */}
          <div className="absolute -bottom-2 left-4 right-4 h-4 bg-black/40 blur-xl rounded-full"></div>
        </div>

        {/* Books Container with 3D Perspective */}
        <div
          className="relative overflow-x-auto pb-16 scroll-smooth"
          style={{ perspective: '1200px' }}
        >
          <div className="flex gap-2 min-w-max px-2">
            {books.map((book, index) => (
              <motion.div
                key={book.id}
                onClick={() => onBookClick(book)}
                className="relative group cursor-pointer flex-shrink-0"
                initial={{ opacity: 0, y: 50, rotateY: -15 }}
                whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.03,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{
                  y: -20,
                  scale: 1.08,
                  rotateY: 5,
                  zIndex: 50,
                  transition: { duration: 0.3 }
                }}
                style={{
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Book with 3D effect */}
                <div className="relative w-[170px] h-[260px]" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Main book cover */}
                  <div
                    className="absolute inset-0 rounded-r-lg overflow-hidden shadow-2xl"
                    style={{
                      transform: 'translateZ(12px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.4), -4px 0 12px rgba(0,0,0,0.3)'
                    }}
                  >
                    <img
                      src={book.cover}
                      alt={book.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="170" height="260"%3E%3Crect width="170" height="260" fill="%238E9E93"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" fill="%23FFFFFF" font-size="16" font-family="Arial"%3EBook Cover%3C/text%3E%3C/svg%3E';
                      }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-white font-bold text-sm mb-1 line-clamp-2 drop-shadow-md">{book.title}</h3>
                        <p className="text-white text-xs mb-3 drop-shadow-sm">{book.author}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            {book.genre}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Download icon overlay */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20"
                      whileHover={{ scale: 1.2 }}
                    >
                      <div className="p-3 rounded-full bg-white/95 backdrop-blur-sm shadow-2xl">
                        <Download className="w-6 h-6 text-[#6B8E7F]" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Book Spine (3D left side) */}
                  <div
                    className="absolute left-0 top-0 w-[18px] h-full bg-gradient-to-r from-black/60 via-black/30 to-transparent rounded-l-lg"
                    style={{
                      transform: 'rotateY(-90deg) translateZ(-9px)',
                      transformOrigin: 'left center',
                      boxShadow: 'inset -2px 0 8px rgba(0,0,0,0.5)'
                    }}
                  ></div>

                  {/* Book Top Edge (3D) */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[12px] bg-gradient-to-b from-white/10 to-transparent"
                    style={{
                      transform: 'rotateX(90deg) translateZ(6px)',
                      transformOrigin: 'top center'
                    }}
                  ></div>

                  {/* Enhanced shadow under book */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[150px] h-6 bg-black/50 blur-xl rounded-full"></div>

                  {/* Tags - Positioned higher to avoid underlapping */}
                  <div className="absolute -top-4 -right-3 z-[100]">
                    {book.tags.slice(0, 1).map((tag) => {
                      const tagInfo = tagAtlas[tag];
                      if (!tagInfo) return null;

                      return (
                        <motion.div
                          key={tag}
                          className={`px-3 py-1.5 rounded-full text-xs ${tagInfo.color} backdrop-blur-sm shadow-xl`}
                          initial={{ opacity: 0, scale: 0, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.03 + 0.2 }}
                          whileHover={{ scale: 1.15, rotate: 8 }}
                        >
                          <span className="font-bold">{tagInfo.display}</span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* FREE badge - below book */}
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      className="bg-white text-[#6B8E7F] font-bold text-xs py-1.5 px-4 rounded-full shadow-xl border-2 border-[#6B8E7F]"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 + 0.3 }}
                      whileHover={{ scale: 1.1 }}
                    >
                      FREE
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative bookends */}
        <div className="absolute left-0 bottom-0 w-8 h-48 bg-gradient-to-r from-[#4A6D5E]/80 to-transparent rounded-l-lg"></div>
        <div className="absolute right-0 bottom-0 w-8 h-48 bg-gradient-to-l from-[#4A6D5E]/80 to-transparent rounded-r-lg"></div>
      </div>
    </div>
  );
}
