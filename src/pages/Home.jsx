import { useState, useEffect, useRef } from 'react';
import { BookOpen, Code2, WifiOff, ArrowRight } from 'lucide-react';
import { contactInfo } from '../data/contact';
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

  const aboutRef = useSR();
  const worksRef = useSR();
  const contactRef = useSR();

  return (
    <>
      <SEOInjector books={books} projects={projects} />
      <div className={ready ? 'anim-enter-down' : 'opacity-0'}><Header activeTab={tab} setActiveTab={switchTab} /></div>

      {(booksError || projError) && (
        <div className={`fixed top-16 left-0 right-0 z-40 px-5 py-2.5 flex items-center justify-center gap-3 text-[0.8rem] ${
          dark ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-50 text-amber-800'
        }`}>
          <WifiOff size={14} /><span>{booksError || projError}</span>
        </div>
      )}

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="text-center max-w-[820px] mx-auto px-6">
          {/* Ornamental line */}
          <div className={`mx-auto w-px h-16 mb-10 ${ready ? 'anim-enter-up' : 'opacity-0'} ${
            dark ? 'bg-gradient-to-b from-transparent to-[#b8964e]/30' : 'bg-gradient-to-b from-transparent to-[#b8964e]/20'
          }`} style={{ animationDelay: '0.1s' }} />

          <p className={`text-[0.72rem] uppercase tracking-[6px] font-medium mb-8 ${
            ready ? 'anim-enter-up' : 'opacity-0'
          } ${dark ? 'text-[#5a554c]' : 'text-[#b8964e]'}`} style={{ animationDelay: '0.25s' }}>
            Writer · Poet · Developer
          </p>

          <h1 className={`font-display text-[3.2rem] md:text-[5rem] leading-[1.08] mb-8 font-[300] italic ${
            ready ? 'anim-enter-up' : 'opacity-0'
          } ${dark ? 'text-[#e8e3db]' : 'text-[#111]'}`} style={{ animationDelay: '0.4s', fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Stories That Stay<br />After the Last Page.
          </h1>

          <p className={`text-[1rem] max-w-[440px] mx-auto leading-relaxed font-light ${
            ready ? 'anim-enter-up' : 'opacity-0'
          } ${dark ? 'text-[#5a554c]' : 'text-[#999]'}`} style={{ animationDelay: '0.55s' }}>
            Books that feel like conversations you weren't supposed to overhear.
          </p>

          {/* Scroll arrow */}
          <div className={`mt-16 ${ready ? 'anim-enter-up' : 'opacity-0'}`} style={{ animationDelay: '0.75s' }}>
            <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }); }}
              className={`inline-flex flex-col items-center gap-2 group transition-colors ${
                dark ? 'text-[#3a3630] hover:text-[#b8964e]' : 'text-[#ccc] hover:text-[#b8964e]'
              }`}>
              <span className="text-[0.6rem] uppercase tracking-[4px]">Scroll</span>
              <div className={`w-px h-8 transition-all duration-500 group-hover:h-12 ${
                dark ? 'bg-[#b8964e]/20 group-hover:bg-[#b8964e]/50' : 'bg-[#b8964e]/15 group-hover:bg-[#b8964e]/40'
              }`} />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════ ABOUT ═══════════════════ */}
      <section id="about" ref={aboutRef} className={`sr py-28 md:py-36 ${dark ? 'bg-[#0f0e0c]' : 'bg-[#f6f4f0]'}`}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            {/* Image */}
            <div className="relative">
              <div className="aspect-[3/4] max-h-[540px] overflow-hidden rounded-3xl">
                <img src="/saar_img.jpeg" alt="Omar Rashid Lone" className="w-full h-full object-cover" />
              </div>
              {/* Accent frame */}
              <div className={`absolute -z-10 inset-4 rounded-3xl border ${dark ? 'border-[#b8964e]/10' : 'border-[#b8964e]/15'}`} />
            </div>

            {/* Text */}
            <div>
              <p className={`text-[0.68rem] uppercase tracking-[4px] font-medium mb-6 ${dark ? 'text-[#b8964e]/60' : 'text-[#b8964e]'}`}>
                About
              </p>
              <h2 className={`font-display text-[2.6rem] md:text-[3.2rem] leading-[1.1] mb-3 font-[300] ${
                dark ? 'text-[#e8e3db]' : 'text-[#111]'
              }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                Omar Rashid Lone
              </h2>
              <div className={`w-10 h-[1.5px] mb-8 ${dark ? 'bg-[#b8964e]/40' : 'bg-[#b8964e]'}`} />

              <p className={`text-[1.05rem] leading-relaxed mb-5 ${dark ? 'text-[#a09a90]' : 'text-[#444]'}`}>
                <strong className={dark ? 'text-[#e8e3db] font-medium' : 'text-[#111] font-medium'}>
                  A 20-year-old writer and programmer from Kashmir.
                </strong>
              </p>
              <p className={`leading-relaxed mb-5 ${dark ? 'text-[#7a756c]' : ''}`}>
                I've been writing since I was 13—prose, poetry, stories that didn't always know where they were going but refused to stop. My characters tend to be stubborn, emotionally honest people who love too much and say too little.
              </p>
              <p className={`leading-relaxed mb-5 ${dark ? 'text-[#7a756c]' : ''}`}>
                Most of these books are drafts—unfinished, imperfect, still breathing. I put them here because I believe stories get better when they're read, not when they're hidden in folders.
              </p>
              <p className={`leading-relaxed italic ${dark ? 'text-[#5a554c]' : 'text-[#aaa]'}`}>
                If something I wrote made you feel something, I'd love to hear about it. And if it didn't—tell me that too.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ WORKS ═══════════════════ */}
      <section id="works" ref={worksRef} className="sr py-28 md:py-36">
        <div className="container">
          <div className="text-center mb-16">
            <p className={`text-[0.68rem] uppercase tracking-[4px] font-medium mb-5 ${dark ? 'text-[#b8964e]/60' : 'text-[#b8964e]'}`}>
              Collection
            </p>
            <h2 className={`font-display text-[2.6rem] md:text-[3.2rem] font-[300] mb-4 ${
              dark ? 'text-[#e8e3db]' : 'text-[#111]'
            }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              The Open Drafts
            </h2>
            <div className={`w-12 h-[1.5px] mx-auto ${dark ? 'bg-[#b8964e]/30' : 'bg-[#b8964e]/50'}`} />
          </div>

          {/* Tab toggle */}
          <div className="flex justify-center mb-14">
            <div className={`inline-flex rounded-full p-1 ${dark ? 'bg-[#161412]' : 'bg-[#f0ece5]'}`}>
              {[
                { key: 'books', icon: BookOpen, label: 'Books' },
                { key: 'code', icon: Code2, label: 'Code' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => switchTab(key)}
                  className={`flex items-center gap-2 px-8 py-2.5 rounded-full text-[0.7rem] uppercase tracking-[2.5px] font-medium transition-all duration-500 ${
                    tab === key
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
                    {[1,2,3,4,5].map(i => <BookSkel key={i} />)}
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
                          className={`group inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[0.72rem] uppercase tracking-[2.5px] font-medium border transition-all duration-500 hover:-translate-y-0.5 ${
                            dark
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
                    {[1,2,3].map(i => <ProjSkel key={i} dark={dark} />)}
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
                          className={`group inline-flex items-center gap-3 px-10 py-3.5 rounded-full text-[0.72rem] uppercase tracking-[2.5px] font-medium border transition-all duration-500 hover:-translate-y-0.5 ${
                            dark
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

      {/* ═══════════════════ CONTACT ═══════════════════ */}
      <section id="contact" ref={contactRef} className={`sr py-28 md:py-36 ${dark ? 'bg-[#0f0e0c]' : 'bg-[#f6f4f0]'}`}>
        <div className="container max-w-[600px] text-center">
          <p className={`text-[0.68rem] uppercase tracking-[4px] font-medium mb-5 ${dark ? 'text-[#b8964e]/60' : 'text-[#b8964e]'}`}>
            Say Hello
          </p>
          <h2 className={`font-display text-[2.6rem] md:text-[3.2rem] font-[300] mb-4 ${
            dark ? 'text-[#e8e3db]' : 'text-[#111]'
          }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            Get in Touch
          </h2>
          <div className={`w-12 h-[1.5px] mx-auto mb-10 ${dark ? 'bg-[#b8964e]/30' : 'bg-[#b8964e]/50'}`} />

          <p className={`text-[0.95rem] leading-relaxed mb-10 ${dark ? 'text-[#5a554c]' : 'text-[#999]'}`}>
            Want to collaborate, give feedback, or just say hello?
          </p>

          <a href={`mailto:${contactInfo.email}`} className={`inline-block font-display text-[1.5rem] md:text-[1.8rem] font-[300] transition-all duration-500 hover:text-[#b8964e] hover:tracking-[1px] ${
            dark ? 'text-[#a09a90]' : 'text-[#111]'
          }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {contactInfo.email}
          </a>

          <div className="flex justify-center gap-2 mt-8 flex-wrap">
            {contactInfo.socials.map((s) => (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer"
                className={`text-[0.68rem] uppercase tracking-[2px] font-medium px-4 py-2 rounded-full border transition-all duration-400 hover:-translate-y-0.5 ${
                  dark
                    ? 'border-[#1a1815] text-[#5a554c] hover:border-[#b8964e]/40 hover:text-[#b8964e]'
                    : 'border-[#e8e4dc] text-[#aaa] hover:border-[#b8964e]/40 hover:text-[#b8964e]'
                }`}>
                {s.name}
              </a>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Home;
