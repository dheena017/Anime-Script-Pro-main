import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const Docs = lazy(() => import('./docs/Index'));
const Health = lazy(() => import('./health/Index'));
const SystemAudit = lazy(() => import('./system/Index').then(m => ({ default: m.SystemStatus })));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-96">
    <div className="w-8 h-8 border-2 border-zinc-500/30 border-t-zinc-500 rounded-full animate-spin" />
  </div>
);

export default function SystemControl() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="docs" element={<Docs />} />
        <Route path="health" element={<Health />} />
        <Route path="status" element={<SystemAudit />} />
        <Route path="*" element={<Navigate to="docs" replace />} />
      </Routes>
    </Suspense>
  );
}



