
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import CatLogo from './CatLogo';
import { contactInfo } from '../data/contact';

function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-700 bg-[var(--color-shiro)]/85 backdrop-blur-xl border-b border-[var(--color-kinu)]/40 shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
    >
      <div className="container flex items-center justify-between h-[90px] md:h-[100px]">
        {/* Left: Desk of Saar branding */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigate('/');
            }
          }}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <CatLogo className="w-12 h-12 md:w-14 md:h-14 text-[var(--color-sumi)] group-hover:text-[var(--color-kaki)] transition-colors duration-500" />
          <span className="text-[0.85rem] tracking-[4px] uppercase font-bold text-[var(--color-sumi)] group-hover:text-[var(--color-kaki)] transition-colors duration-500">
            Desk of Saar
          </span>
        </a>

        {/* Right: Say Hello Button */}
        <a
          href={`mailto:${contactInfo.email}`}
          className="text-[0.65rem] tracking-[2px] uppercase font-bold text-[var(--color-sumi)] border border-[var(--color-sumi)] px-7 py-3 rounded-full hover:bg-[var(--color-sumi)] hover:text-white transition-all duration-500 cursor-pointer relative z-50 inline-block"
        >
          Say Hello
        </a>
      </div>
    </header>
  );
}

export default Header;
