import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './pages/Sidebar.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Purchases from './pages/Purchases.jsx';
import Transfers from './pages/Transfers.jsx';
import AssignmentsExpenditures from './pages/AssignmentsExpenditures.jsx';
import AuditLog from './pages/AuditLog.jsx';
import ResourceManagement from './pages/ResourceManagement.jsx';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page without sidebar */}
        <Route path="/" element={<Login />} />
        
        {/* All other pages with sidebar */}
        <Route 
          path="/dashboard" 
          element={
            <RequireAuth>
              <Layout>
                <Dashboard />
              </Layout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/purchases" 
          element={
            <RequireAuth>
              <Layout>
                <Purchases />
              </Layout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/transfers" 
          element={
            <RequireAuth>
              <Layout>
                <Transfers />
              </Layout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/assignments" 
          element={
            <RequireAuth>
              <Layout>
                <AssignmentsExpenditures />
              </Layout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/auditlog" 
          element={
            <RequireAuth>
              <Layout>
                <AuditLog />
              </Layout>
            </RequireAuth>
          } 
        />
        <Route 
          path="/resource-management" 
          element={
            <RequireAuth>
              <Layout>
                <ResourceManagement />
              </Layout>
            </RequireAuth>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
