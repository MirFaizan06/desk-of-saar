import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, BookOpen, ExternalLink, Upload } from 'lucide-react';
import { books as fallbackBooks } from '../../data/books';

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  useEffect(() => {
    const q = query(collection(db, 'books'), orderBy('order', 'asc'));
    const unsub = onSnapshot(q, (snap) => {
      setBooks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  // Seed fallback books into Firestore
  const handleSeedBooks = async () => {
    setSeeding(true);
    try {
      for (let i = 0; i < fallbackBooks.length; i++) {
        const fb = fallbackBooks[i];
        await addDoc(collection(db, 'books'), {
          title: fb.title,
          author: fb.author,
          description: fb.description,
          genre: fb.genre,
          coverUrl: fb.cover,
          driveUrl: fb.driveUrl || '',
          published: true,
          order: i,
          ratingSum: 0,
          ratingCount: 0,
          viewCount: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      showToast(`${fallbackBooks.length} books imported to Firestore!`, 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to import books.', 'error');
    }
    setSeeding(false);
  };

  const handleDelete = (book) => {
    showDialog({
      type: 'delete',
      title: `Delete "${book.title}"?`,
      message: 'This will permanently delete the book record. This cannot be undone.',
      confirmLabel: 'Delete Book',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'books', book.id));
          showToast('Book deleted.', 'success');
        } catch {
          showToast('Failed to delete book.', 'error');
        }
      },
    });
  };

  const togglePublished = async (book) => {
    try {
      await updateDoc(doc(db, 'books', book.id), { published: !book.published });
      showToast(book.published ? 'Book set to draft.' : 'Book published!', 'info');
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

  const avg = (b) => b.ratingCount > 0 ? (b.ratingSum / b.ratingCount).toFixed(1) : '—';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#1a1a1a] mb-1">Books</h1>
          <p className="text-[#888] text-sm">{books.length} total</p>
        </div>
        <div className="flex items-center gap-3">
          {books.length === 0 && (
            <button
              onClick={handleSeedBooks}
              disabled={seeding}
              className="flex items-center gap-2 px-5 py-2.5 border border-[#d4a84b] text-[#d4a84b] hover:bg-[#d4a84b] hover:text-white uppercase text-[0.75rem] tracking-[2px] font-bold transition-colors disabled:opacity-50"
            >
              <Upload size={15} />{seeding ? 'Importing…' : 'Import Template'}
            </button>
          )}
          <Link to="/admin/books/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#d4a84b] hover:bg-[#c49a3d] text-white uppercase text-[0.75rem] tracking-[2px] font-bold transition-colors">
            <Plus size={15} />Add Book
          </Link>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="bg-white border border-[#eee] p-16 text-center">
          <BookOpen size={36} className="text-[#ddd] mx-auto mb-4" />
          <p className="font-serif text-xl text-[#bbb] mb-2">No books yet</p>
          <p className="text-[#ccc] text-sm mb-6">Click "Import Template" to import your {fallbackBooks.length} hardcoded books, or add new ones manually.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleSeedBooks}
              disabled={seeding}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#1a1a1a] text-white uppercase text-[0.75rem] tracking-[2px] font-bold hover:bg-[#d4a84b] transition-colors disabled:opacity-50"
            >
              <Upload size={14} />{seeding ? 'Importing…' : `Import ${fallbackBooks.length} Books`}
            </button>
            <Link to="/admin/books/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 border border-[#1a1a1a] text-[#1a1a1a] uppercase text-[0.75rem] tracking-[2px] font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors">
              <Plus size={14} />Add Manually
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-[#eee] overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                <th className="text-left px-6 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Book</th>
                <th className="text-left px-4 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Genre</th>
                <th className="text-center px-4 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Rating</th>
                <th className="text-center px-4 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Views</th>
                <th className="text-center px-4 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Drive</th>
                <th className="text-center px-4 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Status</th>
                <th className="text-right px-6 py-4 text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-[#f9f9f9] hover:bg-[#fafafa] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-14 bg-[#eee] flex-shrink-0 overflow-hidden">
                        {book.coverUrl ? (
                          <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen size={14} className="text-[#bbb]" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1a1a1a]">{book.title}</p>
                        <p className="text-[0.75rem] text-[#888]">{book.author}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#626262]">{book.genre}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Star size={13} className="text-[#d4a84b] fill-[#d4a84b]" />
                      <span className="text-[#626262]">{avg(book)}</span>
                      <span className="text-[#bbb] text-[0.7rem]">({book.ratingCount || 0})</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-sm text-[#626262]">
                    {(book.viewCount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-center">
                    {book.driveUrl ? (
                      <a href={book.driveUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[0.7rem] text-[#d4a84b] hover:text-[#c49a3d] font-bold uppercase tracking-wider">
                        <ExternalLink size={11} />Link
                      </a>
                    ) : (
                      <span className="text-[0.7rem] text-[#ccc]">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button onClick={() => togglePublished(book)}
                      className={`flex items-center gap-1 mx-auto px-3 py-1 text-[0.65rem] uppercase tracking-wider font-bold transition-colors ${
                        book.published ? 'bg-green-50 text-green-600 hover:bg-green-100' : 'bg-[#f5f5f5] text-[#aaa] hover:bg-[#ebebeb]'
                      }`}>
                      {book.published ? <><Eye size={11} />Live</> : <><EyeOff size={11} />Draft</>}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <Link to={`/admin/books/${book.id}`}
                        className="p-2 text-[#888] hover:text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors">
                        <Pencil size={15} />
                      </Link>
                      <button onClick={() => handleDelete(book)}
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

export default AdminBooks;
