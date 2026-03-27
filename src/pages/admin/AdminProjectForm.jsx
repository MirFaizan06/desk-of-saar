import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, doc, addDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { deleteFromS3 } from '../../lib/s3';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';
import FileUpload from '../../components/ui/FileUpload';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = ['Web App', 'Mobile / PWA', 'AI / NLP', 'CLI Tool', 'Library', 'Game', 'API', 'Other'];

const EMPTY = {
  title: '', category: '', tags: [], description: '', fullDescription: '',
  thumbnailUrl: '', thumbnailKey: '',
  pdfAttachmentUrl: '', pdfAttachmentKey: '',
  sourceUrl: '', demoUrl: '',
  published: true, order: 0,
};

function InputField({ label, ...props }) {
  return (
    <div>
      <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">{label}</label>
      <input className="w-full border border-[#e0e0e0] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4a84b] transition-colors bg-white" {...props} />
    </div>
  );
}

function TagInput({ tags, onChange }) {
  const [input, setInput] = useState('');

  const addTag = () => {
    const t = input.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
  };

  const removeTag = (tag) => onChange(tags.filter((t) => t !== tag));

  return (
    <div>
      <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">Tags</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-[#1a1a1a] text-white text-[0.75rem] uppercase tracking-wider font-bold">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-300">
              <X size={11} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder="Type a tag and press Enter"
          className="flex-1 border border-[#e0e0e0] px-4 py-2.5 text-sm focus:outline-none focus:border-[#d4a84b] bg-white"
        />
        <button type="button" onClick={addTag}
          className="px-4 py-2.5 bg-[#f5f5f5] border border-[#e0e0e0] text-sm text-[#626262] hover:bg-[#eee] transition-colors">
          Add
        </button>
      </div>
    </div>
  );
}

function AdminProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [sessionKeys, setSessionKeys] = useState([]);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'projects', id));
        if (snap.exists()) setForm({ ...EMPTY, ...snap.data() });
      } catch {
        showToast('Failed to load project data.', 'error');
      } finally {
        setFetching(false);
      }
    })();
  }, [id]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFileUploaded = (urlField, keyField) => ({ url, key }) => {
    setForm((f) => ({ ...f, [urlField]: url, [keyField]: key }));
    setSessionKeys((prev) => [...prev, key]);
  };

  const handleFileRemoved = (urlField, keyField) => () => {
    setForm((f) => ({ ...f, [urlField]: '', [keyField]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.category) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        tags: form.tags,
        description: form.description,
        fullDescription: form.fullDescription,
        thumbnailUrl: form.thumbnailUrl,
        thumbnailKey: form.thumbnailKey,
        pdfAttachmentUrl: form.pdfAttachmentUrl,
        pdfAttachmentKey: form.pdfAttachmentKey,
        sourceUrl: form.sourceUrl,
        demoUrl: form.demoUrl,
        published: form.published,
        order: Number(form.order) || 0,
        updatedAt: serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, 'projects', id), payload);
        showToast('Project updated!', 'success');
      } else {
        await addDoc(collection(db, 'projects'), {
          ...payload,
          likeCount: 0,
          viewCount: 0,
          createdAt: serverTimestamp(),
        });
        showToast('Project created!', 'success');
      }
      navigate('/admin/projects');
    } catch (err) {
      console.error(err);
      showToast('Save failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    showDialog({
      type: 'confirm',
      title: 'Discard changes?',
      message: 'Any uploaded files during this session will be removed from S3.',
      confirmLabel: 'Discard',
      onConfirm: async () => {
        for (const key of sessionKeys) {
          if (key !== form.thumbnailKey && key !== form.pdfAttachmentKey) {
            await deleteFromS3(key).catch(() => {});
          }
        }
        navigate('/admin/projects');
      },
    });
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-[#d4a84b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/projects" className="text-[#888] hover:text-[#1a1a1a]">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[#1a1a1a]">{isEdit ? 'Edit Project' : 'Add New Project'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#eee] p-6 space-y-5">
          <h2 className="font-serif text-lg text-[#1a1a1a] mb-4 pb-3 border-b border-[#f5f5f5]">Project Details</h2>

          <InputField label="Title *" value={form.title} onChange={set('title')} required placeholder="Project title" />

          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">Category *</label>
            <select value={form.category} onChange={set('category')} required
              className="w-full border border-[#e0e0e0] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4a84b] transition-colors bg-white">
              <option value="">Select category…</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <TagInput tags={form.tags} onChange={(tags) => setForm((f) => ({ ...f, tags }))} />

          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">Short Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3} maxLength={500}
              placeholder="Shown on the project card"
              className="w-full border border-[#e0e0e0] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4a84b] transition-colors bg-white resize-none" />
          </div>

          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">Full Description</label>
            <p className="text-[0.7rem] text-[#aaa] mb-2">Separate paragraphs with a blank line. Shown on the detail page.</p>
            <textarea value={form.fullDescription} onChange={set('fullDescription')} rows={10}
              placeholder="Full project writeup…&#10;&#10;Start a new paragraph with a blank line."
              className="w-full border border-[#e0e0e0] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4a84b] transition-colors bg-white resize-none font-mono" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField label="Source Code URL" type="url" value={form.sourceUrl} onChange={set('sourceUrl')} placeholder="https://github.com/…" />
            <InputField label="Live Demo URL" type="url" value={form.demoUrl} onChange={set('demoUrl')} placeholder="https://…" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Display Order" type="number" value={form.order} onChange={set('order')} placeholder="0" />
            <div>
              <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">Status</label>
              <div className="flex items-center gap-3 h-[46px]">
                <input type="checkbox" id="published" checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 accent-[#d4a84b]" />
                <label htmlFor="published" className="text-sm text-[#626262]">Published (visible on website)</label>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#eee] p-6 space-y-6">
          <h2 className="font-serif text-lg text-[#1a1a1a] mb-4 pb-3 border-b border-[#f5f5f5]">Files</h2>

          <FileUpload
            folder="thumbnails"
            accept="image/*"
            label="Thumbnail Image (optional)"
            currentUrl={form.thumbnailUrl}
            currentKey={form.thumbnailKey}
            onUploaded={handleFileUploaded('thumbnailUrl', 'thumbnailKey')}
            onRemove={handleFileRemoved('thumbnailUrl', 'thumbnailKey')}
            maxMB={5}
          />

          <FileUpload
            folder="attachments"
            accept=".pdf"
            label="PDF Attachment (optional)"
            currentUrl={form.pdfAttachmentUrl}
            currentKey={form.pdfAttachmentKey}
            onUploaded={handleFileUploaded('pdfAttachmentUrl', 'pdfAttachmentKey')}
            onRemove={handleFileRemoved('pdfAttachmentUrl', 'pdfAttachmentKey')}
            maxMB={50}
          />
        </div>

        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[#d4a84b] hover:bg-[#c49a3d] disabled:opacity-50 text-white uppercase text-[0.8rem] tracking-[2px] font-bold transition-colors">
            <Save size={15} />
            {loading ? 'Saving…' : isEdit ? 'Update Project' : 'Create Project'}
          </button>
          <button type="button" onClick={handleDiscard}
            className="px-8 py-3 border border-[#ddd] text-[#626262] uppercase text-[0.8rem] tracking-[2px] font-bold hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminProjectForm;
