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
import { Download, RotateCcw, HelpCircle } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

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
      setPlacements(prev => ({ ...prev, [cardId]: targetCategory }));
      setMovesCount(prev => prev + 1);
    }
  };

  const handleReset = () => {
    if (confirm('Reset all card placements?')) {
      const initial: CardPlacement = {};
      cards.forEach(card => { initial[card.id] = null; });
      setPlacements(initial);
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

    const filename = `result_${participantName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    downloadJson(result, filename);
  };

  const activeCard = cards.find(c => c.id === activeId);

  // Edit mode - show placeholder
  if (mode === 'edit') {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-lg">
            <HelpCircle className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Sort Board Preview</h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Configure your study in the left panel, then click <strong className="text-foreground">"Run Study"</strong> to start the card sorting session.
          </p>
          
          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-3xl font-bold text-primary">{categories.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Categories</p>
            </div>
            <div className="p-4 rounded-xl bg-card border border-border">
              <p className="text-3xl font-bold text-primary">{cards.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Cards</p>
            </div>
          </div>
          
          {cards.length === 0 && (
            <p className="mt-6 text-sm text-amber-600 bg-amber-50 px-4 py-2 rounded-lg inline-block">
              Add some cards to get started
            </p>
          )}
        </div>
      </div>
    );
  }

  // Preview/Run mode - show sort board
  return (
    <div className="h-full flex flex-col">
      {/* Action Bar */}
      <div className="mb-4 flex items-center justify-end gap-2">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-all flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
        <button
          onClick={handleExportResult}
          disabled={study.settings.requireAllCardsSorted && unsortedCards.length > 0}
          className="px-4 py-2 text-sm bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:from-gray-400 disabled:to-gray-500 transition-all flex items-center gap-2 shadow-md"
        >
          <Download className="w-4 h-4" />
          Export Result
        </button>
      </div>

      {/* Sort Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 grid grid-cols-[250px_1fr] gap-4 overflow-hidden">
          {/* Unsorted Pile */}
          <div className="flex flex-col gap-4 overflow-y-auto">
            <DroppableCategory
              id="unsorted"
              title="Unsorted Cards"
              count={unsortedCards.length}
              variant="unsorted"
            >
              {unsortedCards.map(card => (
                <DraggableCard key={card.id} card={card} />
              ))}
            </DroppableCategory>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto content-start">
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

        <DragOverlay>
          {activeCard && (
            <div className="p-3 bg-card border-2 border-primary rounded-lg shadow-lg">
              {activeCard.label}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
