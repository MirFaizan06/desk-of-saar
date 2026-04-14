import { useState, useEffect, useRef } from 'react';
import { BookOpen, Code2, WifiOff, ArrowRight } from 'lucide-react';
import { useBooks } from '../hooks/useBooks';
import { useProjects } from '../hooks/useProjects';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import ProjectCard from '../components/ProjectCard';
import SEOInjector from '../components/SEOInjector';

/* ── Scroll Reveal ─────────────────────────────────────────────────────────── */
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

/* ── Skeletons ─────────────────────────────────────────────────────────────── */
function BookSkel() {
  return (
    <div className="rounded-2xl overflow-hidden">
      <div className="w-full aspect-[2/3] skel" />
      <div className="pt-4 space-y-2">
        <div className="h-4 skel w-3/4 mx-auto" />
        <div className="h-3 skel w-1/2 mx-auto" />
      </div>
    </div>
  );
}

function ProjSkel({ dark }) {
  return (
    <div className={`rounded-2xl border p-6 ${dark ? 'border-[#1a1815] bg-[#0f0e0c]' : 'border-[#eee9e0] bg-white'}`}>
      <div className="flex gap-4">
        <div className="w-10 h-10 skel rounded-xl flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 skel w-2/3" />
          <div className="h-3 skel w-1/3" />
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════════
   HOME
   ══════════════════════════════════════════════════════════════════════════════ */
function Home() {
  const { books, loading: booksLoading, error: booksError } = useBooks();
  const { projects, loading: projLoading, error: projError } = useProjects();
  const { dark } = useTheme();

  const [tab, setTab] = useState('books');
  const [vis, setVis] = useState(true);
  const [content, setContent] = useState('books');
  const [count, setCount] = useState(10);
  const [pCount, setPCount] = useState(6);

  // Intro
  const [ready, setReady] = useState(false);
  useEffect(() => { setTimeout(() => setReady(true), 120); }, []);

  // Tab switch
  const switchTab = (t) => {
    if (t === tab) return;
    setVis(false);
    setTimeout(() => { setTab(t); setContent(t); setTimeout(() => setVis(true), 50); }, 300);
  };

  const worksRef = useSR();

  return (
    <>
      <SEOInjector books={books} projects={projects} />
      <div className={ready ? 'anim-enter-down' : 'opacity-0'}><Header /></div>

      {(booksError || projError) && (
        <div className={`fixed top-16 left-0 right-0 z-40 px-5 py-2.5 flex items-center justify-center gap-3 text-[0.8rem] ${dark ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-800'
          }`}>
          <WifiOff size={14} /><span>{booksError || projError}</span>
        </div>
      )}

      {/* ═══════════════════ SPLIT HERO / ABOUT ═══════════════════ */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center pt-24 pb-16">
        <div className="container max-w-[1100px] mx-auto px-6">

          <div className="flex flex-col md:flex-row items-center gap-14 md:gap-20">

            {/* Left: About Intro / Image */}
            <div className={`w-full md:w-[45%] relative ${ready ? 'anim-enter-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <div className="aspect-[3/4] max-h-[520px] overflow-hidden rounded-3xl relative z-10 shadow-lg">
                <img src="/saar_img.jpeg" alt="Omar Rashid Lone" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Right: Hero Text */}
            <div className={`w-full md:w-[55%] flex flex-col justify-center text-left ${ready ? 'anim-enter-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <p className={`text-[0.68rem] uppercase tracking-[6px] font-medium mb-6 ${dark ? 'text-[#b8964e]/80' : 'text-[#b8964e]'}`}>
                Writer · Poet · Developer
              </p>

              <h1 className={`font-display text-[3.2rem] md:text-[4.2rem] leading-[1.08] mb-6 font-[300] italic ${dark ? 'text-[#e8e3db]' : 'text-[#111]'
                }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Stories That Stay<br />After the Last Page.
              </h1>

              <div className={`w-12 h-[1.5px] mb-8 ${dark ? 'bg-[#b8964e]/40' : 'bg-[#b8964e]'}`} />

              <p className={`text-[1.05rem] leading-relaxed mb-4 ${dark ? 'text-[#a09a90]' : 'text-[#444]'}`}>
                <strong className={dark ? 'text-[#e8e3db] font-medium' : 'text-[#111] font-medium'}>
                  Omar Rashid Lone — Kashmir/Gurez
                </strong>
              </p>

              <p className={`leading-relaxed mb-4 ${dark ? 'text-[#7a756c]' : 'text-[#666]'}`}>
                I've been writing since I was 16—prose, poetry, stories that didn't always know where they were going but refused to stop. Books that feel like conversations you weren't supposed to overhear.
              </p>

              <div className={`mt-8 flex items-center gap-5 ${ready ? 'anim-enter-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
                <a href="#works" onClick={(e) => { e.preventDefault(); document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-[0.65rem] uppercase tracking-[2.5px] font-medium transition-all duration-400 hover:-translate-y-0.5 ${dark
                      ? 'bg-[#b8964e] hover:bg-[#cba85a] shadow-[0_4px_20px_rgba(184,150,78,0.2)]'
                      : 'bg-[#111] hover:bg-[#333] shadow-[0_4px_20px_rgba(0,0,0,0.1)]'
                    }`}
                  style={{ color: '#ffffff' }}>
                  Explore The Drafts <ArrowRight size={14} color="#ffffff" />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════ WORKS ═══════════════════ */}
      <section id="works" ref={worksRef} className={`sr py-10 md:py-14 ${dark ? 'bg-[#0f0e0c]' : 'bg-[#f6f4f0]'}`}>
        <div className="container">
          <div className="text-center mb-8">
            <p className={`text-[0.68rem] uppercase tracking-[4px] font-medium mb-3 ${dark ? 'text-[#b8964e]/60' : 'text-[#b8964e]'}`}>
              Collection
            </p>
            <h2 className={`font-display text-[2.6rem] md:text-[3.2rem] font-[300] mb-4 ${dark ? 'text-[#e8e3db]' : 'text-[#111]'
              }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              The Open Drafts
            </h2>
            <div className={`w-12 h-[1.5px] mx-auto ${dark ? 'bg-[#b8964e]/30' : 'bg-[#b8964e]/50'}`} />
          </div>

          {/* Tab toggle */}
          <div className="flex justify-center mb-8">
            <div className={`inline-flex rounded-full p-1 ${dark ? 'bg-[#161412]' : 'bg-white shadow-sm'}`}>
              {[
                { key: 'books', icon: BookOpen, label: 'Books' },
                { key: 'code', icon: Code2, label: 'Code' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => switchTab(key)}
                  className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-[0.7rem] uppercase tracking-[2.5px] font-medium transition-all duration-500 ${tab === key
                      ? dark
                        ? 'bg-[#b8964e] text-[#0c0b09] shadow-[0_4px_20px_rgba(184,150,78,0.2)]'
                        : 'bg-[#111] text-white shadow-[0_4px_20px_rgba(0,0,0,0.1)]'
                      : dark
                        ? 'text-[#5a554c] hover:text-[#b8964e]'
                        : 'text-[#aaa] hover:text-[#111]'
                    }`}
                >
                  <Icon size={13} strokeWidth={1.5} />{label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{
            opacity: vis ? 1 : 0,
            transform: vis ? 'translateY(0)' : 'translateY(20px)',
          }}>
            {content === 'books' && (
              <>
                {booksLoading ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 stagger">
                    {[1, 2, 3, 4, 5].map(i => <BookSkel key={i} />)}
                  </div>
                ) : books.length === 0 ? (
                  <div className="text-center py-24">
                    <BookOpen size={36} strokeWidth={1} className={dark ? 'text-[#1a1815] mx-auto mb-4' : 'text-[#e2ddd5] mx-auto mb-4'} />
                    <p className={`font-display text-xl italic ${dark ? 'text-[#2a2623]' : 'text-[#ccc]'}`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      No books published yet.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 stagger">
                      {books.slice(0, count).map((book) => (
                        <div key={book.id} className="sr visible"><BookCard book={book} /></div>
                      ))}
                    </div>
                    {count < books.length && (
                      <div className="text-center mt-14">
                        <button onClick={() => setCount(p => Math.min(p + 10, books.length))}
                          className={`group inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[0.72rem] uppercase tracking-[2.5px] font-medium border transition-all duration-500 hover:-translate-y-0.5 ${dark
                              ? 'border-[#b8964e]/30 text-[#b8964e] hover:bg-[#b8964e] hover:text-[#0c0b09] hover:border-[#b8964e]'
                              : 'border-[#ddd] text-[#888] hover:bg-[#111] hover:text-white hover:border-[#111]'
                            }`}>
                          Show More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}

            {content === 'code' && (
              <>
                {projLoading ? (
                  <div className="max-w-[800px] mx-auto space-y-4">
                    {[1, 2, 3].map(i => <ProjSkel key={i} dark={dark} />)}
                  </div>
                ) : projects.length === 0 ? (
                  <div className="text-center py-24">
                    <Code2 size={40} strokeWidth={1} className={dark ? 'text-[#1a1815] mx-auto mb-4' : 'text-[#e2ddd5] mx-auto mb-4'} />
                    <p className={`font-display text-xl italic ${dark ? 'text-[#2a2623]' : 'text-[#ccc]'}`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                      No projects published yet.
                    </p>
                    <p className={`text-[0.85rem] mt-2 ${dark ? 'text-[#1a1815]' : 'text-[#ddd]'}`}>
                      Add projects through the admin panel.
                    </p>
                  </div>
                ) : (
                  <div className="max-w-[800px] mx-auto space-y-4">
                    {projects.slice(0, pCount).map((proj) => (
                      <div key={proj.id}><ProjectCard project={proj} /></div>
                    ))}
                    {pCount < projects.length && (
                      <div className="text-center mt-14">
                        <button onClick={() => setPCount(p => Math.min(p + 6, projects.length))}
                          className={`group inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[0.72rem] uppercase tracking-[2.5px] font-medium border transition-all duration-500 hover:-translate-y-0.5 ${dark
                              ? 'border-[#b8964e]/30 text-[#b8964e] hover:bg-[#b8964e] hover:text-[#0c0b09]'
                              : 'border-[#ddd] text-[#888] hover:bg-[#111] hover:text-white hover:border-[#111]'
                            }`}>
                          Show More <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
