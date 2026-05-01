import { LibraryLayout } from './LibraryLayout';
import { LibraryHeader } from './LibraryHeader';
import { LibraryToolbar } from './LibraryToolbar';
import { LibraryPanel } from './LibraryPanel';

export default function LibraryPage() {
  return (
    <LibraryLayout
      header={<LibraryHeader />}
      toolbar={<LibraryToolbar />}
      content={<LibraryPanel />}
    />
  );
}


