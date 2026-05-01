
import { DocsLayout } from './DocsLayout';
import { DocsHeader } from './DocsHeader';
import { DocsToolbar } from './DocsToolbar';
import { DocsPanel } from './DocsPanel';

export default function DocsPage() {
  return (
    <DocsLayout
      header={<DocsHeader />}
      toolbar={<DocsToolbar />}
      content={<DocsPanel />}
    />
  );
}

