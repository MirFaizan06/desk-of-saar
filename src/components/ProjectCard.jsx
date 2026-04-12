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
import { useTheme } from '../context/ThemeContext';

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
  const { dark } = useTheme();
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
    <div className={`border rounded-2xl transition-all duration-500 overflow-hidden ${
      dark
        ? 'bg-[#0f0e0c] border-[#1a1815] hover:border-[#b8964e]/15'
        : 'bg-white border-[#eee9e0] hover:border-[#b8964e]/20'
    }`}>
      {/* Header */}
      <div
        onClick={handleExpand}
        className="flex items-start gap-4 px-6 py-5 cursor-pointer group"
      >
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center mt-0.5 ${
          dark ? 'bg-[#1a1815]' : 'bg-[#f6f4f0]'
        }`}>
          <Code2 size={16} strokeWidth={1.5} className="text-[#b8964e]" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className={`font-display text-[1.1rem] leading-snug font-[400] transition-colors duration-500 group-hover:text-[#b8964e] ${
            dark ? 'text-[#d0cbc3]' : 'text-[#222]'
          }`} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>
            {project.title}
          </h4>
          <p className={`text-[0.62rem] font-medium tracking-[2.5px] uppercase mt-1 ${
            dark ? 'text-[#4a4540]' : 'text-[#ccc]'
          }`}>
            {project.category}
          </p>
        </div>

        <div className={`flex-shrink-0 transition-colors duration-500 group-hover:text-[#b8964e] mt-1 ${
          dark ? 'text-[#2a2623]' : 'text-[#ddd]'
        }`}>
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
        <div className={`px-6 pb-6 space-y-5 border-t ${dark ? 'border-[#1a1815]' : 'border-[#f0ece5]'}`}>
          {/* Tags */}
          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className={`px-3 py-0.5 rounded-full text-[0.6rem] uppercase tracking-[1.5px] font-medium ${
                    dark ? 'bg-[#1a1815] text-[#5a554c]' : 'bg-[#f6f4f0] text-[#999]'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="space-y-3 pt-1">
            {fullDesc.split('\n\n').map((para, i) => (
              <p key={i} className={`text-[0.9rem] leading-relaxed ${dark ? 'text-[#7a756c]' : 'text-[#666]'}`}>{para}</p>
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
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-white uppercase text-[0.65rem] tracking-[2px] font-medium transition-all duration-400 hover:-translate-y-0.5 ${
                    dark ? 'bg-[#1a1815] hover:bg-[#b8964e]' : 'bg-[#111] hover:bg-[#b8964e]'
                  }`}
                >
                  <Github size={13} /> Source
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2 rounded-full border uppercase text-[0.65rem] tracking-[2px] font-medium transition-all duration-400 hover:-translate-y-0.5 ${
                    dark
                      ? 'border-[#2a2623] text-[#7a756c] hover:bg-[#b8964e] hover:border-[#b8964e] hover:text-white'
                      : 'border-[#ddd] text-[#888] hover:bg-[#111] hover:border-[#111] hover:text-white'
                  }`}
                >
                  <ExternalLink size={13} /> Live Demo
                </a>
              )}
            </div>
          )}

          {/* Like + stats row */}
          <div className={`flex items-center gap-4 pt-3 border-t text-[0.8rem] ${
            dark ? 'border-[#2a2824] text-[#5a5650]' : 'border-[#f5f5f5] text-[#bbb]'
          }`}>
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
