import { useState, type ChangeEvent } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { downloadJson, readJsonFile } from '@/lib/download';
import { validateTemplate } from '@/domain/schema';
import type { StudyTemplate } from '@/domain/model';
import { ConfigPanel } from '@/components/studio/ConfigPanel';
import { SortBoard } from '@/components/studio/SortBoard';
import { useToast } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
import { LanguageSwitcher, LanguageSwitcherCompact } from '@/components/ui/language-switcher';
import { useI18n } from '@/contexts/i18n-context';
import { 
  Upload, 
  Download, 
  Play,
  Settings2,
  PanelLeftClose,
  PanelLeft,
  Layers,
  LayoutGrid
} from 'lucide-react';

type Mode = 'edit' | 'preview';

export default function StudioPage() {
  const [mode, setMode] = useState<Mode>('edit');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [participantName, setParticipantName] = useState('');
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  
  const { addToast } = useToast();
  const { t } = useI18n();
  
  const { 
    study, 
    categories, 
    cards, 
    exportTemplate,
    setStudy,
    reset 
  } = useBuilderStore();

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJsonFile<StudyTemplate>(file);
      const validation = validateTemplate(data);
      
      if (!validation.success) {
        addToast({
          type: 'error',
          title: t('studioPage.messages.invalidTemplate'),
          description: validation.error.issues.map((i) => i.message).join(', '),
        });
        return;
      }
      
      // Load template into builder store
      reset();
      setStudy(data.study);
      data.categories.forEach(cat => {
        useBuilderStore.getState().addCategory(cat.label, cat.description, cat.image);
      });
      data.cards.forEach(card => {
        useBuilderStore.getState().addCard(card.label, card.description, card.image);
      });
      
      addToast({
        type: 'success',
        title: t('studioPage.messages.templateImported'),
        description: t('studioPage.messages.loadedCardsAndCategories', { 
          cards: data.cards.length, 
          categories: data.categories.length 
        }),
      });
    } catch {
      addToast({ type: 'error', title: t('studioPage.messages.failedToReadTemplate') });
    }
    e.target.value = '';
  };

  const handleExport = () => {
    if (!study.title.trim()) {
      addToast({ type: 'warning', title: t('studioPage.messages.enterTitleBeforeExport') });
      return;
    }
    if (cards.length === 0) {
      addToast({ type: 'warning', title: t('studioPage.messages.addCardBeforeExport') });
      return;
    }
    
    const template = exportTemplate();
    const filename = `template_${study.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}.json`;
    downloadJson(template, filename);
    addToast({
      type: 'success',
      title: t('studioPage.messages.templateExported'),
      description: filename,
    });
  };

  const handleStartPreview = () => {
    if (cards.length === 0) {
      addToast({ type: 'warning', title: t('studioPage.messages.addCardsBeforeStart') });
      return;
    }
    if (study.sortType !== 'open' && categories.length === 0) {
      addToast({ type: 'warning', title: t('studioPage.messages.addCategoriesForClosed') });
      return;
    }
    // Set default datetime if name is empty
    if (!participantName.trim()) {
      const now = new Date();
      const defaultName = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
      setParticipantName(defaultName);
    }
    setShowParticipantModal(true);
  };

  const handleConfirmStart = () => {
    setShowParticipantModal(false);
    setMode('preview');
  };

  const handleExitPreview = () => {
    setMode('edit');
    setParticipantName('');
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <header className="h-16 border-b border-border flex items-center justify-between px-4 bg-card shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            title={sidebarOpen ? t('studioPage.hideSidebar') : t('studioPage.showSidebar')}
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">
                {study.title || t('studioPage.untitledStudy')}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {study.sortType}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {categories.length} {t('studioPage.categories')} · {cards.length} {t('studioPage.cards')}
                </span>
              </div>
            </div>
          </div>
          
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <div className="sm:hidden">
            <LanguageSwitcherCompact />
          </div>
          {mode === 'edit' ? (
            <>
              <label className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-all cursor-pointer flex items-center gap-2 hover:shadow-sm">
                <Upload className="w-3.5 h-3.5" />
                {t('common.import')}
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExport}
                className="px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-all flex items-center gap-2 hover:shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                {t('common.export')}
              </button>
              <div className="h-6 w-px bg-border mx-1" />
              <button
                onClick={handleStartPreview}
                className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary to-primary/70 text-primary-foreground rounded-md hover:opacity-95 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 ring-1 ring-primary/30 hover:ring-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <Play className="w-3.5 h-3.5" />
                {t('builderPage.actions.runStudy')}
              </button>
              <span className="text-xs text-muted-foreground hidden sm:block">
                {t('studioPage.preview.toTestHint')}
              </span>
            </>
          ) : (
            <>
              <Badge variant="warning" className="text-[10px] px-2 py-0.5">
                {t('studioPage.preview.label')}
              </Badge>
              <button
                onClick={handleExitPreview}
                className="px-4 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-muted transition-all flex items-center gap-2"
              >
                <Settings2 className="w-3.5 h-3.5" />
                {t('studioPage.backToEdit')}
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && mode === 'edit' && (
          <aside className="w-80 border-r border-border bg-card overflow-y-auto shrink-0 flex flex-col">
            <ConfigPanel />
          </aside>
        )}

        {/* Sort Board / Main Area */}
        <main className="flex-1 overflow-hidden bg-muted/30 relative flex flex-col">
          {mode === 'edit' && (
            <div className="px-4 pt-3">
              <div className="rounded-lg border border-amber-200/60 bg-amber-50/50 backdrop-blur-sm px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <Badge variant="warning" className="text-[11px] px-2.5 py-0.5 font-semibold tracking-wide">
                    {t('studioPage.preview.label')}
                  </Badge>
                  <p className="text-sm text-amber-800/80 font-medium">
                    {t('studioPage.preview.description')}
                  </p>
                </div>
              </div>
            </div>
          )}
          <SortBoard 
            mode={mode} 
            participantName={mode === 'edit' ? t('studioPage.previewUser') : participantName}
          />
        </main>
      </div>

      {/* SEO-optimized Watermark Footer - Only in Edit Mode */}
      {mode === 'edit' && (
        <footer 
          className="fixed bottom-3 right-3 px-3 py-2 bg-background/60 backdrop-blur-sm border border-border/30 rounded-lg text-[10px] text-muted-foreground/70 opacity-80 hover:opacity-100 transition-opacity select-none z-40"
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
      )}

      {/* Participant Modal */}
      {showParticipantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">{t('studioPage.startCardSorting')}</h2>
            
            <div className="mb-4 p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">{study.instructionsMarkdown}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                {t('runPage.participantInfo.nameLabel')}
              </label>
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder={t('runPage.participantInfo.namePlaceholder')}
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t('runPage.nameAliasHint')}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowParticipantModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={handleConfirmStart}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90"
              >
                {t('runPage.participantInfo.startSession')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
