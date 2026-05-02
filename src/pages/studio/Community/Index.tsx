// Community Index
import { CommunityLayout } from './CommunityLayout';
import { CommunityHeader } from './CommunityHeader';
import { CommunityToolbar } from './CommunityToolbar';
import { CommunityPanel } from './CommunityPanel';

export default function CommunityPage() {
  return (
    <CommunityLayout
      header={<CommunityHeader />}
      toolbar={<CommunityToolbar />}
      content={<CommunityPanel />}
    />
  );
}



