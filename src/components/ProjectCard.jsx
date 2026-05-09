import { useState } from 'react';
import { Code2, Heart, Github, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { doc, setDoc, deleteDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  getUserId, canRecordView, incrementLocalViewCount,
  getUserLike, setUserLikeLocal,
} from '../lib/fingerprint';
import { getLocation } from '../lib/geo';
import { useToast } from '../context/ToastContext';

async function recordProjectView(projectId) {
  if (!canRecordView(projectId)) return;
  try {
    const uid = getUserId();
    const location = await getLocation();
    await setDoc(
      doc(db, 'view_logs', crypto.randomUUID()),
      {
        itemId: projectId,
        itemType: 'project',
        uid,
        country: location.country,
        city: location.city,
        countryCode: location.countryCode,
        createdAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      }
    );
    await updateDoc(doc(db, 'projects', projectId), { viewCount: increment(1) });
    incrementLocalViewCount(projectId);
  } catch (err) {
    console.error('View tracking error:', err);
  }
}

async function toggleLike(projectId, currentlyLiked, setLiked, setCount) {
  const uid = getUserId();
  const likeId = `${projectId}_${uid}`;
  const likeRef = doc(db, 'likes', likeId);
  const projRef = doc(db, 'projects', projectId);

  try {
    if (currentlyLiked) {
      await deleteDoc(likeRef);
      await updateDoc(projRef, { likeCount: increment(-1) });
      setUserLikeLocal(projectId, false);
      setLiked(false);
      setCount((c) => Math.max(0, c - 1));
    } else {
      await setDoc(likeRef, { projectId, uid, createdAt: serverTimestamp() });
      await updateDoc(projRef, { likeCount: increment(1) });
      setUserLikeLocal(projectId, true);
      setLiked(true);
      setCount((c) => c + 1);
    }
  } catch (err) {
    console.error('Like error:', err);
  }
}

function ProjectCard({ project }) {
  const { showToast } = useToast();
  const [liked, setLiked] = useState(getUserLike(project.id));
  const [likeCount, setLikeCount] = useState(project.likeCount || 0);
  const [liking, setLiking] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleExpand = () => {
    if (!expanded && project.id) recordProjectView(project.id);
    setExpanded(!expanded);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (liking || !project.id) return;
    setLiking(true);
    try {
      await toggleLike(project.id, liked, setLiked, setLikeCount);
    } catch {
      showToast('Could not save your like. Please check your connection.', 'error');
    }
    setLiking(false);
  };

  const fullDesc = project.fullDescription || project.description || '';

  return (
    <div className="border rounded-sm transition-all duration-500 overflow-hidden bg-[var(--color-kami)]/40 border-[var(--color-kinu)] hover:border-[var(--color-kaki)]/30 hover:shadow-lg">
      {/* Header */}
      <div
        onClick={handleExpand}
        className="flex items-start gap-4 px-6 py-5 cursor-pointer group"
      >
        <div className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mt-0.5 bg-[var(--color-kami)]">
          <Code2 size={16} strokeWidth={1.5} className="text-[var(--color-kaki)]" />
        </div>

        <div className="flex-1 min-w-0">
          <h4
            className="text-[1.05rem] leading-snug font-semibold transition-colors duration-500 group-hover:text-[var(--color-kaki)] text-[var(--color-sumi)]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {project.title}
          </h4>
          <p className="text-[0.62rem] font-medium tracking-[2.5px] uppercase mt-1 text-[var(--color-hai-light)]">
            {project.category}
          </p>
        </div>

        <div className="flex-shrink-0 transition-colors duration-500 group-hover:text-[var(--color-kaki)] mt-1 text-[var(--color-kinu)]">
          {expanded ? <ChevronUp size={18} strokeWidth={1.5} /> : <ChevronDown size={18} strokeWidth={1.5} />}
        </div>
      </div>

      {/* Expandable content */}
      <div
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          maxHeight: expanded ? '800px' : '0',
          opacity: expanded ? 1 : 0,
        }}
      >
        <div className="px-6 pb-6 space-y-5 border-t border-[var(--color-kinu)]">
          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-0.5 rounded-full text-[0.6rem] uppercase tracking-[1.5px] font-medium bg-[var(--color-kami)] text-[var(--color-hai)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="space-y-3 pt-1">
            {fullDesc.split('\n\n').map((para, i) => (
              <p key={i} className="text-[0.9rem] leading-relaxed text-[var(--color-hai)]">{para}</p>
            ))}
          </div>

          {/* Links row */}
          {(project.sourceUrl || project.demoUrl) && (
            <div className="flex flex-wrap gap-3 pt-3">
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-sm text-white uppercase text-[0.65rem] tracking-[2px] font-medium transition-all duration-400 hover:-translate-y-0.5 bg-[var(--color-sumi)] hover:bg-[var(--color-kaki)]"
                >
                  <Github size={13} /> Source
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-sm border uppercase text-[0.65rem] tracking-[2px] font-medium transition-all duration-400 hover:-translate-y-0.5 border-[var(--color-kinu)] text-[var(--color-hai)] hover:bg-[var(--color-kaki)] hover:border-[var(--color-kaki)] hover:text-white"
                >
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
            </div>
          )}

          {/* Like + stats row */}
          <div className="flex items-center gap-4 pt-3 border-t text-[0.8rem] border-[var(--color-kinu)] text-[var(--color-hai-light)]">
            <button
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-1.5 transition-colors ${liked ? 'text-red-400' : 'hover:text-red-400'}`}
            >
              <Heart size={14} className={liked ? 'fill-red-400' : ''} />
              <span>{likeCount}</span>
            </button>
            {project.viewCount > 0 && (
              <span>{project.viewCount.toLocaleString()} views</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCard;
