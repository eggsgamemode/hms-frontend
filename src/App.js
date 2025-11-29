import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import HospitalRegister from './components/HospitalRegister';
import Patients from './components/Patients';
import Prescriptions from './components/Prescriptions';
import Users from './components/Users';
import Dashboard from './components/Dashboard';

function AppContent() {
  const { user, token } = useAuth();

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
         <Route path="/" element={<HospitalRegister />} />
         <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
         <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />  // ← THIS ONE
         <Route path="/users" element={<Users />} />
         <Route path="/patients" element={<Patients />} />
         <Route path="/prescriptions" element={<Prescriptions />} />
         <Route path="*" element={<Navigate to="/" />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;