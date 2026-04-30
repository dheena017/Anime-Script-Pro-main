import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './layouts/Layout';
import { ErrorBoundary } from './lib/error-utils';
import { TooltipProvider } from './components/ui/tooltip';
import { GeneratorProvider } from './contexts/GeneratorContext';
import { AppProvider } from './context/AppContext';

// Core Pages (Lazy)

const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
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
const ApiReferencePage = lazy(() => import('./pages/ApiReference'));
const LoreDatabasePage = lazy(() => import('./pages/LoreDatabase'));
const ContactPage = lazy(() => import('./pages/Contact'));
const TermsPage = lazy(() => import('./pages/Terms'));


// Anime Studio Components (Lazy)
const AnimeLayout = lazy(() => import('./pages/studio/AnimeStudio/Layout'));
const AnimePortal = lazy(() => import('./pages/studio/AnimeStudio/Portal'));
const AnimeScript = lazy(() => import('./pages/studio/AnimeStudio/ScriptPage').then(m => ({ default: m.ScriptPage })));
const AnimeCast = lazy(() => import('./pages/studio/AnimeStudio/CastPage').then(m => ({ default: m.CastPage })));
const AnimeSeries = lazy(() => import('./pages/studio/AnimeStudio/SeriesPage').then(m => ({ default: m.SeriesPage })));
const AnimeStoryboard = lazy(() => import('./pages/studio/AnimeStudio/StoryboardPage').then(m => ({ default: m.StoryboardPage })));
const SEOPage = lazy(() => import('./pages/studio/AnimeStudio/SEOPage').then(m => ({ default: m.SEOPage })));
const PromptsPage = lazy(() => import('./pages/studio/AnimeStudio/PromptsPage').then(m => ({ default: m.PromptsPage })));
const AnimeScreening = lazy(() => import('./pages/studio/AnimeStudio/ScreeningRoom').then(m => ({ default: m.ScreeningRoom })));
const AnimeTemplate = lazy(() => import('./pages/studio/AnimeStudio/TemplatePage').then(m => ({ default: m.TemplatePage })));
const AnimeEngine = lazy(() => import('./pages/studio/AnimeStudio/EnginePage').then(m => ({ default: m.EnginePage })));
const AnimeWorld = lazy(() => import('./pages/studio/AnimeStudio/WorldPage').then(m => ({ default: m.WorldPage })));

// Production System Layouts
const WorldLayout = lazy(() => import('./pages/studio/AnimeStudio/World/WorldLayout'));
const CastLayout = lazy(() => import('./pages/studio/AnimeStudio/Cast/CastLayout'));
const SeriesLayout = lazy(() => import('./pages/studio/AnimeStudio/Series/SeriesLayout'));
const ScriptLayout = lazy(() => import('./pages/studio/AnimeStudio/Script/ScriptLayout'));
const StoryboardLayout = lazy(() => import('./pages/studio/AnimeStudio/Storyboard/StoryboardLayout'));
const SEOLayout = lazy(() => import('./pages/studio/AnimeStudio/SEO/SEOLayout'));
const PromptsLayout = lazy(() => import('./pages/studio/AnimeStudio/Prompts/PromptsLayout'));
const ScreeningLayout = lazy(() => import('./pages/studio/AnimeStudio/Screening/ScreeningLayout'));
const EngineLayout = lazy(() => import('./pages/studio/AnimeStudio/Engine/EngineLayout'));
const ProtocolsLayout = lazy(() => import('./pages/studio/AnimeStudio/Protocols/ProtocolsLayout'));

const ScriptArchitect = lazy(() => import('./pages/studio/AnimeStudio/Protocols/pages/ScriptArchitect'));
const LoreOracle = lazy(() => import('./pages/studio/AnimeStudio/Protocols/pages/LoreOracle'));
const SoulForge = lazy(() => import('./pages/studio/AnimeStudio/Protocols/pages/SoulForge'));
const VisualSynthesizer = lazy(() => import('./pages/studio/AnimeStudio/Protocols/pages/VisualSynthesizer'));
const MotionChoreographer = lazy(() => import('./pages/studio/AnimeStudio/Protocols/pages/MotionChoreographer'));
const Showrunner = lazy(() => import('./pages/studio/AnimeStudio/Protocols/pages/Showrunner'));
const SEOMaster = lazy(() => import('./pages/studio/AnimeStudio/Protocols/pages/SEOMaster'));
const ProductionAide = lazy(() => import('./pages/studio/AnimeStudio/Protocols/pages/ProductionAide'));



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
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/auth" element={<AuthPage />} />

                  <Route element={<Layout />}>
                    <Route path="/anime" element={<AnimeLayout />}>
                      <Route index element={<AnimePortal />} />

                      <Route path="world" element={<WorldLayout />}>
                        <Route index element={<AnimeWorld />} />
                      </Route>

                      <Route path="cast" element={<CastLayout />}>
                        <Route index element={<AnimeCast />} />
                      </Route>

                      <Route path="series" element={<SeriesLayout />}>
                        <Route index element={<AnimeSeries />} />
                      </Route>

                      <Route path="script" element={<ScriptLayout />}>
                        <Route index element={<AnimeScript />} />
                      </Route>

                      <Route path="storyboard" element={<StoryboardLayout />}>
                        <Route index element={<AnimeStoryboard />} />
                      </Route>

                      <Route path="seo" element={<SEOLayout />}>
                        <Route index element={<SEOPage />} />
                      </Route>

                      <Route path="prompts" element={<PromptsLayout />}>
                        <Route index element={<PromptsPage />} />
                      </Route>

                      <Route path="screening" element={<ScreeningLayout />}>
                        <Route index element={<AnimeScreening />} />
                      </Route>

                      <Route path="engine" element={<EngineLayout />}>
                        <Route index element={<AnimeEngine />} />
                      </Route>

                      <Route path="protocols" element={<ProtocolsLayout />}>
                        <Route index element={<Navigate to="script" replace />} />
                        <Route path="script" element={<ScriptArchitect />} />
                        <Route path="world" element={<LoreOracle />} />
                        <Route path="cast" element={<SoulForge />} />
                        <Route path="visual" element={<VisualSynthesizer />} />
                        <Route path="motion" element={<MotionChoreographer />} />
                        <Route path="series" element={<Showrunner />} />
                        <Route path="seo" element={<SEOMaster />} />
                        <Route path="utils" element={<ProductionAide />} />
                      </Route>

                      <Route path="template" element={<AnimeTemplate />} />
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
                    <Route path="/api-reference" element={<ApiReferencePage />} />
                    <Route path="/lore-database" element={<LoreDatabasePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/terms" element={<TermsPage />} />
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
