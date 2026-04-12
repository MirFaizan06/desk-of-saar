import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  collection, doc, addDoc, updateDoc, getDoc, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';
import { ArrowLeft, Save, Image, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const GENRES = ['Romance', 'Poetry', 'Horror', 'Literary Fiction', 'Fantasy', 'Science Fiction', 'Non-Fiction', 'Mystery', 'Other'];

const EMPTY = {
  title: '', author: '', description: '', genre: '',
  coverUrl: '',
  driveUrl: '',
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

/**
 * CoverImagePicker — select a local image file, preview it, and store it in /covers/ folder.
 * The admin picks an image from their local machine. We store only the URL path (relative).
 * For a simple local setup, the admin places images in public/covers/ manually or we generate a preview.
 * Here we allow URL input or file selection that creates a base64 preview.
 */
function CoverImagePicker({ currentUrl, onChange, onRemove }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(currentUrl || '');

  useEffect(() => {
    setPreview(currentUrl || '');
  }, [currentUrl]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be under 5 MB.');
      return;
    }

    // Create a local object URL for preview and store as the cover path
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setPreview(dataUrl);
      onChange(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview('');
    onRemove();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">
        Cover Image
      </label>

      {preview ? (
        <div className="relative border border-[#eee] p-3 bg-[#f9f9f9]">
          <img src={preview} alt="Cover preview" className="w-full max-h-48 object-contain" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded transition-colors cursor-pointer p-6 text-center border-[#ddd] hover:border-[#d4a84b]"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <Image size={28} className="text-[#ccc] mx-auto mb-3" />
          <p className="text-sm text-[#888]">
            <span className="text-[#d4a84b] font-bold">Click to select</span> a cover image
          </p>
          <p className="text-[0.7rem] text-[#bbb] mt-1">Max 5 MB • JPG, PNG, WebP</p>
        </div>
      )}

      <div className="mt-3">
        <label className="block text-[0.65rem] uppercase tracking-[1.5px] text-[#aaa] font-bold mb-1">
          Or paste cover image URL
        </label>
        <input
          type="url"
          value={currentUrl?.startsWith('data:') ? '' : (currentUrl || '')}
          onChange={(e) => {
            const val = e.target.value;
            setPreview(val);
            onChange(val);
          }}
          placeholder="https://... or /covers/my-image.jpg"
          className="w-full border border-[#e0e0e0] px-4 py-2.5 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4a84b] transition-colors bg-white"
        />
      </div>
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
        driveUrl: form.driveUrl,
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
      message: 'Any unsaved changes will be lost.',
      confirmLabel: 'Discard',
      onConfirm: () => navigate('/admin/books'),
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

          <InputField
            label="Google Drive Link"
            type="url"
            value={form.driveUrl}
            onChange={set('driveUrl')}
            placeholder="https://drive.google.com/file/d/..."
          />

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

        {/* Cover Image */}
        <div className="bg-white border border-[#eee] p-6">
          <h2 className="font-serif text-lg text-[#1a1a1a] mb-4 pb-3 border-b border-[#f5f5f5]">Cover Image</h2>
          <CoverImagePicker
            currentUrl={form.coverUrl}
            onChange={(url) => setForm((f) => ({ ...f, coverUrl: url }))}
            onRemove={() => setForm((f) => ({ ...f, coverUrl: '' }))}
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
