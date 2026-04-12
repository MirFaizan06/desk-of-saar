import { Instagram, Linkedin, Github } from 'lucide-react';
import { contactInfo } from '../data/contact';
import { useTheme } from '../context/ThemeContext';

function XIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SubstackIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24l9.56-5.26L20.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  );
}

function MediumIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

const icons = { instagram: Instagram, linkedin: Linkedin, github: Github, x: XIcon, substack: SubstackIcon, medium: MediumIcon };

function Footer() {
  const { dark } = useTheme();

  return (
    <footer className="py-20 transition-colors duration-500 bg-[#fdfcfa]">
      <div className="container text-center">
        {/* Gold line */}
        <div className="w-10 h-[1px] bg-[#b8964e]/30 mx-auto mb-10" />

        {/* Brand */}
        <p className="text-[#111]/80 tracking-[6px] text-[0.85rem] uppercase font-display mb-8"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
          Desk of Saar
        </p>

        {/* Social icons */}
        <div className="flex justify-center gap-2.5 mb-10">
          {contactInfo.socials.map((s) => {
            const Icon = icons[s.icon] || Github;
            return (
              <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}
                className="w-9 h-9 rounded-full flex items-center justify-center text-[#111]/50 transition-all duration-500 hover:text-[#b8964e] hover:bg-[#b8964e]/10 hover:-translate-y-0.5">
                <Icon size={14} />
              </a>
            );
          })}
        </div>

        <p className="text-[#111]/40 text-[0.7rem] tracking-[1px]">
          &copy; {new Date().getFullYear()} Saar. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
