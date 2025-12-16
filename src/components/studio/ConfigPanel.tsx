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
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useBuilderStore } from '@/store/builderStore';
import { SortableItem } from './SortableItem';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus
} from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  count?: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, count, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-sm flex items-center gap-2">
          {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          {title}
          {count !== undefined && (
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{count}</span>
          )}
        </span>
      </button>
      {open && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}

export function ConfigPanel() {
  const {
    study,
    categories,
    cards,
    setStudy,
    addCategory,
    updateCategory,
    removeCategory,
    reorderCategories,
    addCard,
    updateCard,
    removeCard,
    reorderCards,
  } = useBuilderStore();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [newCardLabel, setNewCardLabel] = useState('');

  const handleAddCategory = () => {
    if (newCategoryLabel.trim()) {
      addCategory(newCategoryLabel.trim());
      setNewCategoryLabel('');
    }
  };

  const handleAddCard = () => {
    if (newCardLabel.trim()) {
      addCard(newCardLabel.trim());
      setNewCardLabel('');
    }
  };

  const handleCategoryDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((c) => c.id === active.id);
      const newIndex = categories.findIndex((c) => c.id === over.id);
      reorderCategories(oldIndex, newIndex);
    }
  };

  const handleCardDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cards.findIndex((c) => c.id === active.id);
      const newIndex = cards.findIndex((c) => c.id === over.id);
      reorderCards(oldIndex, newIndex);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Study Info */}
      <CollapsibleSection title="Study Info">
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Title</label>
            <input
              type="text"
              value={study.title}
              onChange={(e) => setStudy({ title: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-input rounded bg-background"
              placeholder="Study title"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Description</label>
            <textarea
              value={study.description}
              onChange={(e) => setStudy({ description: e.target.value })}
              className="w-full px-2 py-1.5 text-sm border border-input rounded bg-background resize-none"
              rows={2}
              placeholder="Brief description"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1 text-muted-foreground">Sort Type</label>
            <select
              value={study.sortType}
              onChange={(e) => setStudy({ sortType: e.target.value as 'open' | 'closed' | 'hybrid' })}
              className="w-full px-2 py-1.5 text-sm border border-input rounded bg-background"
            >
              <option value="closed">Closed</option>
              <option value="open">Open</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Settings */}
      <CollapsibleSection title="Settings" defaultOpen={false}>
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={study.settings.randomizeCardOrder}
              onChange={(e) => setStudy({ 
                settings: { ...study.settings, randomizeCardOrder: e.target.checked } 
              })}
              className="rounded"
            />
            Randomize card order
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={study.settings.requireAllCardsSorted}
              onChange={(e) => setStudy({ 
                settings: { ...study.settings, requireAllCardsSorted: e.target.checked } 
              })}
              className="rounded"
            />
            Require all sorted
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={study.settings.enableUnsureBucket}
              onChange={(e) => setStudy({ 
                settings: { ...study.settings, enableUnsureBucket: e.target.checked } 
              })}
              className="rounded"
            />
            Enable "Unsure" bucket
          </label>
        </div>
      </CollapsibleSection>

      {/* Categories */}
      <CollapsibleSection title="Categories" count={categories.length}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCategoryDragEnd}
        >
          <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {categories.map((cat) => (
                <SortableItem
                  key={cat.id}
                  id={cat.id}
                  label={cat.label}
                  description={cat.description}
                  image={cat.image}
                  onLabelChange={(value) => updateCategory(cat.id, { label: value })}
                  onDescriptionChange={(value) => updateCategory(cat.id, { description: value })}
                  onImageChange={(value) => updateCategory(cat.id, { image: value })}
                  onRemove={() => removeCategory(cat.id)}
                  placeholder={{ label: 'Category name', description: 'Description (optional)' }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex gap-1 mt-3">
          <input
            type="text"
            value={newCategoryLabel}
            onChange={(e) => setNewCategoryLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            className="flex-1 px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Add new category..."
          />
          <button
            onClick={handleAddCategory}
            disabled={!newCategoryLabel.trim()}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </CollapsibleSection>

      {/* Cards */}
      <CollapsibleSection title="Cards" count={cards.length}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleCardDragEnd}
        >
          <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {cards.map((card) => (
                <SortableItem
                  key={card.id}
                  id={card.id}
                  label={card.label}
                  description={card.description}
                  image={card.image}
                  onLabelChange={(value) => updateCard(card.id, { label: value })}
                  onDescriptionChange={(value) => updateCard(card.id, { description: value })}
                  onImageChange={(value) => updateCard(card.id, { image: value })}
                  onRemove={() => removeCard(card.id)}
                  placeholder={{ label: 'Card label', description: 'Description (optional)' }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="flex gap-1 mt-3">
          <input
            type="text"
            value={newCardLabel}
            onChange={(e) => setNewCardLabel(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
            className="flex-1 px-3 py-2 text-sm border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Add new card..."
          />
          <button
            onClick={handleAddCard}
            disabled={!newCardLabel.trim()}
            className="px-3 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {cards.length > 50 && (
          <p className="text-xs text-amber-600 mt-2 p-2 bg-amber-50 rounded-lg">
            ⚠️ {cards.length} cards - consider reducing for better UX
          </p>
        )}
      </CollapsibleSection>

      {/* Instructions */}
      <CollapsibleSection title="Instructions" defaultOpen={false}>
        <textarea
          value={study.instructionsMarkdown}
          onChange={(e) => setStudy({ instructionsMarkdown: e.target.value })}
          className="w-full px-2 py-1.5 text-sm border border-input rounded bg-background resize-none"
          rows={3}
          placeholder="Instructions for participants..."
        />
      </CollapsibleSection>
    </div>
  );
}
