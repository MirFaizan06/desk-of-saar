import { useEffect, useState } from 'react';
import { X, Github, ExternalLink, Code2, Twitter, Linkedin, Link2, MessageCircle, Heart } from 'lucide-react';
import { doc, setDoc, deleteDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUserId, getUserLike, setUserLikeLocal } from '../lib/fingerprint';

function SocialShare({ project }) {
  const pageUrl = window.location.href;
  const shareText = `Check out "${project.title}" — ${project.description}`;
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shares = [
    { label: 'X / Twitter', icon: Twitter, href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}` },
    { label: 'LinkedIn', icon: Linkedin, href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}` },
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + pageUrl)}` },
  ];

  return (
    <div className="pt-8 border-t border-[var(--color-kinu)]">
      <p className="text-[0.7rem] uppercase tracking-[2px] text-[var(--color-hai)] font-bold mb-4">Share</p>
      <div className="flex flex-wrap items-center gap-3">
        {shares.map(({ label, icon: Icon, href }) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-[var(--color-kinu)] text-[var(--color-hai)] hover:border-[var(--color-kaki)] hover:text-[var(--color-kaki)] transition-all duration-400 text-[0.72rem] uppercase tracking-[1.5px] font-bold rounded-sm"
          >
            <Icon size={14} />{label}
          </a>
        ))}
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 border border-[var(--color-kinu)] text-[var(--color-hai)] hover:border-[var(--color-kaki)] hover:text-[var(--color-kaki)] transition-all duration-400 text-[0.72rem] uppercase tracking-[1.5px] font-bold rounded-sm"
        >
          <Link2 size={14} />{copied ? 'Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
}

function ProjectDetail({ project, onClose }) {
  const [liked, setLiked] = useState(getUserLike(project.id));
  const [likeCount, setLikeCount] = useState(project.likeCount || 0);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleLike = async () => {
    if (liking || !project.id) return;
    setLiking(true);
    const uid = getUserId();
    const likeId = `${project.id}_${uid}`;
    const likeRef = doc(db, 'likes', likeId);
    const projRef = doc(db, 'projects', project.id);
    try {
      if (liked) {
        await deleteDoc(likeRef);
        await updateDoc(projRef, { likeCount: increment(-1) });
        setUserLikeLocal(project.id, false);
        setLiked(false);
        setLikeCount((c) => Math.max(0, c - 1));
      } else {
        await setDoc(likeRef, { projectId: project.id, uid, createdAt: serverTimestamp() });
        await updateDoc(projRef, { likeCount: increment(1) });
        setUserLikeLocal(project.id, true);
        setLiked(true);
        setLikeCount((c) => c + 1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLiking(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[var(--color-sumi)]/70 z-50 flex items-start justify-center overflow-y-auto p-4 py-10 animate-fade-in" onClick={onClose}>
      <div className="bg-[var(--color-shiro)] w-full max-w-[780px] relative animate-scale-in rounded-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header bar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[var(--color-kinu)]">
          <p className="text-[0.68rem] text-[var(--color-kaki)] font-bold tracking-[2.5px] uppercase">{project.category}</p>
          <button onClick={onClose} className="text-[var(--color-hai)] hover:text-[var(--color-sumi)] transition-colors hover:rotate-90 duration-400">
            <X size={20} />
          </button>
        </div>

        {/* Thumbnail */}
        <div className="w-full aspect-video bg-[var(--color-sumi)] flex items-center justify-center overflow-hidden">
          {project.thumbnailUrl ? (
            <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center gap-3 select-none">
              <Code2 size={48} className="text-[var(--color-kaki)]" />
              <span className="text-[var(--color-hai)] text-sm tracking-[3px] uppercase" style={{ fontFamily: 'var(--font-display)' }}>{project.category}</span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="px-8 py-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h2 className="text-3xl md:text-4xl text-[var(--color-sumi)] leading-snug font-bold" style={{ fontFamily: 'var(--font-display)' }}>{project.title}</h2>
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 border rounded-sm transition-all duration-400 text-sm font-bold ${
                liked ? 'border-red-300 text-red-400' : 'border-[var(--color-kinu)] text-[var(--color-hai-light)] hover:border-red-300 hover:text-red-400'
              }`}
            >
              <Heart size={15} className={liked ? 'fill-red-400' : ''} />
              <span>{likeCount}</span>
            </button>
          </div>

          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 border border-[var(--color-kinu)] text-[0.65rem] text-[var(--color-hai)] uppercase tracking-[1.5px] font-medium rounded-sm">{tag}</span>
              ))}
            </div>
          )}

          <div className="space-y-5 mb-10">
            {(project.fullDescription || project.description || '').split('\n\n').map((para, i) => (
              <p key={i} className="text-[var(--color-hai)] leading-[1.9] text-[0.92rem]">{para}</p>
            ))}
          </div>

          {(project.sourceUrl || project.demoUrl) && (
            <div className="flex flex-wrap gap-3 mb-10 pt-8 border-t border-[var(--color-kinu)]">
              {project.sourceUrl && (
                <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 bg-[var(--color-sumi)] hover:bg-[var(--color-kaki)] text-white uppercase text-[0.68rem] tracking-[2px] font-bold transition-all duration-500 hover:-translate-y-0.5 rounded-sm"
                >
                  <Github size={14} />Source Code
                </a>
              )}
              {project.demoUrl && (
                <a href={project.demoUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 border-2 border-[var(--color-sumi)] text-[var(--color-sumi)] hover:bg-[var(--color-sumi)] hover:text-white uppercase text-[0.68rem] tracking-[2px] font-bold transition-all duration-500 hover:-translate-y-0.5 rounded-sm"
                >
                  <ExternalLink size={14} />Live Demo
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
