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

const EMPTY = {
  title: '', author: '', description: '', genre: [],
  coverUrl: '',
  driveUrl: '',
  published: true, order: 0,
};

function InputField({ label, ...props }) {
  return (
    <div>
      <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[var(--color-hai)] font-bold mb-2">{label}</label>
      <input className="w-full border border-[var(--color-kinu)] px-4 py-3 text-sm text-[var(--color-sumi)] focus:outline-none focus:border-[var(--color-kaki)] transition-colors bg-white rounded-sm" {...props} />
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
      <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[var(--color-hai)] font-bold mb-2">
        Cover Image
      </label>

      {preview ? (
        <div className="relative border border-[var(--color-kinu)] p-3 bg-[var(--color-kami)] rounded-sm">
          <img src={preview} alt="Cover preview" className="w-full max-h-48 object-contain rounded-sm" />
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
          className="border-2 border-dashed rounded-sm transition-colors cursor-pointer p-6 text-center border-[var(--color-kinu)] hover:border-[var(--color-kaki)] bg-white"
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
          <Image size={28} className="text-[var(--color-kinu)] mx-auto mb-3" />
          <p className="text-sm text-[var(--color-hai)]">
            <span className="text-[var(--color-kaki)] font-bold">Click to select</span> a cover image
          </p>
          <p className="text-[0.7rem] text-[var(--color-hai-light)] mt-1">Max 5 MB • JPG, PNG, WebP</p>
        </div>
      )}

      <div className="mt-3">
        <label className="block text-[0.65rem] uppercase tracking-[1.5px] text-[var(--color-hai-light)] font-bold mb-1">
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
          className="w-full border border-[var(--color-kinu)] px-4 py-2.5 text-sm text-[var(--color-sumi)] focus:outline-none focus:border-[var(--color-kaki)] transition-colors bg-white rounded-sm"
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
        <div className="w-8 h-8 border-2 border-[var(--color-kaki)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Link to="/admin/books" className="text-[var(--color-hai)] hover:text-[var(--color-kaki)] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-serif text-3xl text-[var(--color-sumi)]" style={{ fontFamily: 'var(--font-display)' }}>{isEdit ? 'Edit Book' : 'Add New Book'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white border border-[var(--color-kinu)] p-6 space-y-5 rounded-sm shadow-sm">
          <h2 className="font-serif text-lg text-[var(--color-sumi)] mb-4 pb-3 border-b border-[var(--color-kami)]" style={{ fontFamily: 'var(--font-display)' }}>Book Details</h2>

          <InputField label="Title *" value={form.title} onChange={set('title')} required placeholder="Enter book title" />
          <InputField label="Author *" value={form.author} onChange={set('author')} required placeholder="Author name" />

          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[var(--color-hai)] font-bold mb-2">Genres * (comma separated)</label>
            <input 
              value={Array.isArray(form.genre) ? form.genre.join(', ') : (form.genre || '')} 
              onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} 
              required
              placeholder="e.g. Romance, Slice-of-Life, Horror"
              className="w-full border border-[var(--color-kinu)] px-4 py-3 text-sm text-[var(--color-sumi)] focus:outline-none focus:border-[var(--color-kaki)] transition-colors bg-white rounded-sm" 
            />
          </div>

          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[var(--color-hai)] font-bold mb-2">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={4} maxLength={1000}
              placeholder="Short description shown on the card"
              className="w-full border border-[var(--color-kinu)] px-4 py-3 text-sm text-[var(--color-sumi)] focus:outline-none focus:border-[var(--color-kaki)] transition-colors bg-white resize-none rounded-sm" />
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
              <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[var(--color-hai)] font-bold mb-2">Status</label>
              <div className="flex items-center gap-3 h-[46px]">
                <input type="checkbox" id="published" checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                  className="w-4 h-4 accent-[var(--color-kaki)]" />
                <label htmlFor="published" className="text-sm text-[var(--color-hai)]">Published (visible on website)</label>
              </div>
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="bg-white border border-[var(--color-kinu)] p-6 rounded-sm shadow-sm">
          <h2 className="font-serif text-lg text-[var(--color-sumi)] mb-4 pb-3 border-b border-[var(--color-kami)]" style={{ fontFamily: 'var(--font-display)' }}>Cover Image</h2>
          <CoverImagePicker
            currentUrl={form.coverUrl}
            onChange={(url) => setForm((f) => ({ ...f, coverUrl: url }))}
            onRemove={() => setForm((f) => ({ ...f, coverUrl: '' }))}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-[var(--color-sumi)] hover:bg-[var(--color-kaki)] rounded-sm shadow-md disabled:opacity-50 text-white uppercase text-[0.8rem] tracking-[2px] font-bold transition-all hover:-translate-y-0.5">
            <Save size={15} />
            {loading ? 'Saving…' : isEdit ? 'Update Book' : 'Create Book'}
          </button>
          <button type="button" onClick={handleDiscard}
            className="px-8 py-3 border border-[var(--color-kinu)] text-[var(--color-hai)] uppercase text-[0.8rem] tracking-[2px] font-bold hover:border-[var(--color-sumi)] hover:text-[var(--color-sumi)] rounded-sm transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminBookForm;
