import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ErrorBoundary } from '@/lib/error-utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { AppProvider } from '@/contexts/AppContext';
import { GeneratorProvider } from '@/contexts/GeneratorContext';
import { GeneratorProvider as ModularGeneratorProvider } from '@/contexts/generator';
import { LogProvider } from '@/contexts/LogContext';
import { StudioLoading } from '@/components/studio/StudioLoading';

const StudioLayout = lazy(() => import('@/layouts/StudioLayout').then(m => ({ default: m.StudioLayout })));
const AITelemetryOverlay = lazy(() => import('@/components/neural/AITelemetryOverlay').then(m => ({ default: m.AITelemetryOverlay })));
const ProtectedRoute = lazy(() => import('@/components/auth/ProtectedRoute').then(m => ({ default: m.ProtectedRoute })));
import { NavigationMonitor } from '@/components/studio/NavigationMonitor';

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
const SceneViewPage = lazy(() => import('./pages/studio/AnimeStudio/Storyboard/SceneViewPage').then(m => ({ default: m.SceneViewPage })));
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

// Episodes Sub-module
const EpisodesPage = lazy(() => import('./pages/studio/AnimeStudio/Series/Episodes/EpisodesPage'));
const EpisodeViewPage = lazy(() => import('./pages/studio/AnimeStudio/Series/Episodes/EpisodeViewPage'));
const EpisodeEditPage = lazy(() => import('./pages/studio/AnimeStudio/Series/Episodes/EpisodeEditPage'));

// Character Sub-module
const CharactersPage = lazy(() => import('./pages/studio/AnimeStudio/Cast/Characters/CharactersPage'));
const CharacterViewPage = lazy(() => import('./pages/studio/AnimeStudio/Cast/Characters/CharacterViewPage'));
const CharacterEditPage = lazy(() => import('./pages/studio/AnimeStudio/Cast/Characters/CharacterEditPage'));
const CharacterCreationPage = lazy(() => import('./pages/studio/AnimeStudio/Cast/CharacterCreationPage').then(m => ({ default: m.CharacterCreationPage })));
const DNAPage = lazy(() => import('./pages/studio/AnimeStudio/Cast/DNAPage').then(m => ({ default: m.DNAPage })));
const DynamicsPage = lazy(() => import('./pages/studio/AnimeStudio/Cast/DynamicsPage').then(m => ({ default: m.DynamicsPage })));

// Relationship Sub-module
const RelationshipsPage = lazy(() => import('./pages/studio/AnimeStudio/Cast/Relationships/RelationshipsPage'));
const AddRelationshipPage = lazy(() => import('./pages/studio/AnimeStudio/Cast/Relationships/AddRelationshipPage'));
const RelationshipViewPage = lazy(() => import('./pages/studio/AnimeStudio/Cast/Relationships/RelationshipViewPage'));
const RelationshipEditPage = lazy(() => import('./pages/studio/AnimeStudio/Cast/Relationships/RelationshipEditPage'));

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <TooltipProvider>
            <LogProvider>
              <GeneratorProvider>
                <ModularGeneratorProvider>
                  <Router>
                    <NavigationMonitor />
                    <Suspense fallback={<StudioLoading message="Initializing Neural Core" submessage="Syncing Universal Manifest..." />}>
                    <Routes>
                      <Route path="/" element={<LandingPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/terms" element={<TermsPage />} />

                      {/* Studio Routes */}
                      <Route element={
                        <ProtectedRoute>
                          <AITelemetryOverlay />
                          <StudioLayout />
                        </ProtectedRoute>
                      }>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/notifications" element={<NotificationsPage />} />
                        <Route path="/library" element={<LibraryModule />} />
                        <Route path="/discover" element={<DiscoverModule />} />
                        <Route path="/community" element={<CommunityModule />} />
                        <Route path="/tutorials" element={<AcademyModule />} />
                        <Route path="/settings" element={<SettingsModule />} />
                        <Route path="/status" element={<SystemModule />} />

                        {/* System Sub-routes */}
                        <Route path="/system/*" element={<SystemModule />} />
                      </Route>

                      {/* Specialized Studios */}
                      <Route path="/anime" element={<ProtectedRoute><AnimeLayout /></ProtectedRoute>}>
                        <Route index element={<AnimePortal />} />
                        
                        <Route path="world" element={<WorldLayout />}>
                           <Route index element={<AnimeWorld />} />
                        </Route>

                        <Route path="protocols" element={<ProtocolsLayout />}>
                           <Route path="architect" element={<ScriptArchitect />} />
                           <Route path="oracle" element={<LoreOracle />} />
                           <Route path="forge" element={<SoulForge />} />
                           <Route path="visual" element={<VisualSynthesizer />} />
                           <Route path="motion" element={<MotionChoreographer />} />
                           <Route path="showrunner" element={<Showrunner />} />
                           <Route path="seo" element={<SEOMaster />} />
                           <Route path="aide" element={<ProductionAide />} />
                        </Route>

                        <Route path="cast" element={<CastLayout />}>
                          <Route index element={<CharactersPage />} />
                          <Route path="registry" element={<CharactersPage />} />
                          <Route path="characters" element={<CharactersPage />} />
                          <Route path="characters/:id" element={<CharacterViewPage />} />
                          <Route path="characters/:id/edit" element={<CharacterEditPage />} />
                          <Route path="creation" element={<CharacterCreationPage />} />
                          <Route path="dna" element={<DNAPage />} />
                          <Route path="dynamics" element={<DynamicsPage />} />
                          <Route path="relationships" element={<RelationshipsPage />} />
                          <Route path="relationships/add" element={<AddRelationshipPage />} />
                          <Route path="relationships/:id" element={<RelationshipViewPage />} />
                          <Route path="relationships/:id/edit" element={<RelationshipEditPage />} />
                        </Route>

                        <Route path="series" element={<SeriesLayout />}>
                          <Route index element={<AnimeSeries />} />
                          <Route path="roadmap" element={<AnimeSeries />} />
                          <Route path="episodes" element={<EpisodesPage />} />
                          <Route path="episodes/:id" element={<EpisodeViewPage />} />
                          <Route path="episodes/:id/edit" element={<EpisodeEditPage />} />
                        </Route>

                        <Route path="script" element={<ScriptLayout />}>
                           <Route index element={<AnimeScript />} />
                        </Route>

                        <Route path="storyboard" element={<StoryboardLayout />}>
                          <Route index element={<AnimeStoryboard />} />
                          <Route path="scenes" element={<AnimeStoryboard />} />
                          <Route path="scenes/:id" element={<SceneViewPage />} />
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

                        <Route path="template" element={<AnimeTemplate />} />
                        
                        <Route path="engine" element={<EngineLayout />}>
                           <Route index element={<AnimeEngine />} />
                        </Route>
                      </Route>

                      <Route path="/manhwa" element={<ProtectedRoute><ManhwaLayout /></ProtectedRoute>} />
                      <Route path="/comic" element={<ProtectedRoute><ComicLayout /></ProtectedRoute>} />

                      {/* Legacy Redirects for Deep Links */}
                      <Route path="/system/health" element={<Navigate to="/status" replace />} />
                      <Route path="/system/logs" element={<Navigate to="/system/changelog" replace />} />
                      <Route path="/changelog" element={<Navigate to="/system/changelog" replace />} />
                      <Route path="/feedback" element={<Navigate to="/system/feedback" replace />} />
                      <Route path="/projects/new" element={<CreateProject />} />
                      <Route path="/api-reference" element={<ApiReferencePage />} />
                      <Route path="/lore-database" element={<LoreDatabasePage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                    </Routes>
                  </Suspense>
                </Router>
                </ModularGeneratorProvider>
              </GeneratorProvider>
            </LogProvider>
          </TooltipProvider>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

