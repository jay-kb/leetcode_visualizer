import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import AdminLayout from '../pages/AdminLayout';
import SolutionManage from '../pages/SolutionManage';
import TagManage from '../pages/TagManage';
import ViewStats from '../pages/ViewStats';

// 路由守卫
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/view-stats" replace />,
      },
      {
        path: 'solutions',
        element: <SolutionManage />,
      },
      {
        path: 'tags',
        element: <TagManage />,
      },
      {
        path: 'view-stats',
        element: <ViewStats />,
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
