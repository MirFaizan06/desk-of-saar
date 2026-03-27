import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getUserId, canSubmitContact, markContactSubmitted } from '../lib/fingerprint';
import { Send } from 'lucide-react';

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | 'rate-limited'

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmitContact()) {
      setStatus('rate-limited');
      return;
    }
    setLoading(true);
    setStatus(null);
    try {
      await addDoc(collection(db, 'contacts'), {
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        uid: getUserId(),
        read: false,
        createdAt: serverTimestamp(),
      });
      markContactSubmitted();
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-[#e0e0e0] bg-white px-4 py-3 text-[0.9rem] text-[#1a1a1a] placeholder-[#bbb] focus:outline-none focus:border-[#d4a84b] transition-colors';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="Your Name *"
            value={form.name}
            onChange={set('name')}
            required
            maxLength={100}
            className={inputClass}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Your Email *"
            value={form.email}
            onChange={set('email')}
            required
            className={inputClass}
          />
        </div>
      </div>

      <input
        type="text"
        placeholder="Subject (optional)"
        value={form.subject}
        onChange={set('subject')}
        maxLength={200}
        className={inputClass}
      />

      <textarea
        placeholder="Your Message *"
        value={form.message}
        onChange={set('message')}
        required
        rows={5}
        maxLength={2000}
        className={`${inputClass} resize-none`}
      />

      {status === 'success' && (
        <div className="py-3 px-4 bg-green-50 border border-green-200 text-green-700 text-sm">
          Message sent! I'll get back to you soon.
        </div>
      )}
      {status === 'error' && (
        <div className="py-3 px-4 bg-red-50 border border-red-200 text-red-700 text-sm">
          Failed to send. Please try again.
        </div>
      )}
      {status === 'rate-limited' && (
        <div className="py-3 px-4 bg-orange-50 border border-orange-200 text-orange-700 text-sm">
          Please wait 10 minutes before sending another message.
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-8 py-3 bg-[#d4a84b] hover:bg-[#c49a3d] disabled:opacity-50 text-white uppercase text-[0.8rem] tracking-[2px] font-bold transition-colors"
      >
        <Send size={14} />
        {loading ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}

export default ContactForm;
