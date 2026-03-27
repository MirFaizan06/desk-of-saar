import { useState } from 'react';
import { Code2, Heart } from 'lucide-react';
import { doc, setDoc, deleteDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  getUserId, canRecordView, incrementLocalViewCount,
  getUserLike, setUserLikeLocal,
} from '../lib/fingerprint';
import { getLocation } from '../lib/geo';

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

function ProjectCard({ project, onViewClick }) {
  const [liked, setLiked] = useState(getUserLike(project.id));
  const [likeCount, setLikeCount] = useState(project.likeCount || 0);
  const [liking, setLiking] = useState(false);

  const handleView = () => {
    if (project.id) recordProjectView(project.id);
    onViewClick(project);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (liking || !project.id) return;
    setLiking(true);
    await toggleLike(project.id, liked, setLiked, setLikeCount);
    setLiking(false);
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-2.5 border border-[#f0f0f0] overflow-hidden">
      {/* Thumbnail */}
      <div
        className="w-full aspect-video bg-[#1a1a1a] flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:brightness-110"
        onClick={handleView}
      >
        {project.thumbnailUrl ? (
          <img src={project.thumbnailUrl} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-3 select-none">
            <Code2 size={36} className="text-[#d4a84b]" />
            <span className="text-[#555] font-serif text-sm tracking-wider">{project.category}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6 md:p-8 text-center">
        <p className="text-[0.75rem] text-[#d4a84b] font-bold tracking-wider uppercase mb-2">
          {project.category}
        </p>
        <h4 className="font-serif text-lg md:text-xl mb-3 text-[#1a1a1a]">{project.title}</h4>

        {project.tags?.length > 0 && (
          <div className="flex flex-wrap justify-center gap-1.5 mb-4">
            {project.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 border border-[#eee] text-[0.7rem] text-[#888] uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-[0.9rem] text-[#626262] mb-4 leading-relaxed line-clamp-3 flex-grow">
          {project.description}
        </p>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-4 mb-5 text-[0.75rem] text-[#bbb]">
          {project.viewCount > 0 && <span>{project.viewCount.toLocaleString()} views</span>}
          <button
            onClick={handleLike}
            disabled={liking}
            className={`flex items-center gap-1 transition-colors ${liked ? 'text-red-400' : 'text-[#bbb] hover:text-red-400'}`}
          >
            <Heart size={13} className={liked ? 'fill-red-400' : ''} />
            <span>{likeCount}</span>
          </button>
        </div>

        <button
          onClick={handleView}
          className="mt-auto px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#d4a84b] text-white uppercase text-[0.7rem] tracking-[1.5px] font-bold transition-colors"
        >
          View Project
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
