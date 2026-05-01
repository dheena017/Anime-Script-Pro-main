import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
const Layout = lazy(() => import('@/layouts/Layout').then(m => ({ default: m.Layout })));
import { ErrorBoundary } from '@/lib/error-utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
const StudioLayout = lazy(() => import('@/layouts/StudioLayout').then(m => ({ default: m.StudioLayout })));
const GeneratorProvider = lazy(() => import('@/contexts/GeneratorContext').then(m => ({ default: m.GeneratorProvider })));
const AITelemetryOverlay = lazy(() => import('@/components/neural/AITelemetryOverlay').then(m => ({ default: m.AITelemetryOverlay })));
const ProtectedRoute = lazy(() => import('@/components/auth/ProtectedRoute').then(m => ({ default: m.ProtectedRoute })));

// Core Pages (Lazy)
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const NotificationsPage = lazy(() => import('./pages/dashboard/Notifications'));
const CreateProject = lazy(() => import('./pages/projects/CreateProject'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage').then(m => ({ default: m.ProfilePage })));
const LandingPage = lazy(() => import('./pages/Landing/LandingPage'));
const AuthPage = lazy(() => import('./pages/auth/Auth'));
const PricingPage = lazy(() => import('./pages/marketing/Pricing'));
const HelpPage = lazy(() => import('./pages/marketing/Help'));
const ApiReferencePage = lazy(() => import('./pages/projects/ApiReference'));
const LoreDatabasePage = lazy(() => import('./pages/projects/LoreDatabase'));
const ContactPage = lazy(() => import('./pages/marketing/Contact'));
const TermsPage = lazy(() => import('./pages/marketing/Terms'));

// New Modular Pages
const SystemModule = lazy(() => import('./pages/studio/system/Index'));
const DiscoverModule = lazy(() => import('./pages/studio/Discover/Index'));
const CommunityModule = lazy(() => import('./pages/studio/Community/Index'));
const AcademyModule = lazy(() => import('./pages/studio/Tutorials/Index'));
const SettingsModule = lazy(() => import('./pages/studio/Settings/Index'));
const LibraryModule = lazy(() => import('./pages/studio/Library/Index'));

// Anime Studio Components (Lazy)
const AnimeLayout = lazy(() => import('./pages/studio/AnimeStudio/Layout'));
const ManhwaLayout = lazy(() => import('./pages/studio/ManhwaStudio/Layout'));
const ComicLayout = lazy(() => import('./pages/studio/ComicStudio/Layout'));
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

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
              <Router>
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>

                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/auth" element={<AuthPage />} />

                    {/* STUDIO ARCHITECT INFRASTRUCTURE */}
                    <Route element={
                      <ProtectedRoute>
                        <GeneratorProvider>
                          <AITelemetryOverlay />
                          <StudioLayout />
                        </GeneratorProvider>
                      </ProtectedRoute>
                    }>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/profile" element={<ProfilePage />} />
                    
                    {/* Modular Sections */}
                      <Route path="/library" element={<LibraryModule />} />
                      <Route path="/discover" element={<DiscoverModule />} />
                      <Route path="/community" element={<CommunityModule />} />
                      <Route path="/tutorials" element={<AcademyModule />} />
                      <Route path="/system/*" element={<SystemModule />} />
                      <Route path="/settings" element={<SettingsModule />} />
                      <Route path="/notifications" element={<NotificationsPage />} />
                      <Route path="/create-project" element={<CreateProject />} />
                    </Route>

                    {/* LEGACY ANIME STUDIO (TO BE REFACTORED) */}
                    <Route element={
                      <ProtectedRoute>
                        <GeneratorProvider>
                          <Layout />
                        </GeneratorProvider>
                      </ProtectedRoute>
                    }>
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

                      {/* 2. MANHWA STUDIO (SCAFFOLD) */}
                      <Route path="/manhwa" element={<ManhwaLayout />}>
                        <Route index element={<div className="p-20 text-center"><h1 className="text-4xl font-black text-white uppercase">Manhwa Portal</h1></div>} />
                      </Route>

                      {/* 3. COMIC STUDIO (SCAFFOLD) */}
                      <Route path="/comic" element={<ComicLayout />}>
                        <Route index element={<div className="p-20 text-center"><h1 className="text-4xl font-black text-white uppercase">Comic Portal</h1></div>} />
                      </Route>

                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/documentation" element={<Navigate to="/system/docs" replace />} />
                      <Route path="/status" element={<Navigate to="/system/health" replace />} />
                      <Route path="/changelog" element={<Navigate to="/system/changelog" replace />} />
                      <Route path="/feedback" element={<Navigate to="/system/feedback" replace />} />
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
          </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

