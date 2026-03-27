import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import AdminLayout from './pages/admin/AdminLayout';

// Lazy-loaded admin pages — kept out of the public bundle
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminBooks = lazy(() => import('./pages/admin/AdminBooks'));
const AdminBookForm = lazy(() => import('./pages/admin/AdminBookForm'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects'));
const AdminProjectForm = lazy(() => import('./pages/admin/AdminProjectForm'));
const AdminAnalytics = lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminContacts = lazy(() => import('./pages/admin/AdminContacts'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

const Fallback = () => (
  <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-[#d4a84b] border-t-transparent rounded-full animate-spin" />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
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
      { path: 'projects', element: <Suspense fallback={<Fallback />}><AdminProjects /></Suspense> },
      { path: 'projects/new', element: <Suspense fallback={<Fallback />}><AdminProjectForm /></Suspense> },
      { path: 'projects/:id', element: <Suspense fallback={<Fallback />}><AdminProjectForm /></Suspense> },
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
