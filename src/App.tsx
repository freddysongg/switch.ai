'use client';

import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { AuthProvider } from '@/contexts/AuthContext';
import { loadSavedTheme } from '@/lib/themeService';

import AboutPage from '@/app/about/page';
import { ChatInterface } from '@/app/chat/page';
import { LoginPage } from '@/app/login/page';
import LandingPage from '@/app/marketing/page';
import { RegisterPage } from '@/app/register/page';

import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/themes/ThemeProvider.js';

import './App.css';

import { useAuth } from './hooks/use-auth';

function AppContent() {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedTheme();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route
        path="/chat"
        element={currentUser ? <ChatInterface /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={!currentUser ? <LoginPage /> : <Navigate to="/chat" replace />}
      />
      <Route
        path="/register"
        element={
          !currentUser ? (
            <RegisterPage
              onSwitchToLogin={() => {
                navigate('/login');
              }}
            />
          ) : (
            <Navigate to="/chat" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="switch-ai-theme">
      <AuthProvider>
        <div className="h-full w-full font-mono">
          <AppContent />
          <Toaster />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
