import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  collection, doc, addDoc, updateDoc, getDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { deleteFromS3 } from '../../lib/s3';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';
import FileUpload from '../../components/ui/FileUpload';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const GENRES = ['Romance', 'Poetry', 'Horror', 'Literary Fiction', 'Fantasy', 'Science Fiction', 'Non-Fiction', 'Mystery', 'Other'];

const EMPTY = {
  title: '', author: '', description: '', genre: '',
  coverUrl: '', coverKey: '',
  fileUrl: '', fileKey: '',
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

function AdminBookForm() {
  const { id } = useParams(); // undefined = create mode
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showDialog } = useDialog();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  // Track keys that were uploaded during this session (for orphan cleanup on cancel)
  const [sessionKeys, setSessionKeys] = useState([]);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'books', id));
        if (snap.exists()) setForm({ ...EMPTY, ...snap.data() });
      } catch {
        showToast('Failed to load book data.', 'error');
      } finally {
        setFetching(false);
      }
    })();
  }, [id]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleFileUploaded = (field, keyField) => ({ url, key }) => {
    setForm((f) => ({ ...f, [field]: url, [keyField]: key }));
    setSessionKeys((prev) => [...prev, key]);
  };

  const handleFileRemoved = (field, keyField) => () => {
    setForm((f) => ({ ...f, [field]: '', [keyField]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.genre) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        title: form.title,
        author: form.author,
        description: form.description,
        genre: form.genre,
        coverUrl: form.coverUrl,
        coverKey: form.coverKey,
        fileUrl: form.fileUrl,
        fileKey: form.fileKey,
        published: form.published,
        order: Number(form.order) || 0,
        updatedAt: serverTimestamp(),
      };

      if (isEdit) {
        await updateDoc(doc(db, 'books', id), payload);
        showToast('Book updated successfully!', 'success');
      } else {
        await addDoc(collection(db, 'books'), {
          ...payload,
          ratingSum: 0,
          ratingCount: 0,
          viewCount: 0,
          createdAt: serverTimestamp(),
        });
        showToast('Book created successfully!', 'success');
      }
      navigate('/admin/books');
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
        // Clean up orphaned S3 objects uploaded in this session
        for (const key of sessionKeys) {
          if (key !== form.coverKey && key !== form.fileKey) {
            await deleteFromS3(key).catch(() => {});
          }
        }
        navigate('/admin/books');
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
        <Link to="/admin/books" className="text-[#888] hover:text-[#1a1a1a] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[#1a1a1a]">{isEdit ? 'Edit Book' : 'Add New Book'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[#eee] p-6 space-y-5">
          <h2 className="font-serif text-lg text-[#1a1a1a] mb-4 pb-3 border-b border-[#f5f5f5]">Book Details</h2>

          <InputField label="Title *" value={form.title} onChange={set('title')} required placeholder="Enter book title" />
          <InputField label="Author *" value={form.author} onChange={set('author')} required placeholder="Author name" />

          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">Genre *</label>
            <select value={form.genre} onChange={set('genre')} required
              className="w-full border border-[#e0e0e0] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4a84b] transition-colors bg-white">
              <option value="">Select genre…</option>
              {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={4} maxLength={1000}
              placeholder="Short description shown on the card"
              className="w-full border border-[#e0e0e0] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4a84b] transition-colors bg-white resize-none" />
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

        {/* Files */}
        <div className="bg-white border border-[#eee] p-6 space-y-6">
          <h2 className="font-serif text-lg text-[#1a1a1a] mb-4 pb-3 border-b border-[#f5f5f5]">Files</h2>

          <FileUpload
            folder="covers"
            accept="image/*"
            label="Book Cover *"
            currentUrl={form.coverUrl}
            currentKey={form.coverKey}
            onUploaded={handleFileUploaded('coverUrl', 'coverKey')}
            onRemove={handleFileRemoved('coverUrl', 'coverKey')}
            maxMB={5}
          />

          <FileUpload
            folder="books"
            accept=".pdf"
            label="PDF File (optional)"
            currentUrl={form.fileUrl}
            currentKey={form.fileKey}
            onUploaded={handleFileUploaded('fileUrl', 'fileKey')}
            onRemove={handleFileRemoved('fileUrl', 'fileKey')}
            maxMB={100}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[#d4a84b] hover:bg-[#c49a3d] disabled:opacity-50 text-white uppercase text-[0.8rem] tracking-[2px] font-bold transition-colors">
            <Save size={15} />
            {loading ? 'Saving…' : isEdit ? 'Update Book' : 'Create Book'}
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

export default AdminBookForm;
