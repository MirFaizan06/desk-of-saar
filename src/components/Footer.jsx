import { contactInfo } from '../data/contact';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-center py-16 bg-[#1a1a1a] text-white">
      <p className="font-serif tracking-[2px] text-2xl mb-4">DESK OF SAAR</p>
      <div className="flex justify-center gap-6 mb-6">
        {contactInfo.socials.map((social) => (
          <a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#999] hover:text-[#d4a84b] text-sm uppercase tracking-wider"
          >
            {social.name}
          </a>
        ))}
      </div>
      <p className="text-[0.8rem] text-[#888] mb-4">&copy; {currentYear} Saar. All Rights Reserved.</p>
      <p className="text-[0.75rem] text-[#888]">
        Website developed by{' '}
        <a
          href="https://hachiwastudios.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#ccc] hover:text-[#d4a84b] transition-colors"
        >
          Hachi wa Studios
        </a>
      </p>
    </footer>
  );
}

export default Footer;
