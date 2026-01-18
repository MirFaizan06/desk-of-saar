function Header() {
  const handleScroll = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="py-8 px-5 text-center bg-white/95 border-b border-[#eee] sticky top-0 z-50 backdrop-blur-sm">
      <a href="#" className="text-2xl uppercase tracking-[3px] font-bold block mb-5 text-[#1a1a1a]">
        Saar
      </a>
      <nav className="flex justify-center gap-8">
        <a
          href="#about"
          onClick={(e) => handleScroll(e, 'about')}
          className="text-[0.85rem] uppercase tracking-[2px] font-bold text-[#1a1a1a] hover:text-[#d4a84b]"
        >
          About
        </a>
        <a
          href="#books"
          onClick={(e) => handleScroll(e, 'books')}
          className="text-[0.85rem] uppercase tracking-[2px] font-bold text-[#1a1a1a] hover:text-[#d4a84b]"
        >
          The Drafts
        </a>
        <a
          href="#contact"
          onClick={(e) => handleScroll(e, 'contact')}
          className="text-[0.85rem] uppercase tracking-[2px] font-bold text-[#1a1a1a] hover:text-[#d4a84b]"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}

export default Header;
