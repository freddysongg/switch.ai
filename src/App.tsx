'use client';

import { useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { AuthProvider } from '@/contexts/AuthContext';
import { loadSavedTheme } from '@/lib/ThemeService';

import AboutPage from '@/app/about/page';
import { ChatInterface } from '@/app/chat/page';
import { LoginPage } from '@/app/login/page';
import LandingPage from '@/app/marketing/page';
import { RegisterPage } from '@/app/register/page';

import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/themes/ThemeProvider.js';

import './App.css';

import { useAuth } from '@/contexts/auth-context';

function AppContent() {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadSavedTheme();
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    const handleHashLinks = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
          }
        }, 100);
      }
    };

    handleHashLinks();

    window.addEventListener('hashchange', handleHashLinks);

    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (target.tagName === 'A' && target.hash) {
        const href = target.getAttribute('href');
        if (href?.startsWith('#')) {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
              inline: 'nearest'
            });
            window.history.pushState(null, '', href);
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      window.removeEventListener('hashchange', handleHashLinks);
      document.removeEventListener('click', handleAnchorClick);
    };
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
    <>
      <ThemeProvider defaultTheme="light" storageKey="switch-ai-theme">
        <AuthProvider>
          <div className="h-full w-full font-mono smooth-scroll">
            <AppContent />
            <Toaster />
            <SonnerToaster />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
