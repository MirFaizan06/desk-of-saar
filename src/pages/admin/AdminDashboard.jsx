import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { BookOpen, Code2, Eye, Mail, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, color, to }) {
  const content = (
    <div className="bg-white p-6 border border-[#eee] hover:shadow-md transition-shadow flex items-center gap-5">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold mb-1">{label}</p>
        <p className="font-serif text-3xl text-[#1a1a1a]">{value ?? '—'}</p>
      </div>
    </div>
  );
  return to ? <Link to={to}>{content}</Link> : content;
}

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentViews, setRecentViews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [booksSnap, projSnap, contactsSnap, unreadSnap] = await Promise.all([
          getDocs(collection(db, 'books')),
          getDocs(collection(db, 'projects')),
          getDocs(query(collection(db, 'contacts'), orderBy('createdAt', 'desc'), limit(5))),
          getDocs(query(collection(db, 'contacts'), where('read', '==', false))),
        ]);

        let totalViews = 0;
        booksSnap.docs.forEach((d) => { totalViews += d.data().viewCount || 0; });
        projSnap.docs.forEach((d) => { totalViews += d.data().viewCount || 0; });

        setStats({
          books: booksSnap.size,
          projects: projSnap.size,
          totalViews,
          unreadMessages: unreadSnap.size,
        });

        setRecentMessages(contactsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Recent views from view_logs
        const viewsSnap = await getDocs(
          query(collection(db, 'view_logs'), orderBy('createdAt', 'desc'), limit(8))
        );
        setRecentViews(viewsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-[#d4a84b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const formatDate = (ts) => {
    if (!ts) return '';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#1a1a1a] mb-1">Dashboard</h1>
        <p className="text-[#888] text-sm">Welcome back. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        <StatCard icon={BookOpen} label="Total Books" value={stats?.books} color="bg-[#1a1a1a]" to="/admin/books" />
        <StatCard icon={Code2} label="Code Projects" value={stats?.projects} color="bg-[#d4a84b]" to="/admin/projects" />
        <StatCard icon={Eye} label="Total Views" value={stats?.totalViews?.toLocaleString()} color="bg-slate-500" to="/admin/analytics" />
        <StatCard icon={Mail} label="Unread Messages" value={stats?.unreadMessages} color="bg-emerald-600" to="/admin/contacts" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <div className="bg-white border border-[#eee] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg text-[#1a1a1a]">Recent Messages</h2>
            <Link to="/admin/contacts" className="text-[0.7rem] text-[#d4a84b] uppercase tracking-wider font-bold hover:underline">
              View All
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-[#bbb] text-sm italic">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="flex items-start gap-3 pb-4 border-b border-[#f5f5f5] last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${msg.read ? 'bg-[#ddd]' : 'bg-[#d4a84b]'}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-[#1a1a1a] font-bold truncate">{msg.name}</p>
                    <p className="text-[0.75rem] text-[#888] truncate">{msg.subject || msg.message?.slice(0, 50)}</p>
                    <p className="text-[0.7rem] text-[#bbb] mt-0.5 flex items-center gap-1">
                      <Clock size={10} />{formatDate(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Views */}
        <div className="bg-white border border-[#eee] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-serif text-lg text-[#1a1a1a]">Recent Views</h2>
            <Link to="/admin/analytics" className="text-[0.7rem] text-[#d4a84b] uppercase tracking-wider font-bold hover:underline">
              Analytics
            </Link>
          </div>
          {recentViews.length === 0 ? (
            <p className="text-[#bbb] text-sm italic">No views recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {recentViews.map((v) => (
                <div key={v.id} className="flex items-center justify-between text-sm pb-3 border-b border-[#f5f5f5] last:border-0 last:pb-0">
                  <div className="min-w-0">
                    <span className={`text-[0.65rem] uppercase tracking-wider font-bold px-2 py-0.5 mr-2 ${v.itemType === 'book' ? 'bg-[#1a1a1a] text-white' : 'bg-[#d4a84b] text-white'}`}>
                      {v.itemType}
                    </span>
                    <span className="text-[#888] text-[0.75rem]">{v.country || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#bbb] text-[0.7rem] flex-shrink-0">
                    <TrendingUp size={10} />
                    {formatDate(v.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
