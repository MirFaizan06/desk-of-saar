import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { Eye, EyeOff, Lock } from 'lucide-react';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      // Verify admin status
      const adminDoc = await getDoc(doc(db, 'admins', cred.user.uid));
      if (!adminDoc.exists()) {
        await auth.signOut();
        setError('This account is not authorised as an admin.');
        return;
      }
      navigate('/admin');
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password.');
      } else {
        setError('Sign in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
        {/* Header */}
        <div className="bg-[#1a1a1a] px-10 py-10 text-center">
          <span className="text-2xl uppercase tracking-[4px] font-bold text-white block mb-2">Saar</span>
          <div className="flex items-center justify-center gap-2 text-white/40">
            <Lock size={13} />
            <span className="text-[0.7rem] uppercase tracking-[2px]">Admin Portal</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-10 py-10 space-y-5">
          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full border border-[#e0e0e0] px-4 py-3 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4a84b] transition-colors"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full border border-[#e0e0e0] px-4 py-3 pr-11 text-sm text-[#1a1a1a] focus:outline-none focus:border-[#d4a84b] transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#aaa] hover:text-[#1a1a1a]"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="py-3 px-4 bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#d4a84b] hover:bg-[#c49a3d] disabled:opacity-50 text-white uppercase text-[0.8rem] tracking-[2px] font-bold transition-colors"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
