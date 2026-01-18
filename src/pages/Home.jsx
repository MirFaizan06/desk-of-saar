import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { books } from '../data/books';
import { contactInfo } from '../data/contact';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookCard from '../components/BookCard';
import PDFReader from '../components/PDFReader';

function Home() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [mobileVisibleCount, setMobileVisibleCount] = useState(4);

  const visibleBooksDesktop = 3;
  const maxIndex = Math.max(0, books.length - visibleBooksDesktop);

  const handleReadClick = (book) => {
    setSelectedBook(book);
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
  };

  const handlePrev = () => {
    setCarouselIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCarouselIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const handleShowMore = () => {
    setMobileVisibleCount((prev) => Math.min(prev + 4, books.length));
  };

  const visibleBooksForMobile = books.slice(0, mobileVisibleCount);
  const hasMoreBooks = mobileVisibleCount < books.length;

  return (
    <>
      <Header />

      <section className="py-24 md:py-32 text-center max-w-[900px] mx-auto px-5 min-h-[80vh] flex flex-col justify-center">
        <div className="text-[1rem] text-[#d4a84b] uppercase tracking-[3px] font-bold mb-5">
          The Portfolio
        </div>
        <h1 className="font-serif text-4xl md:text-6xl leading-tight mb-6 italic text-[#1a1a1a]">
          Code by Day.<br />Stories by Night.
        </h1>
        <p className="text-lg text-[#626262] max-w-[600px] mx-auto">
          Exploring the intersection of systems and human emotion.
        </p>
      </section>

      <section id="about" className="section bg-paper border-t border-b border-[#eee]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="w-full h-[300px] sm:h-[350px] md:h-[400px] flex items-center justify-center overflow-hidden rounded-lg">
              <img
                src="/saar_img.jpeg"
                alt="Saar - Author"
                className="w-full h-full object-cover object-center"
              />
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

      <section id="books" className="section">
        <div className="container">
          <h3 className="section-title">The Open Drafts</h3>

          {/* Desktop Carousel - Hidden on mobile */}
          <div className="hidden md:block relative">
            <div className="flex items-center gap-4">
              {/* Previous Button */}
              <button
                onClick={handlePrev}
                disabled={carouselIndex === 0}
                className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  carouselIndex === 0
                    ? 'border-[#ddd] text-[#ddd] cursor-not-allowed'
                    : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <ChevronLeft size={24} />
              </button>

              {/* Books Container */}
              <div className="flex-1 overflow-hidden">
                <div
                  className="flex gap-8 transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${carouselIndex * (100 / visibleBooksDesktop + 2.67)}%)`,
                  }}
                >
                  {books.map((book) => (
                    <div
                      key={book.id}
                      className="flex-shrink-0"
                      style={{ width: `calc((100% - 4rem) / 3)` }}
                    >
                      <BookCard book={book} onReadClick={handleReadClick} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                disabled={carouselIndex >= maxIndex}
                className={`flex-shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${
                  carouselIndex >= maxIndex
                    ? 'border-[#ddd] text-[#ddd] cursor-not-allowed'
                    : 'border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white'
                }`}
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Carousel Indicators */}
            {books.length > visibleBooksDesktop && (
              <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCarouselIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === carouselIndex ? 'bg-[#d4a84b] w-6' : 'bg-[#ddd] hover:bg-[#bbb]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Mobile Grid - Hidden on desktop */}
          <div className="md:hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {visibleBooksForMobile.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onReadClick={handleReadClick}
                />
              ))}
            </div>

            {/* Show More Button */}
            {hasMoreBooks && (
              <div className="text-center mt-10">
                <button
                  onClick={handleShowMore}
                  className="px-8 py-3 border-2 border-[#1a1a1a] text-[#1a1a1a] uppercase text-[0.8rem] tracking-[2px] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="contact" className="section bg-paper border-t border-[#eee]">
        <div className="container max-w-[600px] text-center">
          <h3 className="section-title">Work With Us</h3>
          <p className="mb-10 text-[1.1rem]">
            Looking for illustrators, editors, or creative partners? Get in touch.
          </p>
          <div className="space-y-5">
            <a
              href={`mailto:${contactInfo.email}`}
              className="block font-serif text-2xl text-[#1a1a1a] hover:text-[#d4a84b]"
            >
              {contactInfo.email}
            </a>
            <p className="text-[#888]">
              or find me on{' '}
              {contactInfo.socials.map((social, index) => (
                <span key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1a1a1a] hover:text-[#d4a84b] underline"
                  >
                    {social.name}
                  </a>
                  {index < contactInfo.socials.length - 1 && ', '}
                </span>
              ))}
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {selectedBook && (
        <PDFReader book={selectedBook} onClose={handleCloseReader} />
      )}
    </>
  );
}

export default Home;
