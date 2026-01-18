import { useEffect } from 'react';
import { X } from 'lucide-react';

function PDFReader({ book, onClose }) {
  const pdfUrl = `/books/${book.file}`;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="pdf-reader-overlay">
      <div className="pdf-reader-header">
        <h2 className="font-serif text-xl">{book.title}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          aria-label="Close reader"
        >
          <X size={24} />
        </button>
      </div>
      <div className="pdf-reader-content">
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
          title={book.title}
        />
      </div>
    </div>
  );
}

export default PDFReader;
