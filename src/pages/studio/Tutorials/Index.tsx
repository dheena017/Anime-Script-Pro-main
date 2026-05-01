import { TutorialsLayout } from './TutorialsLayout';
import { TutorialsHeader } from './TutorialsHeader';
import { TutorialsToolbar } from './TutorialsToolbar';
import { TutorialsPanel } from './TutorialsPanel';

export default function AcademyPage() {
  return (
    <TutorialsLayout
      header={<TutorialsHeader />}
      toolbar={<TutorialsToolbar />}
      content={<TutorialsPanel />}
    />
  );
}


