'use client';

import { lazy, Suspense, useEffect } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { AuthProvider } from '@/contexts/AuthContext';
import { availableAppThemes, loadSavedTheme } from '@/lib/ThemeService';

import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/themes/ThemeProvider.js';

import './App.css';

import { useAuth } from '@/contexts/auth-context';

const AboutPage = lazy(() => import('@/app/about/page'));
const ChatInterface = lazy(() => import('@/app/chat/page'));
const LoginPage = lazy(() =>
  import('@/app/login/page').then((module) => ({ default: module.LoginPage }))
);
const LandingPage = lazy(() => import('@/app/marketing/page'));
const RegisterPage = lazy(() =>
  import('@/app/register/page').then((module) => ({ default: module.RegisterPage }))
);

function AppContent() {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    loadSavedTheme();

    availableAppThemes.forEach((theme) => {
      if (theme.path) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = theme.path;
        link.as = 'style';
        document.head.appendChild(link);
      }
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">loading...</p>
          </div>
        </div>
      }
    >
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
    </Suspense>
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
