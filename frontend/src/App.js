import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './context/authStore';

// Pages
import LoginPage from './pages/LoginPage';
import HODLayout from './layouts/HODLayout';
import HODDashboard from './pages/hod/HODDashboard';
import FacultyManagement from './pages/hod/FacultyManagement';
import FacultyProfile from './pages/hod/FacultyProfile';
import AddEditFaculty from './pages/hod/AddEditFaculty';
import StudentManagement from './pages/hod/StudentManagement';
import CoordinatorManagement from './pages/hod/CoordinatorManagement';
import NotFound from './pages/NotFound';

// Route guards
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isHOD) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to="/hod/dashboard" replace />;
  }
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

        {/* HOD Routes */}
        <Route path="/hod" element={<ProtectedRoute><HODLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<HODDashboard />} />
          <Route path="faculty" element={<FacultyManagement />} />
          <Route path="faculty/add" element={<AddEditFaculty />} />
          <Route path="faculty/edit/:id" element={<AddEditFaculty />} />
          <Route path="faculty/:id" element={<FacultyProfile />} />
          <Route path="students" element={<StudentManagement />} />
          <Route path="coordinators" element={<CoordinatorManagement />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
