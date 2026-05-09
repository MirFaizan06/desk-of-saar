import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import AdminLayout from './pages/admin/AdminLayout';

// Lazy-loaded admin pages — kept out of the public bundle
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBooks = lazy(() => import('./pages/admin/AdminBooks'));
const AdminBookForm = lazy(() => import('./pages/admin/AdminBookForm'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const Fallback = () => (
  <div className="min-h-screen bg-[var(--color-shiro)] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[var(--color-kaki)] border-t-transparent rounded-full animate-spin" />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Suspense fallback={<Fallback />}><AdminDashboard /></Suspense> },
      { path: 'login', element: <Suspense fallback={<Fallback />}><AdminLogin /></Suspense> },
      { path: 'books', element: <Suspense fallback={<Fallback />}><AdminBooks /></Suspense> },
      { path: 'books/new', element: <Suspense fallback={<Fallback />}><AdminBookForm /></Suspense> },
      { path: 'books/:id', element: <Suspense fallback={<Fallback />}><AdminBookForm /></Suspense> },
      { path: 'analytics', element: <Suspense fallback={<Fallback />}><AdminAnalytics /></Suspense> },
      { path: 'contacts', element: <Suspense fallback={<Fallback />}><AdminContacts /></Suspense> },
      { path: 'settings', element: <Suspense fallback={<Fallback />}><AdminSettings /></Suspense> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
