import { Loader2 } from 'lucide-react';

interface StudioLoadingProps {
  message?: string;
  submessage?: string;
  fullPage?: boolean;
  progress?: number;
}

export function StudioLoading({ 
  message = "Loading Studio", 
  submessage,
  fullPage = true,
  progress
}: StudioLoadingProps) {
  const containerClasses = fullPage 
    ? 'fixed inset-0 z-[999] bg-[#020205] flex flex-col items-center justify-center'
    : 'w-full py-20 flex flex-col items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-8">
        {/* Simple Professional Spinner */}
        <div className="relative">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        </div>

        {/* Clean Typography */}
        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold tracking-[0.3em] text-white uppercase">
            {message}
          </h3>
          {submessage && (
            <p className="text-[10px] font-medium tracking-[0.2em] text-zinc-500 uppercase">
              {submessage}
            </p>
          )}
        </div>

        {/* Minimal Progress Bar */}
        {typeof progress === 'number' && (
          <div className="w-48 h-0.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              style={{ width: `${progress}%` }}
              className="h-full bg-cyan-500 transition-all duration-300"
            />
          </div>
        )}
      </div>
    </div>
  );
}
