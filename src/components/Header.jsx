import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';
import { contactInfo } from '../data/contact';

function Header() {
  const { dark } = useTheme();
  const location = useLocation();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 hover:bg-opacity-100 ${
      dark ? 'bg-[#0c0b09]/80 backdrop-blur-xl' : 'bg-[#fdfcfa]/85 backdrop-blur-xl'
    }`}>
      <div className="container max-w-[1100px] mx-auto flex items-center justify-between h-[80px] px-6">
        <a href="/" onClick={(e) => {
          if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }} className={`font-display text-[1.2rem] md:text-[1.35rem] tracking-[5px] transition-all duration-500 hover:text-[#b8964e] hover:tracking-[7px] ${
          dark ? 'text-[#e8e3db]' : 'text-[#111]'
        }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          <span className="font-[300]">DESK OF</span> <strong className="font-[600]">SAAR</strong>
        </a>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-10">
          <a href="#works" onClick={(e) => {
            if (location.pathname === '/') {
              e.preventDefault();
              const el = document.getElementById('works');
              if (el) {
                const y = el.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: y, behavior: 'smooth' });
              }
            }
          }} className={`group relative inline-block text-[0.62rem] uppercase tracking-[3px] font-medium transition-colors hover:text-[#b8964e] py-2 ${
            dark ? 'text-[#a09a90]' : 'text-[#666]'
          }`}>
            The Drafts
            <span className={`absolute bottom-0 left-0 block w-full h-[1.5px] transform origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100 ${dark ? 'bg-[#b8964e]' : 'bg-[#b8964e]'}`} />
          </a>
          
          <a href={`mailto:${contactInfo.email}`} className={`px-6 py-2.5 rounded-full border text-[0.62rem] uppercase tracking-[2px] font-medium transition-all duration-500 hover:-translate-y-[2px] shadow-sm hover:shadow-md ${
            dark 
              ? 'border-[#b8964e]/40 text-[#b8964e] hover:bg-[#b8964e] hover:text-[#0c0b09] hover:shadow-[#b8964e]/20' 
              : 'border-[#222] text-[#222] hover:bg-[#222] hover:text-white'
          }`}>
            Say Hello
          </a>
        </div>
      </div>

      {/* Bottom rule */}
      <div className={`h-[1px] w-full transition-colors duration-500 ${dark ? 'bg-[#1a1815]' : 'bg-[#eee9e0]'}`} />
    </header>
  );
}

export default Header;
