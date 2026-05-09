import { Instagram, Linkedin, Github, ArrowUpRight } from 'lucide-react';
import { contactInfo } from '../data/contact';

function XIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SubstackIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24l9.56-5.26L20.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
    </svg>
  );
}

function MediumIcon({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
    </svg>
  );
}

const icons = { instagram: Instagram, linkedin: Linkedin, github: Github, x: XIcon, substack: SubstackIcon, medium: MediumIcon };

function Footer() {
  return (
    <footer id="footer" className="bg-[var(--color-sumi)] text-[var(--color-kami)] border-t border-[#222]">
      <div className="container py-32 md:py-40">
        {/* Single row: branding | email | socials | copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-5">
          {/* Left: Brand + email */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[var(--color-kaki)]" />
              <span className="text-[0.8rem] tracking-[4px] uppercase font-semibold text-white/70">
                Desk of Saar
              </span>
            </div>
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-[0.8rem] text-white/40 hover:text-[var(--color-kaki)] transition-colors hidden sm:inline"
            >
              {contactInfo.email}
            </a>
          </div>

          {/* Center: Social icons (compact) */}
          <div className="flex items-center gap-1">
            {contactInfo.socials.map((s) => {
              const Icon = icons[s.icon] || Github;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.name}
                  className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-[var(--color-kaki)] transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Icon size={16} />
                </a>
              );
            })}
          </div>

          {/* Right: Copyright */}
          <p className="text-[0.75rem] tracking-[1.5px] text-white/25">
            &copy; {new Date().getFullYear()} Omar Rashid Lone
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
