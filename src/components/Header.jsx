import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';

function Header({ activeTab, setActiveTab }) {
  const { dark } = useTheme();
  const location = useLocation();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      dark ? 'bg-[#0c0b09]/90 backdrop-blur-xl' : 'bg-[#fdfcfa]/90 backdrop-blur-xl'
    }`}>
      <div className="container flex items-center justify-center h-16">
        {/* Brand */}
        <a href="/" onClick={(e) => {
          if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }} className={`font-display text-[1.35rem] tracking-[5px] font-[500] transition-colors duration-500 hover:text-[#b8964e] ${
          dark ? 'text-[#e8e3db]' : 'text-[#111]'
        }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
          SAAR
        </a>
      </div>

      {/* Bottom rule */}
      <div className={`h-px ${dark ? 'bg-[#1a1815]' : 'bg-[#eee9e0]'}`} />
    </header>
  );
}

export default Header;
