import { useBuilderStore } from '@/store/builderStore';
import {
  StudyMetaForm,
  SettingsForm,
  CategoryEditor,
  CardEditor,
  ExportTemplateButton,
} from '@/components/builder';
import { RotateCcw } from 'lucide-react';
import { useI18n } from '@/contexts/i18n-context';

export default function BuilderPage() {
  const { reset, study, categories, cards } = useBuilderStore();
  const { t } = useI18n();

  const handleReset = () => {
    if (window.confirm(t('builderPage.actions.confirmReset'))) {
      reset();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t('builderPage.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('builderPage.subtitle')}
          </p>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm border border-border rounded-md hover:bg-muted transition-colors flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {t('common.reset')}
        </button>
      </div>

      {/* Progress Summary */}
      <div className="p-4 bg-muted/50 rounded-lg flex items-center justify-between text-sm">
        <div className="flex gap-6">
          <span>
            <strong>{t('builderPage.progress.title')}:</strong> {study.title || t('builderPage.progress.notSet')}
          </span>
          <span>
            <strong>{t('builderPage.progress.type')}:</strong> {study.sortType}
          </span>
          <span>
            <strong>{t('builderPage.progress.categories')}:</strong> {categories.length}
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
