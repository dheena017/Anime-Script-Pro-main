import React from 'react';

interface SettingsLayoutProps {
  header: React.ReactNode;
  toolbar: React.ReactNode;
  content: React.ReactNode;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({ header, toolbar, content }) => {
  return (
    <div className="max-w-[1000px] mx-auto space-y-2">
      {header}
      {toolbar}
      <div className="relative">
        <div className="absolute -left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden xl:block" />
        {content}
      </div>
    </div>
  );
};



