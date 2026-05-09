import { useState, useEffect, useRef, useCallback } from 'react';
import { BookOpen, WifiOff, ArrowRight, ArrowDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBooks } from '../hooks/useBooks';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import SEOInjector from '../components/SEOInjector';

/* ── Camera Lens Intro ─────────────────────────────────────────────────── */
function LensOverlay({ onComplete }) {
  const [phase, setPhase] = useState('closed');
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('opening'), 400);
    const t2 = setTimeout(() => { setPhase('done'); onComplete(); }, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);
  if (phase === 'done') return null;
  return (
    <div className={`lens-overlay ${phase === 'opening' ? 'lens-overlay-exit' : ''}`}>
      <div className={`flex flex-col items-center gap-3 transition-all duration-700 ${phase === 'opening' ? 'opacity-0 scale-75' : 'opacity-100'}`}>
        <div className="w-4 h-4 rounded-full bg-[var(--color-kaki)]" />
        <p className="text-[0.65rem] uppercase tracking-[8px] text-white/40 font-semibold">Welcome to</p>
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>Desk of Saar</h1>
      </div>
    </div>
  );
}

/* ── Scroll Reveal Hook ────────────────────────────────────────────────── */
function useSR() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('visible'); io.unobserve(el); }
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/* ── Skeletons ─────────────────────────────────────────────────────────── */
function BookSkel() {
  return (
    <div className="overflow-hidden" style={{ borderRadius: '6px' }}>
      <div className="w-full aspect-[3/4] skel" />
      <div className="pt-4 space-y-2 px-1"><div className="h-5 skel w-3/4" /><div className="h-3 skel w-1/2" /></div>
    </div>
  );
}

function ProjSkel() {
  return (
    <div className="rounded-sm border border-[var(--color-kinu)] p-6 bg-[var(--color-kami)]/40">
      <div className="flex gap-4">
        <div className="w-10 h-10 skel rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-3"><div className="h-5 skel w-2/3" /><div className="h-3 skel w-1/3" /></div>
      </div>
    </div>
  );
}

/* ── Hero Slide Data ───────────────────────────────────────────────────── */
const heroSlides = [
  {
    label: 'Writer · Poet · Developer',
    titleLine1: 'DESK',
    titleLine2: 'OF SAAR',
    desc: 'Stories that refuse to follow the usual script. Prose, poetry, and code from a 20-year-old writer in Kashmir.',
    cta: { text: 'Explore Works', action: 'works' },
  },
  {
    label: 'Free to Read · Open to All',
    titleLine1: 'STORIES',
    titleLine2: 'UNBOUND',
    desc: 'Every draft, every confession, every unfinished thought — shared freely because stories get better when they\'re read.',
    cta: { text: 'Read Now', action: 'works' },
  },
  {
    label: 'About the Writer',
    titleLine1: 'OMAR',
    titleLine2: 'RASHID',
    desc: 'A Computer Science student who writes literary fiction, romance, horror, and poetry. Building at the intersection of systems and human emotion.',
    cta: { text: 'About Me', action: '/about' },
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HOME — Samurai-inspired Hero + Works + Footer
   ═══════════════════════════════════════════════════════════════════════════ */
function Home() {
  const navigate = useNavigate();
  const { books, loading: booksLoading, error: booksError } = useBooks();

  const [count, setCount] = useState(20);
  const [introComplete, setIntroComplete] = useState(() => sessionStorage.getItem('introPlayed') === 'true');
  const [heroVisible, setHeroVisible] = useState(() => sessionStorage.getItem('introPlayed') === 'true');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideTransition, setSlideTransition] = useState(true);

  const worksRef = useSR();

  const handleIntroComplete = useCallback(() => {
    setIntroComplete(true);
    sessionStorage.setItem('introPlayed', 'true');
    setTimeout(() => setHeroVisible(true), 200);
  }, []);

  const goToSlide = (dir) => {
    setSlideTransition(false);
    setTimeout(() => {
      setCurrentSlide((prev) => {
        if (dir === 'next') return (prev + 1) % heroSlides.length;
        return prev === 0 ? heroSlides.length - 1 : prev - 1;
      });
      setTimeout(() => setSlideTransition(true), 20);
    }, 200);
  };

  const handleHeroCta = (action) => {
    if (action.startsWith('/')) {
      navigate(action);
    } else {
      const el = document.getElementById(action);
      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const slide = heroSlides[currentSlide];

  return (
    <div className="bg-[var(--color-shiro)]">
      <SEOInjector books={books} />
      {!introComplete && <LensOverlay onComplete={handleIntroComplete} />}
      <div className={`relative z-50 ${introComplete ? 'anim-enter-down' : 'opacity-0'}`}><Header /></div>

      {/* ═══════════════ HERO SECTION — Samurai-Inspired ═══════════════ */}
      <section className={`relative min-h-[85vh] pt-[100px] lg:pt-[120px] flex items-center overflow-hidden ${introComplete ? 'lens-reveal' : 'opacity-0'}`}>

        {/* Washi paper subtle texture */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
        }} />

        {/* Brush stroke decoration — positioned behind the title area */}
        <div className="absolute top-1/2 left-1/2 -translate-x-[35%] -translate-y-[55%] w-[700px] h-[500px] opacity-[0.12] pointer-events-none select-none z-0">
          <img src="/brush_stroke.png" alt="" className="w-full h-full object-contain" draggable={false} />
        </div>

        {/* Vertical Japanese text decoration */}
        <div className="absolute top-1/2 right-8 -translate-y-1/2 hidden lg:block z-0">
          <p className="text-[var(--color-kinu)] text-[0.7rem] tracking-[6px] font-medium" style={{
            writingMode: 'vertical-rl',
            fontFamily: 'var(--font-jp)',
          }}>
            物語の始まり
          </p>
        </div>

        {/* Main hero content */}
        <div className="container relative z-10 py-32 lg:py-0 lg:mt-20 xl:mt-28">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12 lg:gap-20">

            {/* LEFT — Title + description + CTA */}
            <div className="flex-1 max-w-2xl">
              {/* Big angular title */}
              <div className={`mb-8 transition-opacity duration-300 ${
                heroVisible && slideTransition ? 'opacity-100' : 'opacity-0'
              }`}>
                <h1 className="hero-title text-[var(--color-sumi)] leading-[0.85]" style={{ fontFamily: 'var(--font-display)' }}>
                  <span className="block">{slide.titleLine1}</span>
                  <span className="block text-[var(--color-kaki)]">{slide.titleLine2}</span>
                </h1>
              </div>

              {/* Description */}
              <p className={`text-[0.95rem] text-[var(--color-hai)] max-w-md leading-[1.9] mb-10 transition-opacity duration-300 h-[80px] ${
                heroVisible && slideTransition ? 'opacity-100' : 'opacity-0'
              }`}>
                {slide.desc}
              </p>

              {/* CTA Button */}
              <div className={`transition-opacity duration-300 ${
                heroVisible && slideTransition ? 'opacity-100' : 'opacity-0'
              }`}>
                <button
                  onClick={() => handleHeroCta(slide.cta.action)}
                  className="group inline-flex items-center gap-4 px-8 py-4 border-2 border-[var(--color-sumi)] text-[var(--color-sumi)] hover:bg-[var(--color-sumi)] hover:text-white uppercase text-[0.72rem] tracking-[4px] font-bold transition-all duration-500 hover:-translate-y-1"
                >
                  {slide.cta.text}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Tags (Moved below hero text) */}
              <div className={`mt-12 flex flex-wrap items-center gap-3 transition-opacity duration-300 ${
                heroVisible && slideTransition ? 'opacity-100' : 'opacity-0'
              }`}>
                {slide.label.split('·').map((tag, i) => (
                  <span key={i} className="text-[0.55rem] uppercase tracking-[2px] font-bold text-[var(--color-hai)] border border-[var(--color-kinu)] px-4 py-1.5 rounded-full">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT — Slide counter + navigation (like 01/02 + arrows) */}
            <div className={`flex flex-row lg:flex-col items-center lg:items-end gap-6 lg:gap-8 transition-[opacity,transform] duration-500 ${
              heroVisible ? 'opacity-100' : 'opacity-0'
            }`} style={{ transitionDelay: '0.5s' }}>
              {/* Slide numbers */}
              <div className="flex flex-row lg:flex-col items-center gap-3">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSlideTransition(false);
                      setTimeout(() => {
                        setCurrentSlide(i);
                        setTimeout(() => setSlideTransition(true), 20);
                      }, 200);
                    }}
                    className={`text-[1.4rem] font-bold transition-all duration-400 ${
                      i === currentSlide
                        ? 'text-[var(--color-sumi)] scale-110'
                        : 'text-[var(--color-kinu)] hover:text-[var(--color-hai)]'
                    }`}
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </button>
                ))}
              </div>

              {/* Navigation arrows */}
              <div className="flex flex-row lg:flex-col gap-2">
                <button
                  onClick={() => goToSlide('next')}
                  className="w-12 h-12 flex items-center justify-center bg-[var(--color-kami)] hover:bg-[var(--color-sumi)] hover:text-white text-[var(--color-hai)] transition-all duration-400"
                >
                  <ChevronRight size={20} />
                </button>
                <button
                  onClick={() => goToSlide('prev')}
                  className="w-12 h-12 flex items-center justify-center bg-[var(--color-kami)] hover:bg-[var(--color-sumi)] hover:text-white text-[var(--color-hai)] transition-all duration-400"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-700 ${
          heroVisible ? 'opacity-100' : 'opacity-0'
        }`} style={{ transitionDelay: '0.6s' }}>
          <span className="text-[0.6rem] uppercase tracking-[4px] text-[var(--color-hai-light)] font-medium">Scroll</span>
          <div className="w-[1px] h-8 bg-[var(--color-kinu)] relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-full bg-[var(--color-kaki)] animate-scroll-line" />
          </div>
        </div>
      </section>

      {/* ═══════════════ WORKS — 4-col grid ═══════════════ */}
      <section id="works" ref={worksRef} className="sr pt-48 pb-48 md:pt-64 md:pb-64 relative border-t border-[var(--color-kinu)]/30">
        <div className="container mb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[6px] font-semibold text-[var(--color-kaki)] mb-3">Portfolio</p>
              <h2 className="text-4xl md:text-5xl font-bold text-[var(--color-sumi)] leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Selected Works</h2>
            </div>
            <div className="hidden">
            </div>
          </div>
        </div>

        <div className="container">
          <div>
                {booksLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 stagger">
                    {[...Array(20)].map((_, i) => <BookSkel key={i} />)}
                  </div>
                ) : books.length === 0 ? (
                  <div className="text-center py-24">
                    <BookOpen size={40} className="text-[var(--color-kinu)] mx-auto mb-4" />
                    <p className="text-xl uppercase tracking-[4px] text-[var(--color-hai)]" style={{ fontFamily: 'var(--font-display)' }}>No books published yet.</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8 stagger">
                      {books.slice(0, count).map((book, i) => (
                        <BookCard key={book.id} book={book} index={i} books={books} />
                      ))}
                    </div>
                    {count < books.length && (
                      <div className="text-center mt-16">
                        <button onClick={() => setCount(p => Math.min(p + 20, books.length))}
                          className="group inline-flex items-center gap-3 px-10 py-4 border border-[var(--color-kinu)] text-[0.72rem] uppercase tracking-[2.5px] font-bold transition-all duration-500 hover:border-[var(--color-kaki)] hover:text-[var(--color-kaki)] text-[var(--color-hai)] rounded-sm">
                          Show More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    )}
                  </>
                )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;
