import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function About() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[var(--color-shiro)] min-h-screen">
      <Header />

      <main className="pt-28 pb-20 md:pt-36 md:pb-28">
        <div className="container max-w-4xl">

          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="group inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-[2px] font-semibold text-[var(--color-hai)] hover:text-[var(--color-kaki)] transition-colors mb-12"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          {/* Page header */}
          <p className="text-[0.6rem] uppercase tracking-[6px] font-semibold text-[var(--color-kaki)] mb-4 anim-enter-up" style={{ animationDelay: '0.1s' }}>
            About
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold text-[var(--color-sumi)] leading-[0.92] mb-4 anim-enter-up"
            style={{ fontFamily: 'var(--font-display)', animationDelay: '0.2s' }}
          >
            Omar Rashid <span className="italic text-[var(--color-kaki)]">Lone</span>
          </h1>
          <p className="text-[0.8rem] uppercase tracking-[4px] text-[var(--color-hai)] font-medium mb-12 anim-enter-up" style={{ animationDelay: '0.25s' }}>
            Writer · Poet · Developer · Kashmir, India
          </p>

          {/* Photo + Bio */}
          <div className="flex flex-col md:flex-row gap-12 mb-16 anim-enter-up" style={{ animationDelay: '0.3s' }}>
            {/* Photo */}
            <div className="w-full md:w-[280px] flex-shrink-0">
              <img
                src="/saar_img.jpeg"
                alt="Omar Rashid Lone"
                className="w-full h-auto object-cover shadow-lg"
                style={{ borderRadius: '4px' }}
              />
            </div>

            {/* Bio */}
            <div className="flex-1 space-y-5">
              <p className="text-[1rem] leading-[2] text-[var(--color-hai)]">
                I'm Omar — most people online know me as <strong className="text-[var(--color-sumi)]">Saar</strong>. 
                I'm a 20-year-old Computer Science student and writer from Jammu and Kashmir, India.
              </p>
              <p className="text-[1rem] leading-[2] text-[var(--color-hai)]">
                I've been writing since I was 16 — prose, poetry, stories that didn't always know
                where they were going but refused to stop. My characters tend to be stubborn,
                emotionally honest people who love too much and say too little.
              </p>
              <p className="text-[1rem] leading-[2] text-[var(--color-hai)]">
                Most of these books are drafts — unfinished, imperfect, still breathing. I put them
                here because I believe stories get better when they're read, not when they're hidden
                in folders.
              </p>
              <p className="text-[1rem] leading-[2] text-[var(--color-hai)]">
                When I'm not writing, I'm building software — trying to find where systems meet
                human emotion, where code meets storytelling. This desk is where all of that lives.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-16 h-[2px] bg-[var(--color-kaki)] mb-12" />

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mb-16 anim-enter-up" style={{ animationDelay: '0.4s' }}>
            <div>
              <p className="text-3xl font-bold text-[var(--color-kaki)]" style={{ fontFamily: 'var(--font-display)' }}>4+</p>
              <p className="text-[0.68rem] uppercase tracking-[2px] text-[var(--color-hai)] font-semibold mt-1">Books Written</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--color-kaki)]" style={{ fontFamily: 'var(--font-display)' }}>5+</p>
              <p className="text-[0.68rem] uppercase tracking-[2px] text-[var(--color-hai)] font-semibold mt-1">Years Writing</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[var(--color-kaki)]" style={{ fontFamily: 'var(--font-display)' }}>∞</p>
              <p className="text-[0.68rem] uppercase tracking-[2px] text-[var(--color-hai)] font-semibold mt-1">Drafts</p>
            </div>
          </div>

          {/* What I Write */}
          <div className="mb-16 anim-enter-up" style={{ animationDelay: '0.45s' }}>
            <h2 className="text-2xl font-bold text-[var(--color-sumi)] mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              What I Write
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { genre: 'Literary Fiction', desc: 'Stories that explore the human condition — love, loss, identity, and everything we refuse to talk about.' },
                { genre: 'Poetry & Prose', desc: 'Raw, unfiltered confessions. Sometimes tender, sometimes reckless, always honest.' },
                { genre: 'Romance', desc: 'Not the kind you expect. Love stories that refuse to follow the usual script.' },
                { genre: 'Magical Realism', desc: 'Where the impossible meets the deeply personal. Kintsugi hearts and studio at world\'s edge.' },
              ].map(({ genre, desc }) => (
                <div key={genre} className="p-6 bg-[var(--color-kami)]/50 rounded-sm border border-[var(--color-kinu)]/50">
                  <h3 className="text-[0.95rem] font-bold text-[var(--color-sumi)] mb-2" style={{ fontFamily: 'var(--font-display)' }}>{genre}</h3>
                  <p className="text-[0.85rem] leading-[1.8] text-[var(--color-hai)]">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="anim-enter-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="text-2xl font-bold text-[var(--color-sumi)] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Get in Touch
            </h2>
            <p className="text-[0.92rem] text-[var(--color-hai)] mb-4">
              Want to talk about writing, collaborate, or just say hello?
            </p>
            <a
              href="mailto:mail.omarrashidlone@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-sumi)] hover:bg-[var(--color-kaki)] text-white uppercase text-[0.68rem] tracking-[2px] font-bold transition-all duration-500 hover:-translate-y-0.5 rounded-sm"
            >
              mail.omarrashidlone@gmail.com
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;
