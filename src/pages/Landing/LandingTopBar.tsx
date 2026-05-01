import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const LandingTopBar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full border-b border-white/5 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="text-lg font-black tracking-tighter uppercase text-white">AnimeScript <span className="text-studio">Pro</span></a>
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/pricing')} className="h-10 px-4 rounded-lg">Pricing</Button>
          <Button onClick={() => navigate('/login')} className="h-10 px-4 rounded-lg">Sign In</Button>
        </div>
      </div>
    </div>
  );
};

export default LandingTopBar;
