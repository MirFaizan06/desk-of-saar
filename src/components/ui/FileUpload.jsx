import { useRef, useState } from 'react';
import { UploadCloud, X, FileText, Image } from 'lucide-react';
import { uploadToS3, deleteFromS3, generateS3Key } from '../../lib/s3';

/**
 * FileUpload — drag-drop or click, uploads immediately to S3, reports progress.
 *
 * Props:
 *   folder      {string}   S3 folder prefix (e.g. "covers", "books")
 *   accept      {string}   File input accept attribute (e.g. "image/*", ".pdf")
 *   label       {string}   Label text
 *   currentUrl  {string}   Existing file URL (for preview)
 *   currentKey  {string}   Existing S3 key (will be deleted on replacement)
 *   onUploaded  {fn}       Called with { url, key } on success
 *   onRemove    {fn}       Called when existing file is cleared
 *   maxMB       {number}   Max file size in MB (default 50)
 */
function FileUpload({ folder, accept, label, currentUrl, currentKey, onUploaded, onRemove, maxMB = 50 }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const isImage = accept?.startsWith('image') || folder === 'covers' || folder === 'thumbnails';
  const Icon = isImage ? Image : FileText;

  const handleFile = async (file) => {
    if (!file) return;
    setError('');

    if (file.size > maxMB * 1024 * 1024) {
      setError(`File exceeds ${maxMB} MB limit.`);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // Delete the old file if replacing
      if (currentKey) {
        await deleteFromS3(currentKey).catch(() => {});
      }

      const key = generateS3Key(folder, file.name);
      const url = await uploadToS3(file, key, setProgress);
      onUploaded({ url, key });
    } catch (err) {
      setError('Upload failed. Check your S3 configuration.');
      console.error(err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleRemove = async () => {
    if (currentKey) {
      await deleteFromS3(currentKey).catch(() => {});
    }
    onRemove?.();
  };

  return (
    <div>
      {label && (
        <label className="block text-[0.75rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">
          {label}
        </label>
      )}

      {currentUrl ? (
        <div className="relative border border-[#eee] p-3 bg-[#f9f9f9]">
          {isImage ? (
            <img src={currentUrl} alt="Preview" className="w-full max-h-48 object-contain" />
          ) : (
            <div className="flex items-center gap-3 py-2">
              <FileText size={20} className="text-[#d4a84b]" />
              <span className="text-sm text-[#626262] truncate flex-1">File uploaded</span>
            </div>
          )}
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
          className={`border-2 border-dashed rounded transition-colors cursor-pointer p-6 text-center ${
            dragging ? 'border-[#d4a84b] bg-[#fff8e6]' : 'border-[#ddd] hover:border-[#d4a84b]'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          <Icon size={28} className="text-[#ccc] mx-auto mb-3" />
          {uploading ? (
            <div>
              <p className="text-sm text-[#888] mb-2">Uploading… {progress}%</p>
              <div className="h-1.5 bg-[#eee] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#d4a84b] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-[#888]">
                <span className="text-[#d4a84b] font-bold">Click to upload</span> or drag & drop
              </p>
              <p className="text-[0.7rem] text-[#bbb] mt-1">Max {maxMB} MB</p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default FileUpload;
