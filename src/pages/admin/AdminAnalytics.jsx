import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Eye, BookOpen, Code2, Globe } from 'lucide-react';

const RANGES = [
  { label: '7 days', days: 7 },
  { label: '14 days', days: 14 },
  { label: '30 days', days: 30 },
];

function BarChart({ data, height = 140 }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center flex-1 min-w-0 group">
          <div className="relative w-full">
            <div
              className="w-full bg-[#d4a84b] opacity-80 group-hover:opacity-100 transition-opacity rounded-t"
              style={{ height: `${Math.max(2, (item.value / max) * (height - 24))}px` }}
              title={`${item.label}: ${item.value}`}
            />
          </div>
          <span className="text-[0.55rem] text-[#bbb] mt-1 truncate w-full text-center">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

function AdminAnalytics() {
  const [range, setRange] = useState(7);
  const [logs, setLogs] = useState([]);
  const [books, setBooks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const since = new Date(Date.now() - range * 24 * 60 * 60 * 1000);
        const [logsSnap, booksSnap, projSnap] = await Promise.all([
          getDocs(query(collection(db, 'view_logs'), where('createdAt', '>=', since))),
          getDocs(query(collection(db, 'books'), orderBy('viewCount', 'desc'))),
          getDocs(query(collection(db, 'projects'), orderBy('viewCount', 'desc'))),
        ]);
        setLogs(logsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setBooks(booksSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setProjects(projSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [range]);

  // Aggregate views by day
  const viewsByDay = (() => {
    const days = [];
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
      const value = logs.filter((l) => {
        const logDate = l.createdAt?.toDate ? l.createdAt.toDate().toISOString().split('T')[0] : '';
        return logDate === key;
      }).length;
      days.push({ label, value });
    }
    return days;
  })();

  // Views by country
  const byCountry = logs.reduce((acc, l) => {
    const c = l.country || 'Unknown';
    acc[c] = (acc[c] || 0) + 1;
    return acc;
  }, {});
  const topCountries = Object.entries(byCountry).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const totalForCountries = logs.length || 1;

  const totalViews = logs.length;
  const bookViews = logs.filter((l) => l.itemType === 'book').length;
  const projViews = logs.filter((l) => l.itemType === 'project').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-[#d4a84b] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl text-[#1a1a1a] mb-1">Analytics</h1>
          <p className="text-[#888] text-sm">View data stored for 30 days.</p>
        </div>
        <div className="flex gap-2">
          {RANGES.map((r) => (
            <button key={r.days} onClick={() => setRange(r.days)}
              className={`px-4 py-2 text-[0.75rem] uppercase tracking-wider font-bold transition-colors border ${
                range === r.days ? 'bg-[#1a1a1a] text-white border-[#1a1a1a]' : 'border-[#eee] text-[#888] hover:border-[#1a1a1a] hover:text-[#1a1a1a]'
              }`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { icon: Eye, label: 'Total Views', value: totalViews, color: 'bg-slate-700' },
          { icon: BookOpen, label: 'Book Views', value: bookViews, color: 'bg-[#1a1a1a]' },
          { icon: Code2, label: 'Project Views', value: projViews, color: 'bg-[#d4a84b]' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white border border-[#eee] p-5 flex items-center gap-4">
            <div className={`w-10 h-10 ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <p className="text-[0.7rem] uppercase tracking-[1.5px] text-[#888] font-bold">{label}</p>
              <p className="font-serif text-2xl text-[#1a1a1a]">{value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white border border-[#eee] p-6 mb-6">
        <h2 className="font-serif text-lg text-[#1a1a1a] mb-6">Views Over Time</h2>
        {totalViews === 0 ? (
          <p className="text-[#bbb] text-sm italic text-center py-8">No views in this period.</p>
        ) : (
          <BarChart data={viewsByDay} />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Location breakdown */}
        <div className="bg-white border border-[#eee] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe size={16} className="text-[#d4a84b]" />
            <h2 className="font-serif text-lg text-[#1a1a1a]">Views by Country</h2>
          </div>
          {topCountries.length === 0 ? (
            <p className="text-[#bbb] text-sm italic">No location data yet.</p>
          ) : (
            <div className="space-y-3">
              {topCountries.map(([country, count]) => {
                const pct = Math.round((count / totalForCountries) * 100);
                return (
                  <div key={country}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-[#626262]">{country}</span>
                      <span className="text-[0.75rem] text-[#888] font-bold">{count} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-[#f5f5f5] rounded-full overflow-hidden">
                      <div className="h-full bg-[#d4a84b]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top items */}
        <div className="bg-white border border-[#eee] p-6">
          <h2 className="font-serif text-lg text-[#1a1a1a] mb-5">Top Items by Views</h2>
          <div className="space-y-3">
            {[...books.slice(0, 3).map((b) => ({ ...b, type: 'book' })),
              ...projects.slice(0, 3).map((p) => ({ ...p, type: 'project' })),
            ]
              .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
              .slice(0, 6)
              .map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[0.6rem] uppercase tracking-wider font-bold px-2 py-0.5 flex-shrink-0 ${
                      item.type === 'book' ? 'bg-[#1a1a1a] text-white' : 'bg-[#d4a84b] text-white'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-sm text-[#626262] truncate">{item.title}</span>
                  </div>
                  <span className="text-sm font-bold text-[#1a1a1a] flex-shrink-0">
                    {(item.viewCount || 0).toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Ratings table */}
      <div className="bg-white border border-[#eee] p-6">
        <h2 className="font-serif text-lg text-[#1a1a1a] mb-5">Book Ratings</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#f0f0f0]">
                <th className="text-left py-2 px-3 text-[0.7rem] uppercase tracking-wider text-[#888] font-bold">Book</th>
                <th className="text-center py-2 px-3 text-[0.7rem] uppercase tracking-wider text-[#888] font-bold">Avg Rating</th>
                <th className="text-center py-2 px-3 text-[0.7rem] uppercase tracking-wider text-[#888] font-bold">Total Ratings</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b) => (
                <tr key={b.id} className="border-b border-[#f9f9f9]">
                  <td className="py-2 px-3 text-[#626262]">{b.title}</td>
                  <td className="py-2 px-3 text-center text-[#1a1a1a] font-bold">
                    {b.ratingCount > 0 ? (b.ratingSum / b.ratingCount).toFixed(1) + ' ★' : '—'}
                  </td>
                  <td className="py-2 px-3 text-center text-[#888]">{b.ratingCount || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAnalytics;
