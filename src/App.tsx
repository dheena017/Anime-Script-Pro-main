import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { ErrorBoundary } from './lib/error-utils';
import { TooltipProvider } from './components/ui/tooltip';
import { GeneratorProvider } from './contexts/GeneratorContext';
import { AppProvider } from './context/AppContext';

// Core Pages (Lazy)

const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const LibraryPage = lazy(() => import('./pages/Library').then(m => ({ default: m.LibraryPage })));
const CommunityPage = lazy(() => import('./pages/Community').then(m => ({ default: m.CommunityPage })));
const DiscoverPage = lazy(() => import('./pages/DiscoverPage').then(m => ({ default: m.DiscoverPage })));
const SettingsPage = lazy(() => import('./pages/Settings').then(m => ({ default: m.SettingsPage })));
const TutorialsPage = lazy(() => import('./pages/Tutorials'));
const NotificationsPage = lazy(() => import('./pages/Notifications'));
const CreateProject = lazy(() => import('./pages/CreateProject'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const AuthPage = lazy(() => import('./pages/Auth'));
const PricingPage = lazy(() => import('./pages/Pricing'));
const HelpPage = lazy(() => import('./pages/Help'));
const DocumentationPage = lazy(() => import('./pages/Documentation'));
const SystemStatus = lazy(() => import('./pages/SystemStatus'));
const Changelog = lazy(() => import('./pages/Changelog'));
const FeedbackPage = lazy(() => import('./pages/Feedback'));


// Anime Studio Components (Lazy)
const AnimeLayout = lazy(() => import('./pages/studio/AnimeStudio/Layout'));
const AnimePortal = lazy(() => import('./pages/studio/AnimeStudio/Portal'));
const AnimeScript = lazy(() => import('./pages/studio/AnimeStudio/ScriptPage').then(m => ({ default: m.ScriptPage })));
const AnimeCast = lazy(() => import('./pages/studio/AnimeStudio/CastPage').then(m => ({ default: m.CastPage })));
const AnimeSeries = lazy(() => import('./pages/studio/AnimeStudio/SeriesPage').then(m => ({ default: m.SeriesPage })));
const AnimeStoryboard = lazy(() => import('./pages/studio/AnimeStudio/StoryboardPage').then(m => ({ default: m.StoryboardPage })));
const AnimeAssets = lazy(() => import('./pages/studio/AnimeStudio/AssetsPage').then(m => ({ default: m.AssetsPage })));
const AnimeScreening = lazy(() => import('./pages/studio/AnimeStudio/ScreeningRoom').then(m => ({ default: m.ScreeningRoom })));
const AnimeTemplate = lazy(() => import('./pages/studio/AnimeStudio/TemplatePage').then(m => ({ default: m.TemplatePage })));
const AnimeEngine = lazy(() => import('./pages/studio/AnimeStudio/EnginePage').then(m => ({ default: m.EnginePage })));


const AnimeWorld = lazy(() => import('./pages/studio/AnimeStudio/WorldPage').then(m => ({ default: m.WorldPage })));


const LoadingSpinner = () => (
  <div className="min-h-screen bg-[#050505] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-studio/30 border-t-studio rounded-full animate-spin" />
  </div>
);

import { AITelemetryOverlay } from './components/AITelemetryOverlay';

export default function App() {
  React.useEffect(() => {
    // Application initialized
  }, []);

  return (
    <ErrorBoundary>
      <AppProvider>
        <GeneratorProvider>
          <TooltipProvider>
            <Router>
              <Suspense fallback={<LoadingSpinner />}>
                <AITelemetryOverlay />
                <Routes>

                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/auth" element={<AuthPage />} />

                  <Route element={<Layout />}>
                    <Route path="/anime" element={<AnimeLayout />}>
                      <Route index element={<AnimePortal />} />

                      <Route path="script" element={<AnimeScript />} />
                      <Route path="cast" element={<AnimeCast />} />
                      <Route path="series" element={<AnimeSeries />} />
                      <Route path="storyboard" element={<AnimeStoryboard />} />
                      <Route path="seo" element={<AnimeAssets />} />
                      <Route path="prompts" element={<AnimeAssets />} />
                      <Route path="screening" element={<AnimeScreening />} />
                      <Route path="template" element={<AnimeTemplate />} />

                      <Route path="world" element={<AnimeWorld />} />
                      <Route path="engine" element={<AnimeEngine />} />
                    </Route>


                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/library" element={<LibraryPage />} />
                    <Route path="/discover" element={<DiscoverPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/tutorials" element={<TutorialsPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/help" element={<HelpPage />} />
                    <Route path="/documentation" element={<DocumentationPage />} />
                    <Route path="/status" element={<SystemStatus />} />
                    <Route path="/changelog" element={<Changelog />} />
                    <Route path="/feedback" element={<FeedbackPage />} />
                    <Route path="/create-project" element={<CreateProject />} />
                    <Route path="/projects/new" element={<CreateProject />} />
                  </Route>
                </Routes>
              </Suspense>
            </Router>
          </TooltipProvider>
        </GeneratorProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}
