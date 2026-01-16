import { useState, useEffect, useMemo, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
  MeasuringStrategy,
  closestCorners,
  defaultDropAnimationSideEffects,
  type DropAnimation,
} from '@dnd-kit/core';
import { 
  sortableKeyboardCoordinates, 
  arrayMove, 
} from '@dnd-kit/sortable';
import { useBuilderStore } from '@/store/builderStore';
import { downloadJson } from '@/lib/download';
import { DroppableCategory } from './DroppableCategory';
import { DraggableCard } from './DraggableCard';
import { Upload, Download, RotateCcw, Maximize2 } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useToast } from '@/components/ui/toast';
import { useI18n } from '@/contexts/i18n-context';


interface SortBoardProps {
  mode: 'edit' | 'preview';
  participantName: string;
}

type Items = Record<string, string[]>;

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

export function SortBoard({ mode, participantName }: SortBoardProps) {
  const { study, categories, cards } = useBuilderStore();
  const [items, setItems] = useState<Items>({
    unsorted: [],
    unsure: [],
  });
  const [activeId, setActiveId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [movesCount, setMovesCount] = useState(0);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const [isResizing, setIsResizing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { addToast } = useToast();
  const { t } = useI18n();

  // Initialize items structure
  useEffect(() => {
    setItems((prev: Items) => {
      // Ensure all categories exist in items
      const next = { ...prev };
      
      // Add 'unsorted' and 'unsure' if missing
      if (!next.unsorted) next.unsorted = [];
      if (!next.unsure) next.unsure = [];
      
      // Add all categories
      categories.forEach(cat => {
        if (!next[cat.id]) {
          next[cat.id] = [];
        }
      });

      // Find cards that are not in any container
      const trackedCardIds = new Set(Object.values(next).flat());
      const missingCards = cards.filter(c => !trackedCardIds.has(c.id));
      
      if (missingCards.length > 0) {
        next.unsorted = [...next.unsorted, ...missingCards.map(c => c.id)];
      }

      // Cleanup: remove cards that no longer exist
      const cardIds = new Set(cards.map(c => c.id));
      Object.keys(next).forEach(key => {
        next[key] = next[key].filter(id => cardIds.has(id));
      });

      return next;
    });

    if (!startTime) {
      setStartTime(new Date());
    }
  }, [cards, categories]);
  
  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = Math.max(200, Math.min(600, e.clientX - 20)); 
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

  useKeyboardShortcuts();

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

  const findContainer = (id: string) => {
    if (id in items) {
      return id;
    }
    return Object.keys(items).find((key) => items[key].includes(id));
  };  

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (overId == null || active.id in items) {
      return;
    }

    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(overId as string);

    if (!activeContainer || !overContainer || activeContainer === overContainer) {
      return;
    }

    setItems((prev: Items) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.indexOf(active.id as string);
      const overIndex = overItems.indexOf(overId as string);

      let newIndex;

      if (overId in prev) {
        // We're over a container
        newIndex = overItems.length + 1;
      } else {
        const isBelowOverItem =
          over &&
          active.rect.current.translated &&
          active.rect.current.translated.top >
            over.rect.top + over.rect.height;

        const modifier = isBelowOverItem ? 1 : 0;

        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }

      return {
        ...prev,
        [activeContainer]: [
          ...prev[activeContainer].filter((item) => item !== active.id)
        ],
        [overContainer]: [
          ...prev[overContainer].slice(0, newIndex),
          prev[activeContainer][activeIndex],
          ...prev[overContainer].slice(newIndex, prev[overContainer].length)
        ]
      };
    });
    setMovesCount(prev => prev + 1);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id as string);
    const overContainer = findContainer(over?.id as string);

    if (
      activeContainer &&
      overContainer &&
      activeContainer === overContainer
    ) {
      const activeIndex = items[activeContainer].indexOf(active.id as string);
      const overIndex = items[overContainer].indexOf(over?.id as string);

      if (activeIndex !== overIndex) {
        setItems((prev: Items) => ({
          ...prev,
          [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
        }));
        setMovesCount(prev => prev + 1);
      }
    }
    
    // Toast notification logic
    if (mode === 'edit' && activeContainer && overContainer && activeContainer !== overContainer) {
      const movedCard = cards.find(c => c.id === active.id);
      const targetName = overContainer === 'unsorted' 
        ? t('runPage.sorting.unsortedCards')
        : overContainer === 'unsure'
          ? study.settings.unsureBucketLabel
          : categories.find(c => c.id === overContainer)?.label || overContainer;

       addToast({
        type: 'action',
        title: t('accessibility.cardMoved', { category: targetName }),
        description: movedCard?.label,
        duration: 3000,
       });
    }

    setActiveId(null);
  };

  const handleReset = () => {
    if (confirm('Reset all card placements?')) {
      setItems((prev: Items) => {
        const next = { ...prev };
        // Clear all categories
        Object.keys(next).forEach(key => {
          next[key] = [];
        });
        // Move all cards to unsorted
        next.unsorted = cards.map(c => c.id);
        return next;
      });
      setMovesCount(0);
      setStartTime(new Date());
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        
        // Basic validation
        if (!json.results || !json.unsorted) {
          throw new Error('Invalid file format');
        }

        const nextItems: Items = {
          unsorted: [],
          unsure: [],
        };
        
        // Initialize all categories with empty arrays
        categories.forEach(cat => {
          nextItems[cat.id] = [];
        });

        // Helper to find card ID by label
        const findCardId = (label: string) => cards.find(c => c.label === label)?.id;

        // Process Unsorted
        if (Array.isArray(json.unsorted)) {
          nextItems.unsorted = json.unsorted.map(findCardId).filter(Boolean) as string[];
        }

        // Process Unsure
        if (Array.isArray(json.unsure)) {
          nextItems.unsure = json.unsure.map(findCardId).filter(Boolean) as string[];
        }

        // Process Categories (Results)
        if (json.results && typeof json.results === 'object') {
          Object.entries(json.results).forEach(([catLabel, cardLabels]) => {
            // Find category ID by label
            const category = categories.find(c => c.label === catLabel);
            if (category && Array.isArray(cardLabels)) {
               nextItems[category.id] = cardLabels.map(findCardId).filter(Boolean) as string[];
            }
          });
        }
        
        // Ensure ALL cards are accounted for. If any are missing, put them in unsorted.
        const trackedCardIds = new Set(Object.values(nextItems).flat());
        const missingCards = cards.filter(c => !trackedCardIds.has(c.id));
        if (missingCards.length > 0) {
          nextItems.unsorted = [...nextItems.unsorted, ...missingCards.map(c => c.id)];
        }

        setItems(nextItems);
        addToast({
          type: 'success',
          title: 'Session Restored',
          description: 'Previous sorting session has been loaded successfully.',
        });

      } catch (error) {
        console.error('Import error:', error);
        alert('Failed to import session. Invalid file format.');
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleExportResult = async () => {
    if (study.settings.requireAllCardsSorted && items.unsorted.length > 0) {
      alert(`Please sort all cards before exporting. ${items.unsorted.length} cards remaining.`);
      return;
    }

    const endTime = new Date();
    const durationMs = startTime ? endTime.getTime() - startTime.getTime() : 0;
    const durationMinutes = Math.round(durationMs / 60000 * 10) / 10;

    // Helper to get cards
    const getCards = (ids: string[]) => ids.map(id => cards.find(c => c.id === id)!).filter(Boolean);

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
          getCards(items[cat.id] || []).map(c => c.label)
        ])
      ),
      unsure: getCards(items.unsure || []).map(c => c.label),
      unsorted: getCards(items.unsorted || []).map(c => c.label),
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

  const activeCard = useMemo(() => cards.find(c => c.id === activeId), [activeId, cards]);

  return (
    <div className="h-full flex flex-col">
      {/* Action Bar */}
      <div className="mb-4 p-3 flex items-center justify-end gap-2 bg-card rounded-lg border border-border/50 shadow-sm">
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleImportFile}
          accept=".json"
          className="hidden" 
        />
        <button
          onClick={handleImportClick}
           className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-all flex items-center gap-2"
        >
          <Upload className="w-4 h-4" />
          Continue Session
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={handleExportResult}
          className="px-4 py-2 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:opacity-95 transition-all flex items-center gap-2 shadow-md"
        >
          <Download className="w-4 h-4" />
          Export Result
        </button>
      </div>

      {/* Sort Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        measuring={{
          droppable: {
            strategy: MeasuringStrategy.Always,
          },
        }}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div 
          className="flex-1 overflow-hidden flex"
        >
          {/* Unsorted Pile (Resizable Sidebar) */}
          <div 
            className="flex flex-col gap-4 overflow-y-auto p-2 border-r border-border/40 relative flex-shrink-0 bg-muted/10 items-stretch"
            style={{ width: sidebarWidth, transition: isResizing ? 'none' : 'width 0.2s ease' }}
          >
            <div className="flex items-center justify-between px-2 py-2 sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border/40 mb-2">
               <h3 className="text-sm font-semibold text-foreground/80 flex items-center gap-2">
                 {t('runPage.sorting.unsortedCards')}
                 <span className="text-xs font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                   {(items.unsorted || []).length}
                 </span>
               </h3>
               <button 
                 onClick={() => setSidebarWidth((prev: number) => prev === 250 ? 380 : 250)}
                 className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                 title="Toggle auto size"
               >
                 <Maximize2 className="w-4 h-4" />
               </button>
            </div>

            <DroppableCategory
              id="unsorted"
              title="" 
              count={(items.unsorted || []).length}
              variant="unsorted"
              className="mt-0 border-0 bg-transparent shadow-none"
              hideHeader
              items={items.unsorted || []}
            >
              {(items.unsorted || []).map(cardId => {
                const card = cards.find(c => c.id === cardId);
                return card ? <DraggableCard key={card.id} card={card} /> : null;
              })}
            </DroppableCategory>
          </div>

          {/* Resize Handle */}
          <div
            className="w-4 h-full cursor-col-resize hover:bg-primary/10 active:bg-primary/20 flex items-center justify-center transition-colors z-20 -ml-2 group touch-none select-none relative"
            onMouseDown={handleResizeStart}
          >
            <div className="h-12 w-1 rounded-full bg-border group-hover:bg-primary/40 group-active:bg-primary transition-all duration-300" />
          </div>

          {/* Categories Grid (Main Area) */}
          <div className="flex-1 flex flex-row gap-6 overflow-x-auto overflow-y-hidden p-6 bg-muted/5 items-start">
            {categories.map(category => (
              <div key={category.id} className="w-80 flex-shrink-0 flex flex-col h-full"> 
                <DroppableCategory
                  key={category.id}
                  id={category.id}
                  title={category.label}
                  image={category.image}
                  count={(items[category.id] || []).length}
                  items={items[category.id] || []}
                  className="h-full flex flex-col"
                >
                  {(items[category.id] || []).map(cardId => {
                     const card = cards.find(c => c.id === cardId);
                     return card ? <DraggableCard key={card.id} card={card} /> : null;
                  })}
                </DroppableCategory>
              </div>
            ))}

            {/* Unsure Bucket */}
            {study.settings.enableUnsureBucket && (
              <div className="w-80 flex-shrink-0 flex flex-col h-full">
                <DroppableCategory
                  id="unsure"
                  title={study.settings.unsureBucketLabel}
                  count={(items.unsure || []).length}
                  variant="unsure"
                  items={items.unsure || []}
                  className="h-full flex flex-col"
                >
                  {(items.unsure || []).map(cardId => {
                    const card = cards.find(c => c.id === cardId);
                    return card ? <DraggableCard key={card.id} card={card} /> : null;
                  })}
                </DroppableCategory>
              </div>
            )}
          </div>
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
          {activeCard && (
            <div className="bg-background border-2 border-primary rounded-lg shadow-2xl overflow-hidden cursor-grabbing w-[300px]">
              {activeCard.image ? (
                <>
                  <div className="relative aspect-video w-full">
                    <img 
                      src={activeCard.image} 
                      alt={activeCard.label}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium truncate">{activeCard.label}</p>
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
