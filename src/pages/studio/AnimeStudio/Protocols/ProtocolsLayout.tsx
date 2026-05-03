import { Outlet, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProtocolsToolbar } from './components/ProtocolsToolbar';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Save, RefreshCw } from 'lucide-react';
import { useGenerator } from '@/hooks/useGenerator';
import { useAuth } from '@/hooks/useAuth';

export default function ProtocolsLayout() {
  const navigate = useNavigate();
  const { 
    isSaving, setIsSaving, showNotification, generatedScript,
    castProfiles, castData, generatedSeriesPlan, generatedMetadata
  } = useGenerator();
  const { user } = useAuth();

  const handleSave = async () => {
    if (!user?.id) {
      showNotification?.('Authentication Required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const { productionApi } = await import('@/services/api/production');
      await productionApi.updateContent(user.id, {
        cast_profiles: castProfiles,
        cast_data: castData,
        script_content: generatedScript,
        series_plan: generatedSeriesPlan,
        seo_metadata: generatedMetadata
      });
      showNotification('Protocols saved successfully!', 'success');
    } catch (e) {
      console.error("Manual sync failed:", e);
      showNotification('Failed to save protocols', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#050505]/40 backdrop-blur-md border border-white/5 rounded-2xl p-2 pr-4">
        <div className="flex items-center gap-2 px-4 border-r border-white/10 mr-2 py-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/anime/prompts')}
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-studio"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest leading-none">Nexus</span>
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Protocols</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <ProtocolsToolbar />
        </div>

        <div className="flex items-center gap-4 pl-4 border-l border-white/10 ml-2">
          {generatedScript && (
            <Button
              variant="outline"
              className="h-9 px-4 bg-studio/5 border-studio/20 text-studio hover:bg-studio/10 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all duration-500 group/save"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-2 group-hover/save:scale-110 transition-transform" />
              )}
              {isSaving ? "SYNCING..." : "SAVE"}
            </Button>
          )}

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/anime/screening')}
            className="h-8 w-8 rounded-lg text-zinc-500 hover:text-studio"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.div>
    </div>
  );
}




