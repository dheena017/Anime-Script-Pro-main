import { motion } from 'motion/react';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Info,
  Trash2,
  MailOpen
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { createClient } from '../supabase/client';

export default function NotificationsPage() {
  const { notifications, refreshAppData } = useApp();
  const supabase = createClient();

  const markAsRead = async (id: string) => {
    await supabase.from('notifications').update({ read: true }).eq('id', id);
    refreshAppData();
  };

  const deleteNotification = async (id: string) => {
    await supabase.from('notifications').delete().eq('id', id);
    refreshAppData();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="min-h-screen pt-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight uppercase flex items-center gap-3">
            <Bell className="text-[#bd4a4a]" />
            BROADCAST HUB
          </h1>
          <p className="text-zinc-500 mt-1 uppercase text-[10px] tracking-widest leading-relaxed">STATUS REPORTS AND SYSTEM UPDATES FOR YOUR STUDIO ARCHITECT NODE.</p>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
              <Bell className="w-8 h-8 text-zinc-500" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2 uppercase tracking-tighter">ALL QUIET</h2>
            <p className="text-zinc-500 uppercase text-[10px] tracking-widest">NO NEW TRANSMISSIONS CURRENTLY ACTIVE ON THIS NODE.</p>
          </div>
        ) : (
          notifications.map((notif, index) => (
            <motion.div
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`group bg-zinc-900/40 border ${notif.read ? 'border-zinc-800/50' : 'border-[#bd4a4a]/30 bg-[#bd4a4a]/5'} rounded-2xl p-5 flex items-start gap-4 hover:border-zinc-700 transition-all`}
            >
              <div className={`mt-1 p-2 rounded-xl bg-zinc-800/50`}>
                {getIcon(notif.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`font-bold ${notif.read ? 'text-zinc-300' : 'text-white'}`}>{notif.title}</h3>
                  <span className="text-[10px] text-zinc-500 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2 leading-relaxed">{notif.message}</p>
                
                <div className="mt-4 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notif.read && (
                    <button 
                      onClick={() => markAsRead(notif.id)}
                      className="text-[10px] font-black uppercase tracking-widest text-[#bd4a4a] hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <MailOpen className="w-3 h-3" /> MARK READ
                    </button>
                  )}
                  <button 
                    onClick={() => deleteNotification(notif.id)}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Trash2 className="w-3 h-3" /> PURGE DATA
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
