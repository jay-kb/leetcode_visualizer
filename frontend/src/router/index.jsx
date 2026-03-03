import { createBrowserRouter, Navigate } from 'react-router-dom';

// 页面组件
import Home from '../pages/Home';
import SolutionDetail from '../pages/SolutionDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/solution/:id',
    element: <SolutionDetail />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
