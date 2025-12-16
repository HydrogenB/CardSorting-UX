import { createBrowserRouter, Navigate } from 'react-router-dom';
import StudioPage from '@/pages/StudioPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <StudioPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
