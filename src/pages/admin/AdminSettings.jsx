import { useEffect, useState } from 'react';
import {
  collection, doc, setDoc, deleteDoc, getDocs, serverTimestamp,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useDialog } from '../../context/DialogContext';
import { UserPlus, Trash2, ShieldCheck, Crown } from 'lucide-react';

const MAX_ADMINS = 3;

function AdminSettings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [adding, setAdding] = useState(false);

  const loadAdmins = async () => {
    try {
      const snap = await getDocs(collection(db, 'admins'));
      setAdmins(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch {
      showToast('Failed to load admin list.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAdmins(); }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    if (admins.length >= MAX_ADMINS) {
      showDialog({
        type: 'error',
        title: 'Max Admin Accounts Reached',
        message: `For security, a maximum of ${MAX_ADMINS} admin accounts are allowed. Please remove an existing admin before adding a new one.`,
      });
      return;
    }

    setAdding(true);
    // Save current user credentials to restore session after creating new account
    const currentEmail = user.email;

    try {
      // Create Firebase Auth account for new admin
      const newCred = await createUserWithEmailAndPassword(auth, form.email, form.password);

      // Write to admins collection
      await setDoc(doc(db, 'admins', newCred.user.uid), {
        email: form.email,
        displayName: form.name,
        createdAt: serverTimestamp(),
        createdBy: user.uid,
      });

      showToast(`Admin "${form.name}" added successfully.`, 'success');
      setShowAddForm(false);
      setForm({ name: '', email: '', password: '' });

      // Sign back in as the original admin (Firebase switches auth on createUser)
      // We need the original admin's password — we can't restore it silently.
      // Instead, inform admin they need to sign in again.
      showDialog({
        type: 'info',
        title: 'Session Refreshed',
        message: 'Firebase switched your session to the new account during creation. Please sign in again with your credentials.',
        onConfirm: () => signOut(auth),
      });
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        showToast('That email already has a Firebase account.', 'error');
      } else {
        showToast('Failed to create admin: ' + err.message, 'error');
      }
    } finally {
      setAdding(false);
      await loadAdmins();
    }
  };

  const handleRemoveAdmin = (admin) => {
    if (admin.id === user.uid) {
      showDialog({
        type: 'error',
        title: 'Cannot Remove Yourself',
        message: 'You cannot remove your own admin account while signed in.',
      });
      return;
    }

    showDialog({
      type: 'delete',
      title: `Remove "${admin.displayName || admin.email}"?`,
      message: 'This will revoke their admin access immediately. Their Firebase Auth account will remain.',
      confirmLabel: 'Remove Admin',
      onConfirm: async () => {
        try {
          await deleteDoc(doc(db, 'admins', admin.id));
          showToast('Admin access revoked.', 'success');
          setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
        } catch {
          showToast('Failed to remove admin.', 'error');
        }
      },
    });
  };

  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-[#d4a84b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1a1a] mb-1">Settings</h1>
        <p className="text-[#888] text-sm">Manage admin accounts.</p>
      </div>

      {/* Admin accounts */}
      <div className="bg-white border border-[#eee] p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-serif text-lg text-[#1a1a1a]">Admin Accounts</h2>
            <p className="text-[0.75rem] text-[#aaa] mt-0.5">
              {admins.length} / {MAX_ADMINS} accounts used
            </p>
          </div>
          <button
            onClick={() => {
              if (admins.length >= MAX_ADMINS) {
                showDialog({
                  type: 'error',
                  title: 'Max Admin Accounts Reached',
                  message: `Maximum of ${MAX_ADMINS} admin accounts allowed for security. Remove one before adding another.`,
                });
                return;
              }
              setShowAddForm((v) => !v);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#d4a84b] text-white uppercase text-[0.75rem] tracking-[1.5px] font-bold transition-colors"
          >
            <UserPlus size={14} />Add Admin
          </button>
        </div>

        {/* Capacity bar */}
        <div className="mb-5">
          <div className="h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${admins.length >= MAX_ADMINS ? 'bg-red-400' : 'bg-[#d4a84b]'}`}
              style={{ width: `${(admins.length / MAX_ADMINS) * 100}%` }}
            />
          </div>
        </div>

        {/* Admin list */}
        <div className="space-y-3">
          {admins.map((admin) => (
            <div key={admin.id} className={`flex items-center gap-4 p-4 border ${admin.id === user.uid ? 'border-[#d4a84b]/30 bg-[#fff8e6]/30' : 'border-[#f5f5f5]'}`}>
              <div className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center flex-shrink-0">
                {admin.id === user.uid
                  ? <Crown size={14} className="text-[#d4a84b]" />
                  : <ShieldCheck size={14} className="text-white" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#1a1a1a] truncate">
                  {admin.displayName || 'Admin'}
                  {admin.id === user.uid && (
                    <span className="ml-2 text-[0.65rem] text-[#d4a84b] uppercase tracking-wider font-bold">(You)</span>
                  )}
                </p>
                <p className="text-[0.75rem] text-[#888] truncate">{admin.email}</p>
                <p className="text-[0.7rem] text-[#bbb]">Added {formatDate(admin.createdAt)}</p>
              </div>
              {admin.id !== user.uid && (
                <button
                  onClick={() => handleRemoveAdmin(admin)}
                  className="p-2 text-[#bbb] hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Add admin form */}
        {showAddForm && (
          <form onSubmit={handleAddAdmin} className="mt-6 pt-6 border-t border-[#f0f0f0] space-y-4">
            <h3 className="font-serif text-base text-[#1a1a1a]">Add New Admin</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">Display Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required
                  className="w-full border border-[#e0e0e0] px-4 py-3 text-sm focus:outline-none focus:border-[#d4a84b] bg-white" />
              </div>
              <div>
                <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required
                  className="w-full border border-[#e0e0e0] px-4 py-3 text-sm focus:outline-none focus:border-[#d4a84b] bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">Temporary Password *</label>
              <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required minLength={8}
                placeholder="Min 8 characters"
                className="w-full border border-[#e0e0e0] px-4 py-3 text-sm focus:outline-none focus:border-[#d4a84b] bg-white" />
            </div>
            <div className="bg-orange-50 border border-orange-200 px-4 py-3 text-[0.75rem] text-orange-700">
              ⚠ Creating a new admin will temporarily sign you out. You'll need to sign in again with your own credentials.
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={adding}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#d4a84b] hover:bg-[#c49a3d] disabled:opacity-50 text-white uppercase text-[0.75rem] tracking-[2px] font-bold transition-colors">
                <UserPlus size={13} />{adding ? 'Creating…' : 'Create Admin'}
              </button>
              <button type="button" onClick={() => setShowAddForm(false)}
                className="px-6 py-2.5 border border-[#ddd] text-[#888] uppercase text-[0.75rem] tracking-[2px] font-bold hover:border-[#1a1a1a] hover:text-[#1a1a1a] transition-colors">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Info */}
      <div className="bg-[#f9f9f9] border border-[#eee] p-5 text-[0.8rem] text-[#888] space-y-2">
        <p className="font-bold text-[#626262] uppercase tracking-wider text-[0.7rem]">Security Notes</p>
        <p>• Maximum {MAX_ADMINS} admin accounts are allowed for security. This limit is enforced in the UI.</p>
        <p>• Admin access is verified on every page load against the Firestore <code className="bg-[#eee] px-1">admins</code> collection.</p>
        <p>• To fully revoke access, also delete the user from <strong>Firebase Console → Authentication</strong>.</p>
        <p>• The first admin must be created manually via the Firebase Console.</p>
      </div>
    </div>
  );
}

export default AdminSettings;
