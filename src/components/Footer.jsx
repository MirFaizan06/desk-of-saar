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
    <footer id="footer" className={`py-8 md:py-10 transition-colors duration-500 border-t ${dark ? 'bg-[#0f0e0c] border-[#1a1815]' : 'bg-[#fdfcfa] border-[#eee9e0]'}`}>
      <div className="container max-w-[1100px] px-6">
        
        <div className="flex flex-col md:flex-row gap-8 pb-8">
          
          {/* Left: Detailed About */}
          <div className="w-full md:w-1/2">
            <p className={`text-[0.65rem] uppercase tracking-[4px] font-medium mb-3 ${dark ? 'text-[#b8964e]/60' : 'text-[#b8964e]'}`}>
              About The Desk
            </p>
            <h2 className={`font-display text-[1.8rem] font-[300] mb-3 ${
              dark ? 'text-[#e8e3db]' : 'text-[#111]'
            }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
              Omar Rashid Lone
            </h2>
            <div className="space-y-2 text-[0.95rem]">
              <p className={`leading-snug ${dark ? 'text-[#7a756c]' : 'text-[#666]'}`}>
                I've been writing since I was 16—prose, poetry, stories that didn't always know where they were going but refused to stop. My characters tend to be stubborn, emotionally honest people who love too much and say too little.
              </p>
              <p className={`leading-snug ${dark ? 'text-[#7a756c]' : 'text-[#666]'}`}>
                Most of these books are drafts—unfinished, imperfect, still breathing. I put them here because I believe stories get better when they're read, not when they're hidden in folders.
              </p>
            </div>
          </div>

          {/* Right: Contact */}
          <div className="w-full md:w-1/2 md:text-right flex flex-col md:items-end justify-between">
            <div>
              <p className={`text-[0.65rem] uppercase tracking-[4px] font-medium mb-2 ${dark ? 'text-[#b8964e]/60' : 'text-[#b8964e]'}`}>
                Say Hello
              </p>
              <a href={`mailto:${contactInfo.email}`} className={`inline-block font-display text-[1.3rem] font-[300] transition-all duration-500 mb-6 hover:text-[#b8964e] hover:tracking-[1px] ${
                dark ? 'text-[#a09a90]' : 'text-[#111]'
              }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
                {contactInfo.email}
              </a>
            </div>

            {/* Social icons */}
            <div className="flex flex-wrap md:justify-end gap-3 mb-8">
              {contactInfo.socials.map((s) => {
                const Icon = icons[s.icon] || Github;
                return (
                  <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[0.65rem] uppercase tracking-[2px] transition-all duration-500 hover:-translate-y-0.5 ${
                      dark 
                        ? 'border-[#1a1815] text-[#5a554c] hover:border-[#b8964e] hover:text-[#b8964e] bg-[#161412]' 
                        : 'border-[#eee9e0] text-[#888] hover:border-[#b8964e] hover:text-[#b8964e] bg-white'
                    }`}>
                    <Icon size={14} />
                    {s.name}
                  </a>
                );
              })}
            </div>
          </div>

        </div>
        
        {/* Bottom Line */}
        <div className={`w-full h-[1px] mb-6 ${dark ? 'bg-[#b8964e]/10' : 'bg-[#eee9e0]'}`} />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className={`text-[0.65rem] uppercase font-display tracking-[4px] ${dark ? 'text-[#e8e3db]' : 'text-[#222]'}`}
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 400 }}>
            Desk of Saar
          </p>

          <p className={`text-[0.6rem] tracking-[1px] ${dark ? 'text-[#5a554c]' : 'text-[#aaa]'}`}>
            &copy; 2026 Omar Rashid Lone. All Rights Reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
