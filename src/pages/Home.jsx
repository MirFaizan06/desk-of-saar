import { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Code2 } from 'lucide-react';
import { createPortal } from 'react-dom';
import { contactInfo } from '../data/contact';
import { useBooks } from '../hooks/useBooks';
import { useProjects } from '../hooks/useProjects';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import PDFReader from '../components/PDFReader';
import ProjectCard from '../components/ProjectCard';
import ProjectDetail from '../components/ProjectDetail';
import ContactForm from '../components/ContactForm';
import SEOInjector from '../components/SEOInjector';

function Home() {
  const { books } = useBooks();
  const { projects } = useProjects();

  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [activeTab, setActiveTab] = useState('books');

  const [bookCarouselIndex, setBookCarouselIndex] = useState(0);
  const [mobileBookCount, setMobileBookCount] = useState(4);
  const [projCarouselIndex, setProjCarouselIndex] = useState(0);
  const [mobileProjCount, setMobileProjCount] = useState(4);

  const visibleDesktop = 3;
  const bookMaxIndex = Math.max(0, books.length - visibleDesktop);
  const projMaxIndex = Math.max(0, projects.length - visibleDesktop);

  return (
    <>
      <SEOInjector books={books} projects={projects} />
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero */}
      <section className="py-24 md:py-32 text-center max-w-[900px] mx-auto px-5 min-h-[80vh] flex flex-col justify-center">
        <div className="text-[1rem] text-[#d4a84b] uppercase tracking-[3px] font-bold mb-5">The Portfolio</div>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6 italic text-[#1a1a1a]">
          Code by Day.<br />Stories by Night.
        </h1>
        <p className="text-lg text-[#626262] max-w-[600px] mx-auto">
          Exploring the intersection of systems and human emotion.
        </p>
      </section>

      {/* About */}
      <section id="about" className="section bg-paper border-t border-b border-[#eee]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] flex items-center justify-center overflow-hidden rounded-lg">
              <img src="/saar_img.jpeg" alt="Saar - Author" className="w-full h-full object-cover object-center" />
            </div>
            <div>
              <h3 className="section-title text-left mb-8 after:mx-0">Who is Saar?</h3>
              <p className="mb-5 text-[1.1rem]">
                <strong className="text-[#1a1a1a]">I am a 21-year-old Computer Science student with a desk full of drafts.</strong>
              </p>
              <p className="mb-5">
                For the past 7 years, I have been writing stories while studying systems. I treat every narrative as a code waiting to be compiled, and every line of code as poetry waiting to be read.
              </p>
              <p>
                This website is not a bookstore—it is an open workshop. These books are drafts. I invite you to read them, rate them, and help me debug the stories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Works — Books / Code toggle */}
      <section id="works" className="section">
        <div className="container">
          <h3 className="section-title">The Open Drafts</h3>

          {/* Toggle */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex border border-[#eee] bg-[#f9f9f9] p-1 gap-1">
              <button
                onClick={() => setActiveTab(activeTab === 'books' ? null : 'books')}
                className={`flex items-center gap-2 px-7 py-2.5 uppercase text-[0.75rem] tracking-[2px] font-bold transition-all ${activeTab === 'books' ? 'bg-[#1a1a1a] text-white' : 'text-[#888] hover:text-[#1a1a1a]'}`}
              >
                <BookOpen size={14} />Books
              </button>
              <button
                onClick={() => setActiveTab(activeTab === 'code' ? null : 'code')}
                className={`flex items-center gap-2 px-7 py-2.5 uppercase text-[0.75rem] tracking-[2px] font-bold transition-all ${activeTab === 'code' ? 'bg-[#1a1a1a] text-white' : 'text-[#888] hover:text-[#1a1a1a]'}`}
              >
                <Code2 size={14} />Code
              </button>
            </div>
          </div>

          {/* Empty state */}
          {activeTab === null && (
            <div className="text-center py-16 text-[#bbb]">
              <div className="flex justify-center gap-6 mb-6 opacity-40">
                <BookOpen size={36} /><Code2 size={36} />
              </div>
              <p className="uppercase tracking-[3px] text-[0.75rem] font-bold">Select a category above</p>
            </div>
          )}

          {/* ── BOOKS ── */}
          {activeTab === 'books' && (
            <>
              {books.length === 0 ? (
                <p className="text-center text-[#aaa] py-16 font-serif text-lg italic">No books published yet.</p>
              ) : (
                <>
                  <div className="hidden md:block relative">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setBookCarouselIndex((p) => Math.max(0, p - 1))} disabled={bookCarouselIndex === 0}
                        className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${bookCarouselIndex === 0 ? 'border-[#ddd] text-[#ddd] cursor-not-allowed' : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'}`}>
                        <ChevronLeft size={24} />
                      </button>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex gap-8 transition-transform duration-500 ease-in-out"
                          style={{ transform: `translateX(-${bookCarouselIndex * (100 / visibleDesktop + 2.67)}%)` }}>
                          {books.map((book) => (
                            <div key={book.id} className="flex-shrink-0" style={{ width: `calc((100% - 4rem) / 3)` }}>
                              <BookCard book={book} onReadClick={setSelectedBook} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => setBookCarouselIndex((p) => Math.min(bookMaxIndex, p + 1))} disabled={bookCarouselIndex >= bookMaxIndex}
                        className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${bookCarouselIndex >= bookMaxIndex ? 'border-[#ddd] text-[#ddd] cursor-not-allowed' : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'}`}>
                        <ChevronRight size={24} />
                      </button>
                    </div>
                    {books.length > visibleDesktop && (
                      <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: bookMaxIndex + 1 }).map((_, idx) => (
                          <button key={idx} onClick={() => setBookCarouselIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === bookCarouselIndex ? 'bg-[#d4a84b] w-6' : 'bg-[#ddd] hover:bg-[#bbb]'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="md:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {books.slice(0, mobileBookCount).map((book) => (
                        <BookCard key={book.id} book={book} onReadClick={setSelectedBook} />
                      ))}
                    </div>
                    {mobileBookCount < books.length && (
                      <div className="text-center mt-10">
                        <button onClick={() => setMobileBookCount((p) => Math.min(p + 4, books.length))}
                          className="px-8 py-3 border-2 border-[#1a1a1a] text-[#1a1a1a] uppercase text-[0.8rem] tracking-[2px] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors">
                          Show More
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* ── CODE ── */}
          {activeTab === 'code' && (
            <>
              {projects.length === 0 ? (
                <p className="text-center text-[#aaa] py-16 font-serif text-lg italic">No projects published yet.</p>
              ) : (
                <>
                  <div className="hidden md:block relative">
                    <div className="flex items-center gap-4">
                      <button onClick={() => setProjCarouselIndex((p) => Math.max(0, p - 1))} disabled={projCarouselIndex === 0}
                        className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${projCarouselIndex === 0 ? 'border-[#ddd] text-[#ddd] cursor-not-allowed' : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'}`}>
                        <ChevronLeft size={24} />
                      </button>
                      <div className="flex-1 overflow-hidden">
                        <div className="flex gap-8 transition-transform duration-500 ease-in-out"
                          style={{ transform: `translateX(-${projCarouselIndex * (100 / visibleDesktop + 2.67)}%)` }}>
                          {projects.map((proj) => (
                            <div key={proj.id} className="flex-shrink-0" style={{ width: `calc((100% - 4rem) / 3)` }}>
                              <ProjectCard project={proj} onViewClick={setSelectedProject} />
                            </div>
                          ))}
                        </div>
                      </div>
                      <button onClick={() => setProjCarouselIndex((p) => Math.min(projMaxIndex, p + 1))} disabled={projCarouselIndex >= projMaxIndex}
                        className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${projCarouselIndex >= projMaxIndex ? 'border-[#ddd] text-[#ddd] cursor-not-allowed' : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'}`}>
                        <ChevronRight size={24} />
                      </button>
                    </div>
                    {projects.length > visibleDesktop && (
                      <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: projMaxIndex + 1 }).map((_, idx) => (
                          <button key={idx} onClick={() => setProjCarouselIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === projCarouselIndex ? 'bg-[#d4a84b] w-6' : 'bg-[#ddd] hover:bg-[#bbb]'}`} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="md:hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      {projects.slice(0, mobileProjCount).map((proj) => (
                        <ProjectCard key={proj.id} project={proj} onViewClick={setSelectedProject} />
                      ))}
                    </div>
                    {mobileProjCount < projects.length && (
                      <div className="text-center mt-10">
                        <button onClick={() => setMobileProjCount((p) => Math.min(p + 4, projects.length))}
                          className="px-8 py-3 border-2 border-[#1a1a1a] text-[#1a1a1a] uppercase text-[0.8rem] tracking-[2px] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors">
                          Show More
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section bg-paper border-t border-[#eee]">
        <div className="container max-w-[700px]">
          <h3 className="section-title">Work With Us</h3>
          <p className="mb-10 text-[1.1rem] text-center">
            Looking for illustrators, editors, or creative partners? Get in touch.
          </p>

          {/* Static links */}
          <div className="text-center mb-10 space-y-3">
            <a href={`mailto:${contactInfo.email}`} className="block font-serif text-2xl text-[#1a1a1a] hover:text-[#d4a84b]">
              {contactInfo.email}
            </a>
            <p className="text-[#888]">
              or find me on{' '}
              {contactInfo.socials.map((s, i) => (
                <span key={s.id}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a] hover:text-[#d4a84b] underline">{s.name}</a>
                  {i < contactInfo.socials.length - 1 && ', '}
                </span>
              ))}
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex-1 h-px bg-[#eee]" />
            <span className="text-[0.75rem] uppercase tracking-[2px] text-[#aaa] font-bold">Or send a message</span>
            <div className="flex-1 h-px bg-[#eee]" />
          </div>

          <ContactForm />
        </div>
      </section>

      <Footer />

      {selectedBook && <PDFReader book={selectedBook} onClose={() => setSelectedBook(null)} />}

      {selectedProject && createPortal(
        <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />,
        document.body
      )}
    </>
  );
}

export default Home;
