// Discover Index
import { DiscoverLayout } from './DiscoverLayout';
import { DiscoverHeader } from './DiscoverHeader';
import { DiscoverToolbar } from './DiscoverToolbar';
import { DiscoverPanel } from './DiscoverPanel';

export default function DiscoverPage() {
  return (
    <DiscoverLayout
      header={<DiscoverHeader />}
      toolbar={<DiscoverToolbar />}
      content={<DiscoverPanel />}
    />
  );
}



