import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Outlet } from 'react-router-dom';
import { StudioSideBar } from '@/components/studio/layout/StudioSideBar';
import { StudioTopBar } from '@/components/studio/layout/StudioTopBar';
import { StudioFooter } from '@/components/studio/layout/StudioFooter';
import { NeuralConsole } from '@/components/studio/NeuralConsole';
import { NeuralErrorSentinel } from '@/components/studio/NeuralErrorSentinel';
import { NeuralPulseLayer } from '@/components/neural/NeuralPulseLayer';
import { StudioLoading } from '@/components/studio/StudioLoading';
import { DeferredRender } from '@/components/studio/DeferredRender';

export const StudioLayout: React.FC = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = React.useState(true);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const backdropTextureStyle = {
    backgroundImage:
      'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08) 0, transparent 1px), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.05) 0, transparent 1px), radial-gradient(circle at 40% 70%, rgba(255,255,255,0.06) 0, transparent 1px), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.04) 0, transparent 1px)',
    backgroundSize: '24px 24px',
  };

  return (
    <div className="flex h-screen bg-[#050505] text-white font-sans overflow-hidden">
      <NeuralPulseLayer />
      <StudioSideBar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Content Backdrop / Blur when Sidebar is open */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={() => setCollapsed(true)}
            className="fixed inset-0 bg-black/60 z-[450] cursor-pointer"
          />
        )}
      </AnimatePresence>

      <main 
        className="flex-1 flex flex-col relative overflow-hidden pt-[60px] transition-all duration-300 pl-4"
      >
        <StudioTopBar 
          showNotifications={showNotifications} 
          setShowNotifications={setShowNotifications} 
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
        />

        <div className="flex-1 overflow-y-auto relative flex flex-col">
          <div className="p-6 lg:p-10 flex-1 relative pb-32">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" style={backdropTextureStyle} />
            <AnimatePresence>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "linear" }}
                className="relative z-10 h-full"
                style={{ willChange: 'opacity' }}
              >
                <DeferredRender delay={32} fallback={<StudioLoading fullPage={false} message="Rendering Module" submessage="Optimizing Visual Buffers..." />}>
                  <Outlet />
                </DeferredRender>
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="mt-40 mb-10 px-6 lg:px-10">
            <StudioFooter />
          </div>
        </div>
      </main>
      <NeuralConsole />
      <NeuralErrorSentinel />
    </div>
  );
};



