import { Code2 } from 'lucide-react';

function ProjectCard({ project, onViewClick }) {
  return (
    <div className="h-full flex flex-col bg-white shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-transform duration-300 hover:-translate-y-2.5 border border-[#f0f0f0] overflow-hidden">
      {/* Thumbnail */}
      <div
        className="w-full aspect-video bg-[#1a1a1a] flex items-center justify-center cursor-pointer overflow-hidden transition-all duration-300 hover:brightness-110 relative"
        onClick={() => onViewClick(project)}
      >
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 select-none">
            <Code2 size={36} className="text-[#d4a84b]" />
            <span className="text-[#555] font-serif text-sm tracking-wider">
              {project.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6 md:p-8 text-center">
        <p className="text-[0.75rem] text-[#d4a84b] font-bold tracking-wider uppercase mb-2">
          {project.category}
        </p>
        <h4 className="font-serif text-lg md:text-xl mb-3 text-[#1a1a1a]">
          {project.title}
        </h4>

        {/* Tags */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 border border-[#eee] text-[0.7rem] text-[#888] uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-[0.9rem] text-[#626262] mb-5 leading-relaxed line-clamp-3 flex-grow">
          {project.description}
        </p>

        <button
          onClick={() => onViewClick(project)}
          className="mt-auto px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#d4a84b] text-white uppercase text-[0.7rem] tracking-[1.5px] font-bold transition-colors"
        >
          View Project
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
