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
import type { Category } from '@/domain/model';
import { GripVertical, Trash2, Plus } from 'lucide-react';

interface SortableItemProps {
  category: Category;
  onUpdate: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  onRemove: (id: string) => void;
}

function SortableItem({ category, onUpdate, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-3 border border-border rounded-md bg-background group"
    >
      <button
        type="button"
        className="cursor-grab text-muted-foreground hover:text-foreground touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-4 h-4" />
      </button>
      
      <input
        type="text"
        value={category.label}
        onChange={(e) => onUpdate(category.id, { label: e.target.value })}
        className="flex-1 px-2 py-1 border border-input rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Category label"
      />
      
      <input
        type="text"
        value={category.description}
        onChange={(e) => onUpdate(category.id, { description: e.target.value })}
        className="flex-1 px-2 py-1 border border-input rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
        placeholder="Description (optional)"
      />
      
      <button
        type="button"
        onClick={() => onRemove(category.id)}
        className="p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function CategoryEditor() {
  const { categories, addCategory, updateCategory, removeCategory, reorderCategories } = useBuilderStore();
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
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      reorderCategories(oldIndex, newIndex);
    }
  };

  const handleAdd = () => {
    if (newLabel.trim()) {
      addCategory(newLabel.trim());
      setNewLabel('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <section className="p-6 border border-border rounded-lg bg-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Categories ({categories.length})</h2>
          <p className="text-xs text-muted-foreground">Drag to reorder</p>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center border-2 border-dashed border-border rounded-md">
          No categories yet. Add categories for participants to sort cards into.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 mb-4">
              {categories.map((category) => (
                <SortableItem
                  key={category.id}
                  category={category}
                  onUpdate={updateCategory}
                  onRemove={removeCategory}
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
          placeholder="New category label"
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
