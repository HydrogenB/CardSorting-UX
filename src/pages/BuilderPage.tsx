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

      {/* SEO-optimized Watermark Footer */}
      <footer 
        className="fixed bottom-3 right-3 px-3 py-2 bg-background/60 backdrop-blur-sm border border-border/30 rounded-lg text-[10px] text-muted-foreground/70 opacity-80 hover:opacity-100 transition-opacity select-none"
        itemScope 
        itemType="https://schema.org/Person"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <span>by</span>
          <a 
            href="https://th.linkedin.com/in/jirads"
            target="_blank"
            rel="noopener noreferrer author"
            className="font-medium hover:text-foreground transition-colors underline-offset-2 hover:underline"
            itemProp="url"
            title="Jirad Srirattana-arporn - Product Owner"
          >
            <span itemProp="name">Jirad Srirattana-arporn</span>
          </a>
          <meta itemProp="jobTitle" content="Product Owner" />
        </div>
        <div className="flex items-center gap-2">
          <a 
            href="https://github.com/HydrogenB/CardSorting-UX"
            target="_blank"
            rel="noopener noreferrer"
            title="Star CardSorting-UX on GitHub"
          >
            <img 
              src="https://img.shields.io/github/stars/HydrogenB/CardSorting-UX?style=social" 
              alt="GitHub stars"
              className="h-4"
              loading="lazy"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}
