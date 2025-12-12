import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Eye, Loader2, BookOpen, User, Calendar, FileText, BookOpenCheck } from 'lucide-react';
import { tagAtlas } from '../data/tags';
import { incrementViewCount } from '../lib/bookUtils';
import { getBookDownloadURL } from '../lib/firebase';
import ReadingMode from './ReadingMode';

export default function BookModal({ book, isOpen, onClose }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (isOpen && book) {
      incrementViewCount(book.id);
      document.body.style.overflow = 'hidden';

      // Fetch PDF URL for reading mode
      const fetchPdfUrl = async () => {
        try {
          const url = await getBookDownloadURL(book.file);
          setPdfUrl(url);
        } catch (error) {
          console.error('Error fetching PDF URL:', error);
          setPdfUrl(null);
        }
      };
      fetchPdfUrl();

      // Simulate download progress animation
      if (isDownloading) {
        const interval = setInterval(() => {
          setDownloadProgress(prev => {
            if (prev >= 95) {
              clearInterval(interval);
              return 95;
            }
            return prev + 5;
          });
        }, 100);

        return () => clearInterval(interval);
      } else {
        setDownloadProgress(0);
      }
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, book, isDownloading]);

  if (!book) return null;

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const downloadURL = await getBookDownloadURL(book.file);

      if (downloadURL) {
        const link = document.createElement('a');
        link.href = downloadURL;
        link.download = `${book.title}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Complete progress
        setDownloadProgress(100);
        setTimeout(() => {
          setIsDownloading(false);
          setDownloadProgress(0);
        }, 500);
      } else {
        alert('Download URL not available. Please configure Firebase Storage.');
        setIsDownloading(false);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download the book. Please try again.');
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-bg/90 backdrop-blur-xl z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 pointer-events-none overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong border border-primary/30 rounded-2xl sm:rounded-3xl max-w-5xl w-full my-auto max-h-[95vh] sm:max-h-[90vh] overflow-y-auto pointer-events-auto shadow-2xl shadow-primary/20"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="relative">
                {/* Close Button */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-10 p-2 sm:p-2.5 md:p-3 rounded-xl glass border-2 border-primary/40 hover:border-primary transition-all shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-primary stroke-[2.5]" />
                </motion.button>

                <div className="grid md:grid-cols-5 gap-4 sm:gap-6 md:gap-8 p-4 sm:p-6 md:p-8">
                  {/* Left Column - Book Cover */}
                  <div className="md:col-span-2">
                    <motion.div
                      className="relative rounded-2xl overflow-hidden shadow-2xl"
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <img
                        src={book.cover}
                        alt={book.title}
                        loading="lazy"
                        className="w-full aspect-[3/4] object-cover"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="600"%3E%3Crect width="400" height="600" fill="%231E293B"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" fill="%238B5CF6" font-size="24" font-family="Arial"%3EBook Cover%3C/text%3E%3C/svg%3E';
                        }}
                      />

                      {/* Tags */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {book.tags.map((tag) => {
                          const tagInfo = tagAtlas[tag];
                          if (!tagInfo) return null;

                          return (
                            <motion.div
                              key={tag}
                              className={`px-3 py-1.5 rounded-full text-xs ${tagInfo.color} backdrop-blur-md shadow-lg`}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                              whileHover={{ scale: 1.1 }}
                            >
                              <span>{tagInfo.display}</span>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Free Badge */}
                      <div className="absolute bottom-4 right-4">
                        <div className="bg-primary text-white font-semibold text-sm py-1.5 px-3 rounded-lg shadow-medium">
                          FREE
                        </div>
                      </div>
                    </motion.div>

                    {/* Book Stats */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
                      <div className="text-center p-2 sm:p-3 rounded-xl glass border border-primary/20">
                        <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary mx-auto mb-1 sm:mb-2" />
                        <div className="text-xs sm:text-sm text-text-dim">PDF</div>
                      </div>
                      <div className="text-center p-2 sm:p-3 rounded-xl glass border border-primary/20">
                        <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-secondary mx-auto mb-1 sm:mb-2" />
                        <div className="text-xs sm:text-sm text-text-dim">{book.views || 0} views</div>
                      </div>
                      <div className="text-center p-2 sm:p-3 rounded-xl glass border border-primary/20">
                        <Download className="w-4 h-4 sm:w-5 sm:h-5 text-accent mx-auto mb-1 sm:mb-2" />
                        <div className="text-xs sm:text-sm text-text-dim">Instant</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Book Details */}
                  <div className="md:col-span-3 flex flex-col">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex-1"
                    >
                      {/* Title and Author */}
                      <div className="mb-4 sm:mb-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-light mb-2">{book.title}</h2>
                        <div className="flex items-center gap-2 sm:gap-3 text-text-dim">
                          <User className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span className="text-sm sm:text-base md:text-lg">by {book.author}</span>
                        </div>
                      </div>

                      {/* Genre and Price */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                        <span className="text-xs sm:text-sm font-medium text-primary bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-primary/20">
                          {book.genre}
                        </span>
                        <span className="gradient-text font-bold text-lg sm:text-xl md:text-2xl">FREE DOWNLOAD</span>
                      </div>

                      {/* Description */}
                      <div className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          <h3 className="text-base sm:text-lg font-bold text-text-light">Description</h3>
                        </div>
                        <p className="text-sm sm:text-base text-text-dim leading-relaxed">{book.description}</p>
                      </div>

                      {/* Tags */}
                      <div className="mb-6 sm:mb-8">
                        <h3 className="text-base sm:text-lg font-bold text-text-light mb-3 sm:mb-4">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {book.tags.map((tag) => {
                            const tagInfo = tagAtlas[tag];
                            if (!tagInfo) return null;

                            return (
                              <motion.div
                                key={tag}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm ${tagInfo.color}`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <span>{tagInfo.display}</span>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>

                    {/* Action Buttons Section */}
                    <motion.div
                      className="pt-4 sm:pt-6 border-t border-primary/20"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      {/* Download Progress */}
                      {isDownloading && (
                        <div className="mb-4 sm:mb-6">
                          <div className="flex justify-between text-xs sm:text-sm text-text-dim mb-2">
                            <span>Downloading...</span>
                            <span>{downloadProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-bg-soft rounded-full overflow-hidden">
                            <motion.div
                              className="h-full gradient-primary rounded-full"
                              initial={{ width: '0%' }}
                              animate={{ width: `${downloadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Read Now Button */}
                        <motion.button
                          onClick={() => setIsReadingMode(true)}
                          className="group relative overflow-hidden bg-gradient-to-r from-secondary to-secondary-light text-white font-bold py-3 sm:py-3.5 md:py-4 px-4 sm:px-5 md:px-6 rounded-xl shadow-xl shadow-secondary/30 hover:shadow-2xl hover:shadow-secondary/50 transition-all flex items-center justify-center gap-2 sm:gap-3"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <BookOpenCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                          <span className="text-sm sm:text-base md:text-lg">Read Now</span>

                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.8 }}
                          />
                        </motion.button>

                        {/* Download Button */}
                        <motion.button
                          onClick={handleDownload}
                          disabled={isDownloading}
                          className="relative overflow-hidden gradient-primary text-white font-bold py-3 sm:py-3.5 md:py-4 px-4 sm:px-5 md:px-6 rounded-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all flex items-center justify-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                          whileHover={isDownloading ? {} : { scale: 1.02, y: -2 }}
                          whileTap={isDownloading ? {} : { scale: 0.98 }}
                        >
                          {isDownloading ? (
                            <>
                              <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                              <span className="text-sm sm:text-base md:text-lg">Downloading...</span>
                            </>
                          ) : (
                            <>
                              <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                              <span className="text-sm sm:text-base md:text-lg">Download</span>
                            </>
                          )}

                          {/* Shimmer effect */}
                          {!isDownloading && (
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                              initial={{ x: '-100%' }}
                              whileHover={{ x: '100%' }}
                              transition={{ duration: 0.8 }}
                            />
                          )}
                        </motion.button>
                      </div>

                      {/* Download Info */}
                      <motion.div
                        className="text-center text-text-dim text-xs sm:text-sm mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <div className="flex items-center gap-2">
                          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Free Download</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-text-dim"></div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>PDF Format</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 rounded-full bg-text-dim"></div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>No Sign-up</span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}

      {/* Reading Mode */}
      <ReadingMode
        book={book}
        isOpen={isReadingMode}
        onClose={() => setIsReadingMode(false)}
        pdfUrl={pdfUrl}
      />
    </AnimatePresence>
  );
}