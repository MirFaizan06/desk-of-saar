import { useEffect } from 'react';
import { X, Github, ExternalLink, FileText, Code2, Twitter, Linkedin, Link2, MessageCircle } from 'lucide-react';

function SocialShare({ project }) {
  const pageUrl = window.location.href;
  const shareText = `Check out "${project.title}" — ${project.description}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      // Brief visual feedback handled via CSS active state
    });
  };

  const shares = [
    {
      label: 'X / Twitter',
      icon: Twitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`,
    },
    {
      label: 'LinkedIn',
      icon: Linkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`,
    },
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}`,
    },
  ];

  return (
    <div className="pt-8 border-t border-[#eee]">
      <p className="text-[0.75rem] uppercase tracking-[2px] text-[#aaa] font-bold mb-4">
        Share
      </p>
      <div className="flex flex-wrap items-center gap-3">
        {shares.map(({ label, icon: Icon, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={`Share on ${label}`}
            className="flex items-center gap-2 px-4 py-2 border border-[#eee] text-[#626262] hover:border-[#d4a84b] hover:text-[#d4a84b] transition-colors text-[0.8rem] uppercase tracking-wider font-bold"
          >
            <Icon size={15} />
            {label}
          </a>
        ))}
        <button
          onClick={handleCopyLink}
          title="Copy link"
          className="flex items-center gap-2 px-4 py-2 border border-[#eee] text-[#626262] hover:border-[#d4a84b] hover:text-[#d4a84b] transition-colors text-[0.8rem] uppercase tracking-wider font-bold active:bg-[#f9f9f9]"
        >
          <Link2 size={15} />
          Copy Link
        </button>
      </div>
    </div>
  );
}

function ProjectDetail({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-start justify-center overflow-y-auto p-4 py-10 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-[780px] relative animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#eee]">
          <p className="text-[0.75rem] text-[#d4a84b] font-bold tracking-[2px] uppercase">
            {project.category}
          </p>
          <button
            onClick={onClose}
            className="text-[#888] hover:text-[#1a1a1a] transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        {/* Thumbnail */}
        <div className="w-full aspect-video bg-[#1a1a1a] flex items-center justify-center overflow-hidden">
          {project.thumbnail ? (
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 select-none">
              <Code2 size={48} className="text-[#d4a84b]" />
              <span className="text-[#555] font-serif text-sm tracking-wider">
                {project.category}
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-8 py-10">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1a1a1a] mb-4 leading-snug">
            {project.title}
          </h2>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 border border-[#eee] text-[0.7rem] text-[#888] uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Full description — newlines become paragraphs */}
          <div className="space-y-5 mb-10">
            {project.fullDescription.split('\n\n').map((para, i) => (
              <p key={i} className="text-[#626262] leading-relaxed text-[0.95rem]">
                {para}
              </p>
            ))}
          </div>

          {/* Attachments & Links */}
          {(project.sourceUrl || project.demoUrl || project.pdfAttachment) && (
            <div className="flex flex-wrap gap-3 mb-10 pt-8 border-t border-[#eee]">
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#d4a84b] text-white uppercase text-[0.75rem] tracking-[1.5px] font-bold transition-colors"
                >
                  <Github size={15} />
                  Source Code
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white uppercase text-[0.75rem] tracking-[1.5px] font-bold transition-colors"
                >
                  <ExternalLink size={15} />
                  Live Demo
                </a>
              )}
              {project.pdfAttachment && (
                <a
                  href={`/attachments/${project.pdfAttachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-[#d4a84b] text-[#d4a84b] hover:bg-[#d4a84b] hover:text-white uppercase text-[0.75rem] tracking-[1.5px] font-bold transition-colors"
                >
                  <FileText size={15} />
                  Download PDF
                </a>
              )}
            </div>
          )}

          <SocialShare project={project} />
        </div>
      </div>
    </div>
  );
}

export default ProjectDetail;
