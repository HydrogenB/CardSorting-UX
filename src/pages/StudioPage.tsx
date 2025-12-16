import { useState } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { downloadJson, readJsonFile } from '@/lib/download';
import { validateTemplate } from '@/domain/schema';
import type { StudyTemplate } from '@/domain/model';
import { ConfigPanel } from '@/components/studio/ConfigPanel';
import { SortBoard } from '@/components/studio/SortBoard';
import { useToast } from '@/components/ui/toast';
import { Badge } from '@/components/ui/badge';
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
  
  const { 
    study, 
    categories, 
    cards, 
    exportTemplate,
    setStudy,
    reset 
  } = useBuilderStore();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJsonFile<StudyTemplate>(file);
      const validation = validateTemplate(data);
      
      if (!validation.success) {
        addToast({
          type: 'error',
          title: 'Invalid template',
          description: validation.error.issues.map((i) => i.message).join(', '),
        });
        return;
      }
      
      // Load template into builder store
      reset();
      setStudy(data.study);
      data.categories.forEach(cat => {
        useBuilderStore.getState().addCategory(cat.label, cat.description);
        const cats = useBuilderStore.getState().categories;
        const lastCat = cats[cats.length - 1];
        useBuilderStore.getState().updateCategory(lastCat.id, { label: cat.label, description: cat.description });
      });
      data.cards.forEach(card => {
        useBuilderStore.getState().addCard(card.label, card.description);
      });
      
      addToast({
        type: 'success',
        title: 'Template imported',
        description: `Loaded ${data.cards.length} cards and ${data.categories.length} categories`,
      });
    } catch {
      addToast({ type: 'error', title: 'Failed to read template file' });
    }
    e.target.value = '';
  };

  const handleExport = () => {
    if (!study.title.trim()) {
      addToast({ type: 'warning', title: 'Please enter a study title before exporting' });
      return;
    }
    if (cards.length === 0) {
      addToast({ type: 'warning', title: 'Please add at least one card before exporting' });
      return;
    }
    
    const template = exportTemplate();
    const filename = `template_${study.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')}.json`;
    downloadJson(template, filename);
    addToast({
      type: 'success',
      title: 'Template exported',
      description: filename,
    });
  };

  const handleStartPreview = () => {
    if (cards.length === 0) {
      addToast({ type: 'warning', title: 'Please add cards before starting' });
      return;
    }
    if (study.sortType !== 'open' && categories.length === 0) {
      addToast({ type: 'warning', title: 'Please add categories for closed/hybrid sort' });
      return;
    }
    setShowParticipantModal(true);
  };

  const handleConfirmStart = () => {
    if (!participantName.trim()) {
      addToast({ type: 'warning', title: 'Please enter your name or alias' });
      return;
    }
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
            title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
          >
            {sidebarOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-lg leading-tight">
                {study.title || 'Untitled Study'}
              </h1>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                  {study.sortType}
                </Badge>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Layers className="w-3 h-3" />
                  {categories.length} categories · {cards.length} cards
                </span>
              </div>
            </div>
          </div>
          
        </div>

        <div className="flex items-center gap-2">
          {mode === 'edit' ? (
            <>
              <label className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-all cursor-pointer flex items-center gap-2 hover:shadow-sm">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              <button
                onClick={handleExport}
                className="px-3 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-all flex items-center gap-2 hover:shadow-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={handleStartPreview}
                className="px-4 py-2 text-sm bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
              >
                <Play className="w-4 h-4" />
                Run Study
              </button>
            </>
          ) : (
            <button
              onClick={handleExitPreview}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-all flex items-center gap-2"
            >
              <Settings2 className="w-4 h-4" />
              Back to Edit
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && mode === 'edit' && (
          <aside className="w-80 border-r border-border bg-card overflow-y-auto">
            <ConfigPanel />
          </aside>
        )}

        {/* Sort Board / Main Area */}
        <main className="flex-1 overflow-auto p-4 bg-muted/30">
          <SortBoard 
            mode={mode} 
            participantName={participantName}
          />
        </main>
      </div>

      {/* Participant Modal */}
      {showParticipantModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Start Card Sorting</h2>
            
            <div className="mb-4 p-3 bg-muted rounded-md">
              <p className="text-sm text-muted-foreground">{study.instructionsMarkdown}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Your Name / Alias <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
                placeholder="Enter a name or alias"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-1">
                Use an alias if you prefer not to share your real name.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowParticipantModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStart}
                disabled={!participantName.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50"
              >
                Start Sorting
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
