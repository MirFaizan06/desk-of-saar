import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import Header from "./components/Header";
import Home from "./pages/Home";
import FAQs from "./pages/FAQs";
import Contact from "./pages/Contact";
import Credits from "./pages/Credits";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [version, setVersion] = useState("");

  // Fetch version from version.txt
  useEffect(() => {
    fetch('/version.txt')
      .then(response => response.text())
      .then(text => setVersion(text.trim()))
      .catch(() => setVersion("v1.0.0"));
  }, []);

  const handleNavigate = (page) => {
    if (page === currentPage || isTransitioning) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "instant" });
      setTimeout(() => setIsTransitioning(false), 100);
    }, 300);
  };

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home key="home" onModalChange={setIsModalOpen} />;
      case "faqs":
        return <FAQs key="faqs" />;
      case "contact":
        return <Contact key="contact" />;
      case "credits":
        return <Credits key="credits" />;
      default:
        return <Home key="home" onModalChange={setIsModalOpen} />;
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Simplified transition overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-50 bg-bg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>
      <Header currentPage={currentPage} onNavigate={handleNavigate} isHidden={isModalOpen} />
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative z-10"
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>
      <footer className="relative z-10 glass-dark border-t border-primary/20 py-12">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center">
            {/* Logo */}
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-primary/50 mb-6"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </motion.div>

            <h3 className="text-2xl font-bold mb-3 gradient-text">
              Books Collection
            </h3>
            <p className="text-text-dim mb-8 max-w-2xl mx-auto">
              Discover and download free books. No sign-up required.
            </p>

            {/* Navigation */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {["home", "faqs", "contact", "credits"].map((page) => (
                <motion.button
                  key={page}
                  onClick={() => handleNavigate(page)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    currentPage === page
                      ? "gradient-primary text-white shadow-glow"
                      : "glass text-text-light hover:text-primary hover:shadow-medium"
                  }`}
                >
                  <span className="relative z-10 capitalize">{page}</span>
                  {currentPage === page && (
                    <motion.div
                      className="absolute inset-0 rounded-lg gradient-primary -z-10"
                      layoutId="navIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer Bottom */}
            <div className="border-t border-primary/20 pt-6">
              <p className="text-white text-sm text-center mb-3 font-medium drop-shadow-sm">
                © {new Date().getFullYear()} Desk of Saar Website. All books are free to download.
              </p>
              <p className="text-white text-sm text-center mb-3 font-medium drop-shadow-sm">
                This website is a part of{' '}
                <span className="font-bold text-white">
                  The NxT LvL Studios
                </span>
                {' '}© 2025-2026. All Rights Reserved.
              </p>
              {version && (
                <p className="text-white/80 text-xs text-center font-medium">
                  {version}
                </p>
              )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
