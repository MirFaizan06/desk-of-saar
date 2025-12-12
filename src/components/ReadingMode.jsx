import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  Settings,
  Sun,
  Moon,
  Clock,
  BookmarkPlus,
  BookmarkCheck,
  Maximize,
  Minimize,
} from 'lucide-react';

export default function ReadingMode({ book, isOpen, onClose, pdfUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [readingTime, setReadingTime] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const timerRef = useRef(null);

  // Music tracks (user will add these to public/music)
  const musicTracks = [
    { name: 'Chopin - Nocturne in C Sharp Minor (No. 20) - Rousseau', file: '/music/Chopin - Nocturne in C Sharp Minor (No. 20) - Rousseau.mp3' },
    { name: 'Chopin - Nocturne in E Flat Major (Op. 9 No. 2) - Rousseau', file: '/music/Chopin - Nocturne in E Flat Major (Op. 9 No. 2) - Rousseau.mp3' },
    { name: 'Chopin - Nocturne Op. 55 No. 1 - Kassia', file: '/music/Chopin - Nocturne Op. 55 No. 1 - Kassia.mp3' },
    { name: 'Chopin – Waltz in A minor, B. 150, Op. Posth. - Kassia', file: '/music/Chopin – Waltz in A minor, B. 150, Op. Posth. - Kassia.mp3' },
    { name: 'Liszt - Liebestraum No. 3 (Love Dream) - Rousseau', file: '/music/Liszt - Liebestraum No. 3 (Love Dream) - Rousseau.mp3' },
  ];

  // Enter fullscreen on mount and handle ESC key
  useEffect(() => {
    if (isOpen && containerRef.current) {
      enterFullscreen();

      // Start reading timer
      timerRef.current = setInterval(() => {
        setReadingTime((prev) => prev + 1);
      }, 1000);

      // ESC key listener
      const handleEscKey = (e) => {
        if (e.key === 'Escape') {
          handleClose();
        }
      };
      window.addEventListener('keydown', handleEscKey);

      return () => {
        window.removeEventListener('keydown', handleEscKey);
      };
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      exitFullscreen();
    };
  }, [isOpen]);

  // Audio controls
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Audio play error:', err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  // Track audio time and duration
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('durationchange', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('durationchange', updateDuration);
    };
  }, [currentTrack]);

  // Handle track end
  const handleTrackEnd = () => {
    // Auto-play next track
    setCurrentTrack((prev) => (prev + 1) % musicTracks.length);
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatAudioTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const enterFullscreen = () => {
    if (containerRef.current) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    exitFullscreen();
    onClose();
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    // Save to localStorage
    const bookmarkKey = `bookmark_${book.id}`;
    if (!isBookmarked) {
      localStorage.setItem(bookmarkKey, 'true');
    } else {
      localStorage.removeItem(bookmarkKey);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const skipTrack = (direction) => {
    if (direction === 'forward') {
      setCurrentTrack((prev) => (prev + 1) % musicTracks.length);
    } else {
      setCurrentTrack((prev) => (prev - 1 + musicTracks.length) % musicTracks.length);
    }
  };

  if (!isOpen || !book) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[100] bg-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            filter: `brightness(${brightness}%)`,
          }}
        >
          {/* Audio Element */}
          <audio
            ref={audioRef}
            src={musicTracks[currentTrack].file}
            onEnded={handleTrackEnd}
            loop={false}
          />

          {/* Top Bar */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-10 glass-dark border-b border-primary/20 py-3 sm:py-4 px-3 sm:px-4 md:px-6"
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between max-w-7xl mx-auto gap-2 sm:gap-4">
              {/* Book Info */}
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <div className="w-8 h-11 sm:w-10 sm:h-14 rounded bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-glow flex-shrink-0">
                  <span className="text-white text-[10px] sm:text-xs font-bold">PDF</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm sm:text-base md:text-lg font-bold text-text-light line-clamp-1">
                    {book.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-text-dim line-clamp-1">{book.author}</p>
                </div>
              </div>

              {/* Reading Stats */}
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-shrink-0">
                {/* Reading Time - Hidden on very small screens */}
                <div className="hidden xs:flex items-center gap-1.5 sm:gap-2 glass px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-xs sm:text-sm text-text-light font-medium">
                    {formatTime(readingTime)}
                  </span>
                </div>

                {/* Bookmark */}
                <motion.button
                  onClick={toggleBookmark}
                  className="p-1.5 sm:p-2 rounded-lg glass hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  ) : (
                    <BookmarkPlus className="w-4 h-4 sm:w-5 sm:h-5 text-text-dim" />
                  )}
                </motion.button>

                {/* Fullscreen Toggle - Hidden on mobile */}
                <motion.button
                  onClick={toggleFullscreen}
                  className="hidden sm:block p-1.5 sm:p-2 rounded-lg glass hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {isFullscreen ? (
                    <Minimize className="w-4 h-4 sm:w-5 sm:h-5 text-text-dim" />
                  ) : (
                    <Maximize className="w-4 h-4 sm:w-5 sm:h-5 text-text-dim" />
                  )}
                </motion.button>

                {/* Settings */}
                <motion.button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1.5 sm:p-2 rounded-lg glass hover:bg-primary/10 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-text-dim" />
                </motion.button>

                {/* Close */}
                <motion.button
                  onClick={handleClose}
                  className="p-1.5 sm:p-2 rounded-lg glass hover:bg-red-500/20 transition-colors"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                className="absolute top-16 sm:top-20 right-3 sm:right-4 md:right-6 z-20 glass-strong border border-primary/30 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 w-72 sm:w-80 shadow-2xl"
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
              >
                <h3 className="text-base sm:text-lg font-bold text-text-light mb-3 sm:mb-4">Reading Settings</h3>

                {/* Brightness Control */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs sm:text-sm text-text-dim flex items-center gap-1.5 sm:gap-2">
                      {brightness > 50 ? (
                        <Sun className="w-3 h-3 sm:w-4 sm:h-4 text-accent" />
                      ) : (
                        <Moon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                      )}
                      Brightness
                    </label>
                    <span className="text-xs sm:text-sm text-text-light">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${brightness}%, #334155 ${brightness}%, #334155 100%)`,
                    }}
                  />
                </div>

                {/* Current Track Info */}
                <div className="glass border border-primary/20 rounded-lg p-2.5 sm:p-3">
                  <div className="text-[10px] sm:text-xs text-text-dim mb-1">Now Playing</div>
                  <div className="text-xs sm:text-sm font-medium text-text-light line-clamp-2">
                    {musicTracks[currentTrack].name}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PDF Viewer */}
          <div className="absolute inset-0 pt-16 sm:pt-20 md:pt-24 pb-28 sm:pb-32 md:pb-36">
            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                className="w-full h-full border-0"
                title={`${book.title} - PDF Reader`}
              />
            ) : (
              <div className="flex items-center justify-center h-full px-4">
                <div className="text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full glass-strong flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <X className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-text-light mb-2">
                    PDF Not Available
                  </h3>
                  <p className="text-sm sm:text-base text-text-dim">
                    Please configure Firebase to enable PDF viewing
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Music Player */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-10 glass-dark border-t border-primary/20 py-3 sm:py-4 px-3 sm:px-4 md:px-6"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6">
                {/* Track Info */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:min-w-[180px] md:min-w-[200px] sm:flex-1">
                  <motion.div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg gradient-primary flex items-center justify-center shadow-glow flex-shrink-0"
                    animate={isPlaying ? { scale: [1, 1.05, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Volume2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </motion.div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-medium text-text-light line-clamp-1">
                      {musicTracks[currentTrack].name}
                    </div>
                    <div className="text-[10px] sm:text-xs text-text-dim">Focus Music</div>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex flex-col items-center gap-2 flex-1 max-w-md">
                  {/* Control Buttons */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* Previous Track */}
                    <motion.button
                      onClick={() => skipTrack('backward')}
                      className="p-1.5 sm:p-2 rounded-lg glass hover:bg-primary/10 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <SkipBack className="w-4 h-4 sm:w-5 sm:h-5 text-text-light" />
                    </motion.button>

                    {/* Play/Pause */}
                    <motion.button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-3 sm:p-4 rounded-full gradient-primary shadow-glow hover:shadow-2xl transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
                      ) : (
                        <Play className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="white" />
                      )}
                    </motion.button>

                    {/* Next Track */}
                    <motion.button
                      onClick={() => skipTrack('forward')}
                      className="p-1.5 sm:p-2 rounded-lg glass hover:bg-primary/10 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <SkipForward className="w-4 h-4 sm:w-5 sm:h-5 text-text-light" />
                    </motion.button>
                  </div>

                  {/* Track Progress Slider */}
                  <div className="w-full flex items-center gap-2 sm:gap-3">
                    <span className="text-[10px] sm:text-xs text-text-dim min-w-[32px] sm:min-w-[40px] text-right">
                      {formatAudioTime(currentTime)}
                    </span>
                    <input
                      type="range"
                      min="0"
                      max={duration || 0}
                      step="0.1"
                      value={currentTime}
                      onChange={handleSeek}
                      className="flex-1 h-1.5 sm:h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${
                          duration ? (currentTime / duration) * 100 : 0
                        }%, #334155 ${
                          duration ? (currentTime / duration) * 100 : 0
                        }%, #334155 100%)`,
                      }}
                    />
                    <span className="text-[10px] sm:text-xs text-text-dim min-w-[32px] sm:min-w-[40px]">
                      {formatAudioTime(duration)}
                    </span>
                  </div>
                </div>

                {/* Volume Control */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:min-w-[180px] md:min-w-[200px] sm:flex-1">
                  <motion.button
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-1.5 sm:p-2 rounded-lg glass hover:bg-primary/10 transition-colors flex-shrink-0"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-text-dim" />
                    ) : (
                      <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    )}
                  </motion.button>

                  <div className="flex-1 min-w-0">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => {
                        setVolume(Number(e.target.value));
                        setIsMuted(false);
                      }}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8B5CF6 0%, #8B5CF6 ${
                          (isMuted ? 0 : volume) * 100
                        }%, #334155 ${(isMuted ? 0 : volume) * 100}%, #334155 100%)`,
                      }}
                    />
                  </div>

                  <span className="text-[10px] sm:text-xs text-text-dim w-8 sm:w-10 text-right flex-shrink-0">
                    {Math.round((isMuted ? 0 : volume) * 100)}%
                  </span>
                </div>
              </div>

              {/* Track Progress Indicator */}
              <div className="flex items-center gap-1 sm:gap-2 mt-2 sm:mt-3">
                {musicTracks.map((track, index) => (
                  <motion.div
                    key={index}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      index === currentTrack
                        ? 'bg-primary shadow-glow'
                        : 'bg-bg-soft'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: index * 0.1 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Keyboard Shortcuts Hint - Hidden on mobile */}
          <motion.div
            className="hidden sm:block absolute bottom-32 md:bottom-36 right-3 sm:right-4 md:right-6 glass border border-primary/20 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-xs text-text-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Press <span className="text-primary font-bold">ESC</span> to exit reading mode
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
