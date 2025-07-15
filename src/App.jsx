import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/authentication/Login';
import Register from './pages/authentication/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { useAuth } from './context/AuthContext';
import BackupPage from './pages/Backup/BackupPage';

function App() {

  const { token } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/" /> : <Register />} />
        
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/backup"
          element={
            <ProtectedRoute>
              <BackupPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;