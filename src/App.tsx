import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Demo } from './pages/Demo';
import { Dashboard } from './pages/Dashboard';
import { Toast } from './components/Toast';

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans text-ink-900 bg-surface">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast />
      </div>
    </BrowserRouter>
  );
}

export default App;
