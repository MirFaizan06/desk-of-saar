import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setContacts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const markRead = async (contact) => {
    if (contact.read) return;
    try {
      await updateDoc(doc(db, 'contacts', contact.id), { read: true });
    } catch {
      showToast('Failed to mark as read.', 'error');
    }
  };

  const handleDelete = (contact) => {
    showDialog({
      type: 'delete',
      title: 'Delete message?',
      message: `This message from ${contact.name} will be permanently deleted.`,
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'contacts', contact.id));
          showToast('Message deleted.', 'success');
          if (expanded === contact.id) setExpanded(null);
        } catch {
          showToast('Failed to delete.', 'error');
        }
      },
    });
  };

  const toggle = (contact) => {
    const newExpanded = expanded === contact.id ? null : contact.id;
    setExpanded(newExpanded);
    if (newExpanded && !contact.read) markRead(contact);
  };

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const unread = contacts.filter((c) => !c.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-[#d4a84b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1a1a] mb-1">Messages</h1>
        <p className="text-[#888] text-sm">
          {contacts.length} total
          {unread > 0 && <span className="ml-2 px-2 py-0.5 bg-[#d4a84b] text-white text-[0.65rem] uppercase tracking-wider font-bold">{unread} unread</span>}
        </p>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white border border-[#eee] p-16 text-center">
          <Mail size={36} className="text-[#ddd] mx-auto mb-4" />
          <p className="font-serif text-xl text-[#bbb]">No messages yet</p>
          <p className="text-[#ccc] text-sm mt-2">Messages from your contact form will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white border transition-colors ${
                !contact.read ? 'border-[#d4a84b]/40 bg-[#fff8e6]/30' : 'border-[#eee]'
              }`}
            >
              {/* Summary row */}
              <div
                className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-[#fafafa] transition-colors"
                onClick={() => toggle(contact)}
              >
                <div className="flex-shrink-0">
                  {contact.read
                    ? <MailOpen size={16} className="text-[#bbb]" />
                    : <Mail size={16} className="text-[#d4a84b]" />
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#1a1a1a]">{contact.name}</span>
                    {!contact.read && (
                      <span className="w-2 h-2 rounded-full bg-[#d4a84b] flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[0.75rem] text-[#aaa] truncate">{contact.email}</span>
                    {contact.subject && (
                      <>
                        <span className="text-[#ddd]">·</span>
                        <span className="text-[0.75rem] text-[#888] truncate">{contact.subject}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-[0.7rem] text-[#bbb] hidden sm:block">{formatDate(contact.createdAt)}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(contact); }}
                    className="p-1.5 text-[#bbb] hover:text-red-500 hover:bg-red-50 transition-colors rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                  {expanded === contact.id ? <ChevronUp size={16} className="text-[#888]" /> : <ChevronDown size={16} className="text-[#888]" />}
                </div>
              </div>

              {/* Expanded message */}
              {expanded === contact.id && (
                <div className="px-5 pb-5 border-t border-[#f5f5f5] pt-4">
                  <p className="text-[0.7rem] text-[#bbb] mb-3 sm:hidden">{formatDate(contact.createdAt)}</p>
                  <p className="text-sm text-[#626262] leading-relaxed whitespace-pre-wrap">{contact.message}</p>
                  <div className="mt-4 pt-4 border-t border-[#f5f5f5] flex items-center gap-3">
                    <a
                      href={`mailto:${contact.email}?subject=Re: ${encodeURIComponent(contact.subject || 'Your message')}`}
                      className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-[0.75rem] uppercase tracking-wider font-bold hover:bg-[#d4a84b] transition-colors"
                    >
                      <Mail size={13} />Reply via Email
                    </a>
                    {!contact.read && (
                      <button
                        onClick={() => markRead(contact)}
                        className="flex items-center gap-2 px-4 py-2 border border-[#eee] text-[#888] text-[0.75rem] uppercase tracking-wider font-bold hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors"
                      >
                        <MailOpen size={13} />Mark Read
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminContacts;
