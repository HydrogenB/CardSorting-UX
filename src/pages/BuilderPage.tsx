import { useBuilderStore } from '@/store/builderStore';
import {
  StudyMetaForm,
  SettingsForm,
  CategoryEditor,
  CardEditor,
  ExportTemplateButton,
} from '@/components/builder';
import { RotateCcw, Github, Linkedin, User } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
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

      {/* Watermark */}
      <div className="fixed bottom-4 right-4 p-3 bg-background/80 backdrop-blur-sm border border-border/50 rounded-lg shadow-sm text-xs text-muted-foreground">
        <div className="flex items-center gap-2 mb-1">
          <User className="w-3 h-3" />
          <span className="font-medium">Jirad Srirattana-arporn</span>
        </div>
        <div className="flex items-center gap-3">
          <a 
            href="https://github.com/HydrogenB/CardSorting-UX" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Github className="w-3 h-3" />
            <span>GitHub</span>
          </a>
          <a 
            href="https://th.linkedin.com/in/jirads" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <Linkedin className="w-3 h-3" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}
