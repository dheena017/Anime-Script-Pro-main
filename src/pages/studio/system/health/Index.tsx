import { SystemLayout } from '../SystemLayout';
import { HealthHeader } from './HealthHeader';
import { HealthPanel } from './HealthPanel';

export default function HealthPage() {
  return (
    <SystemLayout
      header={<HealthHeader />}
      content={<HealthPanel />}
    />
  );
}


