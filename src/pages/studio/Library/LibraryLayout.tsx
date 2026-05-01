import React from 'react';

interface LibraryLayoutProps {
  header: React.ReactNode;
  toolbar: React.ReactNode;
  content: React.ReactNode;
}

export const LibraryLayout: React.FC<LibraryLayoutProps> = ({ header, toolbar, content }) => {
  return (
    <div className="max-w-[1600px] mx-auto space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {header}
      {toolbar}
      <div className="relative">
        <div className="absolute -left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#bd4a4a]/20 to-transparent hidden xl:block" />
        {content}
      </div>
    </div>
  );
};


