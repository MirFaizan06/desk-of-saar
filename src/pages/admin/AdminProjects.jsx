import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Heart, Code2 } from 'lucide-react';

function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setProjects(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const handleDelete = (proj) => {
    showDialog({
      type: 'delete',
      title: `Delete "${proj.title}"?`,
      message: 'This will permanently delete the project record. This cannot be undone.',
      confirmLabel: 'Delete Project',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'projects', proj.id));
          showToast('Project deleted.', 'success');
        } catch {
          showToast('Failed to delete project.', 'error');
        }
      },
    });
  };

  const togglePublished = async (proj) => {
    try {
      await updateDoc(doc(db, 'projects', proj.id), { published: !proj.published });
      showToast(proj.published ? 'Project set to draft.' : 'Project published!', 'info');
    } catch {
      showToast('Failed to update status.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-[#d4a84b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#1a1a1a] mb-1">Code Projects</h1>
          <p className="text-[#888] text-sm">{projects.length} total</p>
        </div>
        <Link to="/admin/projects/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-[#d4a84b] hover:bg-[#c49a3d] text-white uppercase text-[0.75rem] tracking-[2px] font-bold transition-colors">
          <Plus size={15} />Add Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-[#eee] p-16 text-center">
          <Code2 size={36} className="text-[#ddd] mx-auto mb-4" />
          <p className="font-serif text-xl text-[#bbb] mb-2">No projects yet</p>
          <p className="text-[#ccc] text-sm mb-6">Add your first code project.</p>
          <Link to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white uppercase text-[0.75rem] tracking-[2px] font-bold hover:bg-[#d4a84b] transition-colors">
            <Plus size={14} />Add Project
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-[#eee] overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                <th className="text-left px-6 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Project</th>
                <th className="text-left px-4 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Category</th>
                <th className="text-center px-4 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Likes</th>
                <th className="text-center px-4 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Views</th>
                <th className="text-center px-4 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Status</th>
                <th className="text-right px-6 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} className="border-b border-[#f9f9f9] hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-10 bg-[#1a1a1a] flex-shrink-0 overflow-hidden flex items-center justify-center">
                        {proj.thumbnailUrl ? (
                          <img src={proj.thumbnailUrl} alt={proj.title} className="w-full h-full object-cover" />
                        ) : (
                          <Code2 size={14} className="text-[#d4a84b]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1a1a1a]">{proj.title}</p>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {(proj.tags || []).slice(0, 3).map((t) => (
                            <span key={t} className="text-[0.6rem] text-[#aaa] border border-[#eee] px-1.5 py-0.5 uppercase tracking-wider">{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#626262]">{proj.category}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm text-[#626262]">
                      <Heart size={12} className="text-red-400 fill-red-400" />
                      {proj.likeCount || 0}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-[#626262]">
                    {(proj.viewCount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => togglePublished(proj)}
                      className={`flex items-center gap-1 mx-auto px-3 py-1 text-[0.65rem] uppercase tracking-wider font-bold transition-colors ${
                        proj.published ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-[#f5f5f5] text-[#aaa] hover:bg-[#ebebeb]'
                      }`}>
                      {proj.published ? <><Eye size={11} />Live</> : <><EyeOff size={11} />Draft</>}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/admin/projects/${proj.id}`}
                        className="p-2 text-[#888] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => handleDelete(proj)}
                        className="p-2 text-[#888] hover:text-red-500 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminProjects;
