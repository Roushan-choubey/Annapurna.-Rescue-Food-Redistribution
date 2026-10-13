import React, { useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, setAuthToken, DEMO_ACCOUNTS, api } from './api/client';
import DemoRoleSwitcher from './components/DemoRoleSwitcher';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistantBot from './components/AIAssistantBot';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DonorDashboard from './pages/DonorDashboard';
import NgoDashboard from './pages/NgoDashboard';
import VolunteerDashboard from './pages/VolunteerDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  const [currentUser, setUser] = useState(getCurrentUser());
  const [currentView, setView] = useState(() => {
    const user = getCurrentUser();
    if (!user) return 'landing';
    return user.role ? user.role.toLowerCase() : 'landing';
  });

  const handleUserChange = (user) => {
    setUser(user);
    if (!user) {
      setView('landing');
    }
  };

  const handleDemoLogin = async (roleKey) => {
    const account = DEMO_ACCOUNTS[roleKey];
    try {
      const res = await api.login(account.email, account.password);
      setAuthToken(res.token);
      setCurrentUser(res);
      setUser(res);
      setView(res.role.toLowerCase());
    } catch (err) {
      // Local fallback
      const mockUser = {
        ...account,
        id: roleKey === 'ADMIN' ? 1 : roleKey === 'DONOR' ? 2 : 4,
        token: 'demo-token-' + roleKey
      };
      setAuthToken(mockUser.token);
      setCurrentUser(mockUser);
      setUser(mockUser);
      setView(mockUser.role.toLowerCase());
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Demo Bar for Reviewers & Academic Evaluation */}
      <DemoRoleSwitcher
        currentUser={currentUser}
        onUserChange={handleUserChange}
        onNavigate={setView}
      />

      {/* Main Sticky Navbar */}
      <Navbar
        currentUser={currentUser}
        onUserChange={handleUserChange}
        activeTab={currentView}
        onNavigate={setView}
      />

      {/* Main View Area */}
      <main style={{ flex: 1 }}>
        {currentView === 'landing' && (
          <LandingPage
            onNavigate={setView}
            onDemoLogin={handleDemoLogin}
          />
        )}

        {currentView === 'login' && (
          <LoginPage
            onUserChange={handleUserChange}
            onNavigate={setView}
          />
        )}

        {currentView === 'register' && (
          <RegisterPage
            onUserChange={handleUserChange}
            onNavigate={setView}
          />
        )}

        {currentView === 'donor' && (
          <DonorDashboard currentUser={currentUser} />
        )}

        {currentView === 'ngo' && (
          <NgoDashboard currentUser={currentUser} />
        )}

        {currentView === 'volunteer' && (
          <VolunteerDashboard currentUser={currentUser} />
        )}

        {currentView === 'admin' && (
          <AdminDashboard currentUser={currentUser} />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={setView} />

      {/* 24/7 Interactive AI Bot Assistant for Visitors */}
      <AIAssistantBot 
        onNavigate={setView}
        onDemoLogin={handleDemoLogin}
      />
    </div>
  );
}
