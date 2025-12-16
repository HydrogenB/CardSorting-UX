import { useBuilderStore } from '@/store/builderStore';
import {
  StudyMetaForm,
  SettingsForm,
  CategoryEditor,
  CardEditor,
  ExportTemplateButton,
} from '@/components/builder';
import { RotateCcw } from 'lucide-react';

export default function BuilderPage() {
  const { reset, study, categories, cards } = useBuilderStore();

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset? All unsaved changes will be lost.')) {
      reset();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Template Builder</h1>
          <p className="text-sm text-muted-foreground">
            Create a card sorting study template
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Progress Summary */}
      <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between text-sm">
        <div className="flex gap-6">
          <span>
            <strong>Title:</strong> {study.title || '(not set)'}
          </span>
          <span>
            <strong>Type:</strong> {study.sortType}
          </span>
          <span>
            <strong>Categories:</strong> {categories.length}
          </span>
          <span>
            <strong>Cards:</strong> {cards.length}
          </span>
        </div>
      </div>

      <StudyMetaForm />
      <SettingsForm />
      <CategoryEditor />
      <CardEditor />

      {/* Export Section */}
      <div className="sticky bottom-4 p-4 bg-card border border-border rounded-lg shadow-lg">
        <ExportTemplateButton />
      </div>
    </div>
  );
}
