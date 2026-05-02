import React from 'react';
import { SettingsLayout } from './SettingsLayout';
import { SettingsHeader } from './SettingsHeader';
import { SettingsToolbar } from './SettingsToolbar';
import { SettingsPanel } from './SettingsPanel';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState('general');

  return (
    <SettingsLayout
      header={<SettingsHeader />}
      toolbar={<SettingsToolbar activeTab={activeTab} onTabChange={setActiveTab} />}
      content={<SettingsPanel activeTab={activeTab} />}
    />
  );
}



