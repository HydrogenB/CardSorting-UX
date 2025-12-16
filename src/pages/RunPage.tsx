import { useRunStore } from '@/store/runStore';
import { readJsonFile, downloadJson } from '@/lib/download';
import { validateTemplate } from '@/domain/schema';
import type { StudyTemplate } from '@/domain/model';
import { useCallback } from 'react';
import { useI18n } from '@/contexts/i18n-context';

export default function RunPage() {
  const {
    step,
    template,
    participantName,
    setTemplate,
    setParticipantName,
    startSession,
    moveCard,
    undo,
    reset,
    generateResult,
    getUnsortedCards,
    getProgress,
    cardPlacements,
    undoStack,
  } = useRunStore();
  
  const { t } = useI18n();

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await readJsonFile<StudyTemplate>(file);
      const validation = validateTemplate(data);
      
      if (!validation.success) {
        alert(t('runPage.messages.invalidTemplate') + '\n' + validation.error.issues.map((issue) => issue.message).join('\n'));
        return;
      }
      
      await setTemplate(data);
    } catch (error) {
      alert(t('runPage.messages.failedToReadTemplate'));
    }
  }, [setTemplate, t]);

  const handleStartSession = () => {
    if (!participantName.trim()) {
      alert(t('runPage.messages.enterName'));
      return;
    }
    startSession();
  };

  const handleExportResult = async () => {
    try {
      const result = await generateResult();
      const filename = `result_${participantName.replace(/\s+/g, '_')}.json`;
      downloadJson(result, filename);
      alert(t('runPage.messages.resultExported'));
    } catch (error) {
      alert(t('runPage.messages.failedToExport'));
    }
  };

  const progress = getProgress();
  const unsortedCards = getUnsortedCards();

  // Upload step
  if (step === 'upload') {
    return (
      <div className="max-w-xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-4">{t('runPage.title')}</h1>
        <p className="text-muted-foreground mb-8">
          {t('runPage.uploadDescription')}
        </p>
        
        <label className="block p-8 border-2 border-dashed border-border rounded-lg hover:border-primary cursor-pointer transition-colors">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="text-4xl mb-2">📁</div>
          <p className="text-muted-foreground">{t('runPage.clickToUpload')}</p>
        </label>
      </div>
    );
  }

  // Participant info step
  if (step === 'participant') {
    return (
      <div className="max-w-xl mx-auto py-16">
        <h1 className="text-2xl font-bold mb-2">{template?.study.title}</h1>
        <p className="text-muted-foreground mb-6">{template?.study.description}</p>
        
        <div className="p-6 border border-border rounded-lg bg-card mb-6">
          <h2 className="font-semibold mb-2">{t('runPage.instructions')}</h2>
          <p className="text-sm text-muted-foreground">{template?.study.instructionsMarkdown}</p>
        </div>
        
        <div className="p-6 border border-border rounded-lg bg-card">
          <label className="block mb-4">
            <span className="block text-sm font-medium mb-1">{t('runPage.participantInfo.nameLabel')}</span>
            <input
              type="text"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder={t('runPage.participantInfo.namePlaceholder')}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('runPage.nameAliasHint')}
            </p>
          </label>
          
          <button
            onClick={handleStartSession}
            disabled={!participantName.trim()}
            className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {t('runPage.participantInfo.startSession')}
          </button>
        </div>
        
        <button
          onClick={reset}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          ← {t('runPage.uploadDifferentTemplate')}
        </button>
      </div>
    );
  }

  // Sorting step
  if (step === 'sorting') {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{template?.study.title}</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {progress.sorted}/{progress.total} {t('runPage.sorted')}
            </span>
            <button
              onClick={undo}
              disabled={undoStack.length === 0}
              className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted disabled:opacity-50 transition-colors"
            >
              {t('common.undo')}
            </button>
            <button
              onClick={() => useRunStore.setState({ step: 'review' })}
              disabled={template?.study.settings.requireAllCardsSorted && unsortedCards.length > 0}
              className="px-4 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {t('runPage.reviewAndExport')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Unsorted pile */}
          <div className="p-4 border border-border rounded-lg bg-muted/50">
            <h3 className="font-semibold mb-2">{t('runPage.sorting.unsortedCards')} ({unsortedCards.length})</h3>
            <div className="space-y-2">
              {unsortedCards.map((cardId) => {
                const card = template?.cards.find(c => c.id === cardId);
                return (
                  <div
                    key={cardId}
                    className="p-2 bg-card border border-border rounded shadow-sm cursor-move"
                  >
                    <p className="text-sm">{card?.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category columns */}
          {template?.categories.map((category) => {
            const cardsInCategory = cardPlacements
              .filter(p => p.categoryId === category.id && !p.isUnsure)
              .map(p => template.cards.find(c => c.id === p.cardId));
            
            return (
              <div key={category.id} className="p-4 border border-border rounded-lg bg-card">
                <h3 className="font-semibold mb-2">{category.label}</h3>
                <div className="space-y-2 min-h-[100px]">
                  {cardsInCategory.map((card) => card && (
                    <div
                      key={card.id}
                      className="p-2 bg-secondary border border-border rounded shadow-sm cursor-move"
                    >
                      <p className="text-sm">{card.label}</p>
                      <button
                        onClick={() => moveCard(card.id, null)}
                        className="text-xs text-muted-foreground hover:text-destructive mt-1"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                {/* Quick add buttons for unsorted cards */}
                {unsortedCards.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-1">Add card:</p>
                    <div className="flex flex-wrap gap-1">
                      {unsortedCards.slice(0, 3).map((cardId) => {
                        const card = template.cards.find(c => c.id === cardId);
                        return (
                          <button
                            key={cardId}
                            onClick={() => moveCard(cardId, category.id)}
                            className="px-2 py-1 text-xs bg-muted hover:bg-accent rounded truncate max-w-[80px]"
                            title={card?.label}
                          >
                            {card?.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Unsure bucket */}
          {template?.study.settings.enableUnsureBucket && (
            <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
              <h3 className="font-semibold mb-2 text-amber-800">
                {template.study.settings.unsureBucketLabel}
              </h3>
              <div className="space-y-2 min-h-[100px]">
                {cardPlacements
                  .filter(p => p.isUnsure)
                  .map((placement) => {
                    const card = template.cards.find(c => c.id === placement.cardId);
                    return card && (
                      <div
                        key={card.id}
                        className="p-2 bg-white border border-amber-200 rounded shadow-sm cursor-move"
                      >
                        <p className="text-sm">{card.label}</p>
                        <button
                          onClick={() => moveCard(card.id, null)}
                          className="text-xs text-muted-foreground hover:text-destructive mt-1"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })}
              </div>
              {unsortedCards.length > 0 && (
                <div className="mt-2 pt-2 border-t border-amber-200">
                  <p className="text-xs text-amber-700 mb-1">Mark as unsure:</p>
                  <div className="flex flex-wrap gap-1">
                    {unsortedCards.slice(0, 3).map((cardId) => {
                      const card = template.cards.find(c => c.id === cardId);
                      return (
                        <button
                          key={cardId}
                          onClick={() => moveCard(cardId, null, true)}
                          className="px-2 py-1 text-xs bg-amber-100 hover:bg-amber-200 rounded truncate max-w-[80px]"
                          title={card?.label}
                        >
                          {card?.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Review step
  if (step === 'review') {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Review Your Sorting</h1>
        <p className="text-muted-foreground mb-6">
          Please review your card placements before exporting.
        </p>

        <div className="space-y-4 mb-8">
          {template?.categories.map((category) => {
            const cardsInCategory = cardPlacements
              .filter(p => p.categoryId === category.id && !p.isUnsure)
              .map(p => template.cards.find(c => c.id === p.cardId));
            
            return (
              <div key={category.id} className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold">{category.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {cardsInCategory.length === 0
                    ? 'No cards'
                    : cardsInCategory.map(c => c?.label).join(', ')}
                </p>
              </div>
            );
          })}

          {template?.study.settings.enableUnsureBucket && (
            <div className="p-4 border border-amber-200 rounded-lg bg-amber-50">
              <h3 className="font-semibold text-amber-800">
                {template.study.settings.unsureBucketLabel}
              </h3>
              <p className="text-sm text-amber-700">
                {cardPlacements.filter(p => p.isUnsure).length === 0
                  ? 'No cards'
                  : cardPlacements
                      .filter(p => p.isUnsure)
                      .map(p => template.cards.find(c => c.id === p.cardId)?.label)
                      .join(', ')}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => useRunStore.setState({ step: 'sorting' })}
            className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
          >
            ← Back to Sorting
          </button>
          <button
            onClick={handleExportResult}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity"
          >
            Export Result
          </button>
        </div>
      </div>
    );
  }

  return null;
}
