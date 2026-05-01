import React from 'react';

interface CommunityLayoutProps {
  header: React.ReactNode;
  toolbar: React.ReactNode;
  content: React.ReactNode;
}

export const CommunityLayout: React.FC<CommunityLayoutProps> = ({ header, toolbar, content }) => {
  return (
    <div className="max-w-[1200px] mx-auto space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {header}
      {toolbar}
      <div className="relative">
        <div className="absolute -left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-purple-500/20 to-transparent hidden xl:block" />
        {content}
      </div>
    </div>
  );
};


