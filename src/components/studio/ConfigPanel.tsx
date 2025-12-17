import { useState, useRef } from 'react';
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
import { useToast } from '@/components/ui/toast';
import { useI18n } from '@/contexts/i18n-context';
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
    restoreCategory,
    reorderCategories,
    addCard,
    updateCard,
    removeCard,
    restoreCard,
    reorderCards,
  } = useBuilderStore();
  
  const { addToast } = useToast();
  const { t } = useI18n();
  
  // Track previous values for undo on field updates
  const prevStudyRef = useRef({ title: study.title, description: study.description });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const [newCategoryLabel, setNewCategoryLabel] = useState('');
  const [newCardLabel, setNewCardLabel] = useState('');

  const handleAddCategory = () => {
    if (newCategoryLabel.trim()) {
      const label = newCategoryLabel.trim();
      const id = addCategory(label);
      setNewCategoryLabel('');
      
      addToast({
        type: 'action',
        title: t('studioPage.configPanel.addedCategory', { name: label }),
        duration: 5000,
        action: {
          label: t('common.undo'),
          onClick: () => removeCategory(id),
        },
      });
    }
  };

  const handleAddCard = () => {
    if (newCardLabel.trim()) {
      const label = newCardLabel.trim();
      const id = addCard(label);
      setNewCardLabel('');
      
      addToast({
        type: 'action',
        title: t('studioPage.configPanel.addedCard', { name: label }),
        duration: 5000,
        action: {
          label: t('common.undo'),
          onClick: () => removeCard(id),
        },
      });
    }
  };
  
  const handleRemoveCategory = (id: string, index: number) => {
    const removed = removeCategory(id);
    if (removed) {
      addToast({
        type: 'action',
        title: t('studioPage.configPanel.removedCategory', { name: removed.label }),
        duration: 5000,
        action: {
          label: t('common.undo'),
          onClick: () => restoreCategory(removed, index),
        },
      });
    }
  };
  
  const handleRemoveCard = (id: string, index: number) => {
    const removed = removeCard(id);
    if (removed) {
      addToast({
        type: 'action',
        title: t('studioPage.configPanel.removedCard', { name: removed.label }),
        duration: 5000,
        action: {
          label: t('common.undo'),
          onClick: () => restoreCard(removed, index),
        },
      });
    }
  };
  
  const handleTitleBlur = () => {
    if (prevStudyRef.current.title !== study.title && study.title.trim()) {
      const oldTitle = prevStudyRef.current.title;
      prevStudyRef.current.title = study.title;
      
      addToast({
        type: 'action',
        title: t('studioPage.configPanel.updatedTitle'),
        duration: 5000,
        action: {
          label: t('common.undo'),
          onClick: () => setStudy({ title: oldTitle }),
        },
      });
    }
  };
  
  const handleDescriptionBlur = () => {
    if (prevStudyRef.current.description !== study.description) {
      const oldDesc = prevStudyRef.current.description;
      prevStudyRef.current.description = study.description;
      
      addToast({
        type: 'action',
        title: t('studioPage.configPanel.updatedDescription'),
        duration: 5000,
        action: {
          label: t('common.undo'),
          onClick: () => setStudy({ description: oldDesc }),
        },
      });
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
      <CollapsibleSection title={t('studioPage.configPanel.studyInfo')}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground tracking-wide">{t('studioPage.configPanel.title')}</label>
            <input
              type="text"
              value={study.title}
              onChange={(e) => setStudy({ title: e.target.value })}
              onBlur={handleTitleBlur}
              className="w-full px-3 py-2 text-sm font-medium border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              placeholder={t('studioPage.configPanel.titlePlaceholder')}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground tracking-wide">{t('studioPage.configPanel.description')}</label>
            <textarea
              value={study.description}
              onChange={(e) => setStudy({ description: e.target.value })}
              onBlur={handleDescriptionBlur}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              rows={2}
              placeholder={t('studioPage.configPanel.descriptionPlaceholder')}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5 text-muted-foreground tracking-wide">{t('studioPage.configPanel.sortType')}</label>
            <select
              value={study.sortType}
              onChange={(e) => setStudy({ sortType: e.target.value as 'open' | 'closed' | 'hybrid' })}
              className="w-full px-3 py-2 text-sm font-medium border border-input rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="closed">{t('studioPage.configPanel.sortTypeClosed')}</option>
              <option value="open">{t('studioPage.configPanel.sortTypeOpen')}</option>
              <option value="hybrid">{t('studioPage.configPanel.sortTypeHybrid')}</option>
            </select>
          </div>
        </div>
      </CollapsibleSection>

      {/* Settings */}
      <CollapsibleSection title={t('studioPage.configPanel.settings')} defaultOpen={false}>
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={study.settings.randomizeCardOrder}
              onChange={(e) => setStudy({ 
                settings: { ...study.settings, randomizeCardOrder: e.target.checked } 
              })}
              className="rounded border-input"
            />
            {t('studioPage.configPanel.randomizeCardOrder')}
          </label>
          <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={study.settings.requireAllCardsSorted}
              onChange={(e) => setStudy({ 
                settings: { ...study.settings, requireAllCardsSorted: e.target.checked } 
              })}
              className="rounded border-input"
            />
            {t('studioPage.configPanel.requireAllSorted')}
          </label>
          <label className="flex items-center gap-2.5 text-sm font-medium cursor-pointer hover:text-foreground transition-colors">
            <input
              type="checkbox"
              checked={study.settings.enableUnsureBucket}
              onChange={(e) => setStudy({ 
                settings: { ...study.settings, enableUnsureBucket: e.target.checked } 
              })}
              className="rounded border-input"
            />
            {t('studioPage.configPanel.enableUnsureBucket')}
          </label>
        </div>
      </CollapsibleSection>

      {/* Categories */}
      <CollapsibleSection title={t('studioPage.configPanel.categories')} count={categories.length}>
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
                  onImageChange={(value) => {
                    const oldImage = cat.image;
                    updateCategory(cat.id, { image: value });
                    addToast({
                      type: 'action',
                      title: value ? t('studioPage.configPanel.addedImage') : t('studioPage.configPanel.removedImage'),
                      duration: 5000,
                      action: {
                        label: t('common.undo'),
                        onClick: () => updateCategory(cat.id, { image: oldImage }),
                      },
                    });
                  }}
                  onRemove={() => handleRemoveCategory(cat.id, categories.findIndex(c => c.id === cat.id))}
                  placeholder={{ label: t('studioPage.configPanel.categoryPlaceholder'), description: t('common.optional') }}
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
            className="flex-1 px-3 py-2 text-sm font-medium border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder={t('studioPage.configPanel.addCategory')}
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
      <CollapsibleSection title={t('studioPage.configPanel.cards')} count={cards.length}>
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
                  onImageChange={(value) => {
                    const oldImage = card.image;
                    updateCard(card.id, { image: value });
                    addToast({
                      type: 'action',
                      title: value ? t('studioPage.configPanel.addedImage') : t('studioPage.configPanel.removedImage'),
                      duration: 5000,
                      action: {
                        label: t('common.undo'),
                        onClick: () => updateCard(card.id, { image: oldImage }),
                      },
                    });
                  }}
                  onRemove={() => handleRemoveCard(card.id, cards.findIndex(c => c.id === card.id))}
                  placeholder={{ label: t('studioPage.configPanel.cardPlaceholder'), description: t('common.optional') }}
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
            className="flex-1 px-3 py-2 text-sm font-medium border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            placeholder={t('studioPage.configPanel.addCard')}
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
          <p className="text-xs text-amber-700 font-medium mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
            ⚠️ {t('studioPage.configPanel.tooManyCards', { count: cards.length })}
          </p>
        )}
      </CollapsibleSection>

      {/* Instructions */}
      <CollapsibleSection title={t('studioPage.configPanel.instructions')} defaultOpen={false}>
        <textarea
          value={study.instructionsMarkdown}
          onChange={(e) => setStudy({ instructionsMarkdown: e.target.value })}
          className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background resize-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          rows={3}
          placeholder={t('studioPage.configPanel.instructionsPlaceholder')}
        />
      </CollapsibleSection>
    </div>
  );
}
