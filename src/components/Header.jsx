import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

function Header({ activeTab, setActiveTab }) {
  const { dark, toggle } = useTheme();

  const scroll = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const tabNav = (tab) => (e) => {
    e.preventDefault();
    document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' });
    setActiveTab?.(tab);
  };

  const linkCls = (active) =>
    `relative text-[0.7rem] uppercase tracking-[2.5px] font-medium py-1 transition-all duration-500
     after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:transition-all after:duration-500
     ${active
       ? `${dark ? 'text-[#b8964e]' : 'text-[#111]'} after:w-full after:bg-[#b8964e]`
       : `${dark ? 'text-[#5a554c] hover:text-[#b8964e]' : 'text-[#999] hover:text-[#111]'} after:w-0 hover:after:w-full after:bg-[#b8964e]`
     }`;

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      dark ? 'bg-[#0c0b09]/90 backdrop-blur-xl' : 'bg-[#fdfcfa]/90 backdrop-blur-xl'
    }`}>
      <div className="container flex items-center justify-between h-16">
        {/* Brand */}
        <a href="#" className={`font-display text-[1.35rem] tracking-[5px] font-[500] transition-colors duration-500 hover:text-[#b8964e] ${
          dark ? 'text-[#e8e3db]' : 'text-[#111]'
        }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          SAAR
        </a>

        {/* Nav */}
        <nav className="flex items-center gap-8">
          <a href="#works" onClick={tabNav('books')} className={linkCls(activeTab === 'books')}>Books</a>
          <a href="#works" onClick={tabNav('code')} className={linkCls(activeTab === 'code')}>Code</a>
          <a href="#contact" onClick={scroll('contact')} className={linkCls(false)}>Contact</a>

          <div className={`w-px h-4 ${dark ? 'bg-[#2a2623]' : 'bg-[#e2ddd5]'}`} />

          <button
            onClick={toggle}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
              dark
                ? 'text-[#b8964e] hover:bg-[#b8964e]/10'
                : 'text-[#999] hover:text-[#111] hover:bg-[#111]/5'
            }`}
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={14} strokeWidth={1.5} /> : <Moon size={14} strokeWidth={1.5} />}
          </button>
        </nav>
      </div>

      {/* Bottom rule */}
      <div className={`h-px ${dark ? 'bg-[#1a1815]' : 'bg-[#eee9e0]'}`} />
    </header>
  );
}

export default Header;
