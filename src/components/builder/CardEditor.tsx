import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '@/store/builderStore';
import type { Card } from '@/domain/model';
import { GripVertical, Trash2, Plus, AlertTriangle } from 'lucide-react';

interface SortableCardProps {
  card: Card;
  onUpdate: (id: string, updates: Partial<Omit<Card, 'id'>>) => void;
  onRemove: (id: string) => void;
}

function SortableCard({ card, onUpdate, onRemove }: SortableCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isLabelTooLong = card.label.length > 50;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 border rounded-md bg-background group ${
        isLabelTooLong ? 'border-amber-300' : 'border-border'
      }`}
    >
      <button
        type="button"
        className="cursor-grab text-muted-foreground hover:text-foreground touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      
      <div className="flex-1 flex items-center gap-2">
        <input
          type="text"
          value={card.label}
          onChange={(e) => onUpdate(card.id, { label: e.target.value })}
          className="flex-1 px-2 py-1 border border-input rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="Card label"
        />
        {isLabelTooLong && (
          <span title="Label may be too long - keep it concise">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </span>
        )}
      </div>
      
      <input
        type="text"
        value={card.description}
        onChange={(e) => onUpdate(card.id, { description: e.target.value })}
        className="flex-1 px-2 py-1 border border-input rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Description (optional)"
      />
      
      <button
        type="button"
        onClick={() => onRemove(card.id)}
        className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function CardEditor() {
  const { cards, addCard, updateCard, removeCard, reorderCards } = useBuilderStore();
  const [newLabel, setNewLabel] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((c) => c.id === active.id);
      const newIndex = cards.findIndex((c) => c.id === over.id);
      reorderCards(oldIndex, newIndex);
    }
  };

  const handleAdd = () => {
    if (newLabel.trim()) {
      addCard(newLabel.trim());
      setNewLabel('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const showWarning = cards.length > 50;
  const showHint = cards.length > 30 && cards.length <= 50;

  return (
    <section className="p-6 border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Cards ({cards.length})</h2>
          <p className="text-xs text-muted-foreground">Drag to reorder</p>
        </div>
      </div>

      {showWarning && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800">
            You have {cards.length} cards. Optimal Workshop recommends 30-50 cards for manageable sorts.
          </p>
        </div>
      )}

      {showHint && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            💡 You're in the ideal range (30-50 cards) for a comprehensive card sort.
          </p>
        </div>
      )}

      {cards.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center border-2 border-dashed border-border rounded-md">
          No cards yet. Add the items/features you want participants to sort.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto">
              {cards.map((card) => (
                <SortableCard
                  key={card.id}
                  card={card}
                  onUpdate={updateCard}
                  onRemove={removeCard}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <div className="flex gap-2 mt-4">
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          placeholder="New card label"
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={!newLabel.trim()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>
    </section>
  );
}
