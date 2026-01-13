import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBuilderStore } from '@/store/builderStore';
import { downloadJson } from '@/lib/download';
import { DroppableCategory } from './DroppableCategory';
import { DraggableCard } from './DraggableCard';
import { Download, RotateCcw, Maximize2, GripVertical } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/components/ui/toast';
import { useI18n } from '@/contexts/i18n-context';

interface SortBoardProps {
  mode: 'edit' | 'preview';
  participantName: string;
}

interface CardPlacement {
  [cardId: string]: string | null; // categoryId or null for unsorted
}

export function SortBoard({ mode, participantName }: SortBoardProps) {
  const { study, categories, cards } = useBuilderStore();
  const [placements, setPlacements] = useState<CardPlacement>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [movesCount, setMovesCount] = useState(0);
  const [, setUndoStack] = useState<CardPlacement[]>([]);
  const { addToast } = useToast();
  const { t } = useI18n();
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(200, Math.min(600, e.clientX - 20)); // Limit width between 200px and 600px
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Initialize placements when entering preview mode
  useEffect(() => {
    if (mode === 'preview') {
      const cardList = study.settings.randomizeCardOrder 
        ? [...cards].sort(() => Math.random() - 0.5)
        : cards;
      const initial: CardPlacement = {};
      cardList.forEach(card => {
        initial[card.id] = null;
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPlacements(initial);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStartTime(new Date());
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMovesCount(0);
    }
  }, [mode, cards, study.settings.randomizeCardOrder]);

  const sensors = useSensors(
    useSensor(PointerSensor, { 
      activationConstraint: { 
        distance: 8,
      } 
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group cards by category
  const unsortedCards = useMemo(() => 
    cards.filter(card => placements[card.id] === null || placements[card.id] === undefined),
    [cards, placements]
  );

  const unsureCards = useMemo(() =>
    cards.filter(card => placements[card.id] === 'unsure'),
    [cards, placements]
  );

  const getCardsInCategory = (categoryId: string) =>
    cards.filter(card => placements[card.id] === categoryId);


  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };


  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const cardId = active.id as string;
    const overId = over.id as string;

    // Determine target category
    let targetCategory: string | null = null;
    
    if (overId === 'unsorted') {
      targetCategory = null;
    } else if (overId === 'unsure') {
      targetCategory = 'unsure';
    } else if (categories.some(c => c.id === overId)) {
      targetCategory = overId;
    } else {
      // Dropped on another card - find its category
      const overCard = cards.find(c => c.id === overId);
      if (overCard) {
        targetCategory = placements[overId];
      }
    }

    if (placements[cardId] !== targetCategory) {
      // Save current state to undo stack before changing
      setUndoStack(prev => [...prev, { ...placements }]);
      setPlacements(prev => ({ ...prev, [cardId]: targetCategory }));
      setMovesCount(prev => prev + 1);
      
      // Only show toast with undo in edit/studio mode, not in study mode
      if (mode === 'edit') {
        // Get card name for toast
        const movedCard = cards.find(c => c.id === cardId);
        const targetName = targetCategory === null 
          ? t('runPage.sorting.unsortedCards')
          : targetCategory === 'unsure'
            ? study.settings.unsureBucketLabel
            : categories.find(c => c.id === targetCategory)?.label || targetCategory;
        
        // Show toast with undo action
        addToast({
          type: 'action',
          title: t('accessibility.cardMoved', { category: targetName }),
          description: movedCard?.label,
          duration: 5000,
          action: {
            label: t('common.undo'),
            onClick: () => {
              setUndoStack(prev => {
                if (prev.length === 0) return prev;
                const newStack = [...prev];
                const previousState = newStack.pop()!;
                setPlacements(previousState);
                return newStack;
              });
            },
          },
        });
      }
    }
  };

  const handleReset = () => {
    if (confirm('Reset all card placements?')) {
      const initial: CardPlacement = {};
      cards.forEach(card => { initial[card.id] = null; });
      setPlacements(initial);
      setUndoStack([]);
      setMovesCount(0);
      setStartTime(new Date());
    }
  };

  const handleExportResult = async () => {
    if (study.settings.requireAllCardsSorted && unsortedCards.length > 0) {
      alert(`Please sort all cards before exporting. ${unsortedCards.length} cards remaining.`);
      return;
    }

    const endTime = new Date();
    const durationMs = startTime ? endTime.getTime() - startTime.getTime() : 0;
    const durationMinutes = Math.round(durationMs / 60000 * 10) / 10;

    // Human-readable result format
    const result = {
      study: {
        title: study.title,
        description: study.description,
        sortType: study.sortType,
      },
      participant: {
        name: participantName,
        completedAt: endTime.toISOString(),
        durationMinutes,
      },
      results: Object.fromEntries(
        categories.map(cat => [
          cat.label,
          getCardsInCategory(cat.id).map(c => c.label)
        ])
      ),
      unsure: unsureCards.map(c => c.label),
      unsorted: unsortedCards.map(c => c.label),
      meta: {
        totalCards: cards.length,
        totalCategories: categories.length,
        movesCount,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    };

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = `${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    const filename = `result_${participantName.replace(/\s+/g, '_')}_${dateStr}_${timeStr}.json`;
    downloadJson(result, filename);
  };

  const activeCard = cards.find(c => c.id === activeId);

  // Edit mode - show placeholder
  /* 
  // REMOVED: Replaced with Live Preview
  if (mode === 'edit') {
    return (
      <div className="h-full flex items-center justify-center">
        ...
      </div>
    );
  }
  */

  // Preview/Run mode - show sort board
  return (
    <div className="h-full flex flex-col">
      {/* Action Bar */}
      <div className="mb-4 p-3 flex items-center justify-end gap-2 bg-card rounded-lg border border-border/50 shadow-sm">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        {mode === 'preview' && (
          <button
            onClick={handleExportResult}
            disabled={study.settings.requireAllCardsSorted && unsortedCards.length > 0}
            className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:from-gray-400 disabled:to-gray-500 transition-all flex items-center gap-2 shadow-md"
          >
            <Download className="w-4 h-4" />
            Export Result
          </button>
        )}
      </div>

      {/* Sort Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="flex-1 overflow-hidden flex"
        >
          {/* Unsorted Pile (Resizable Sidebar) */}
          <div 
            className="flex flex-col gap-4 overflow-y-auto p-2 border-r border-border/50 relative group bg-background/50 h-full"
            style={{ width: sidebarWidth, minWidth: sidebarWidth, transition: isResizing ? 'none' : 'width 0.2s ease' }}
          >
            <div className="flex items-center justify-between px-1">
               <h3 className="text-sm font-medium text-muted-foreground ml-1">
                 {t('runPage.sorting.unsortedCards')}
               </h3>
               <button 
                 onClick={() => setSidebarWidth(prev => prev === 250 ? 380 : 250)}
                 className="p-1 hover:bg-muted rounded-md text-muted-foreground transition-colors"
                 title="Toggle auto size"
               >
                 <Maximize2 className="w-3.5 h-3.5" />
               </button>
            </div>

            <DroppableCategory
              id="unsorted"
              title="" 
              count={unsortedCards.length}
              variant="unsorted"
              className="mt-0"
              hideHeader
            >
              {unsortedCards.map(card => (
                <DraggableCard key={card.id} card={card} />
              ))}
            </DroppableCategory>
          </div>

          {/* Resize Handle */}
          <div
            className="w-1.5 h-full cursor-col-resize hover:bg-primary/20 active:bg-primary/40 flex items-center justify-center transition-colors z-10 -ml-0.5"
            onMouseDown={handleResizeStart}
          >
            <div className="h-8 w-1 rounded-full bg-border group-hover:bg-primary/50 transition-colors" />
          </div>

          {/* Categories Grid (Main Area) */}
          <div className="flex-1 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto content-start p-4">
            {categories.map(category => (
              <DroppableCategory
                key={category.id}
                id={category.id}
                title={category.label}
                image={category.image}
                count={getCardsInCategory(category.id).length}
              >
                {getCardsInCategory(category.id).map(card => (
                  <DraggableCard key={card.id} card={card} />
                ))}
              </DroppableCategory>
            ))}

            {/* Unsure Bucket */}
            {study.settings.enableUnsureBucket && (
              <DroppableCategory
                id="unsure"
                title={study.settings.unsureBucketLabel}
                count={unsureCards.length}
                variant="unsure"
              >
                {unsureCards.map(card => (
                  <DraggableCard key={card.id} card={card} />
                ))}
              </DroppableCategory>
            )}
          </div>
        </div>

        <DragOverlay dropAnimation={null}>
          {activeCard && (
            <div className="bg-background border-2 border-primary rounded-lg shadow-2xl overflow-hidden cursor-grabbing">
              {activeCard.image ? (
                <>
                  <div className="relative aspect-video w-40">
                    <img 
                      src={activeCard.image} 
                      alt={activeCard.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{activeCard.label}</p>
                  </div>
                </>
              ) : (
                <div className="p-3 flex items-center gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{activeCard.label}</p>
                    {activeCard.description && (
                      <p className="text-xs text-muted-foreground truncate">{activeCard.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
