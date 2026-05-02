import React from 'react';

interface TutorialsLayoutProps {
  header: React.ReactNode;
  toolbar: React.ReactNode;
  content: React.ReactNode;
}

export const TutorialsLayout: React.FC<TutorialsLayoutProps> = ({ header, toolbar, content }) => {
  return (
    <div className="max-w-[1400px] mx-auto space-y-2">
      {header}
      {toolbar}
      <div className="relative">
        <div className="absolute -left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/20 to-transparent hidden xl:block" />
        {content}
      </div>
    </div>
  );
};



