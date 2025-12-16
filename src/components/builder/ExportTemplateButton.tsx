import { useState } from 'react';
import { useBuilderStore } from '@/store/builderStore';
import { downloadJson } from '@/lib/download';
import { validateTemplate } from '@/domain/schema';
import { Download, AlertCircle, CheckCircle } from 'lucide-react';

export function ExportTemplateButton() {
  const { study, categories, cards, exportTemplate } = useBuilderStore();
  const [errors, setErrors] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateBeforeExport = (): string[] => {
    const validationErrors: string[] = [];

    if (!study.title.trim()) {
      validationErrors.push('Study title is required');
    }

    if (study.sortType === 'closed' && categories.length === 0) {
      validationErrors.push('At least one category is required for closed sort');
    }

    if (cards.length === 0) {
      validationErrors.push('At least one card is required');
    }

    const categoryLabels = categories.map((c) => c.label.toLowerCase());
    const duplicateCategories = categoryLabels.filter(
      (label, index) => categoryLabels.indexOf(label) !== index
    );
    if (duplicateCategories.length > 0) {
      validationErrors.push(`Duplicate category labels: ${[...new Set(duplicateCategories)].join(', ')}`);
    }

    const cardLabels = cards.map((c) => c.label.toLowerCase());
    const duplicateCards = cardLabels.filter(
      (label, index) => cardLabels.indexOf(label) !== index
    );
    if (duplicateCards.length > 0) {
      validationErrors.push(`Duplicate card labels: ${[...new Set(duplicateCards)].join(', ')}`);
    }

    return validationErrors;
  };

  const handleExport = () => {
    setErrors([]);
    setShowSuccess(false);

    const validationErrors = validateBeforeExport();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const template = exportTemplate();
    const schemaValidation = validateTemplate(template);

    if (!schemaValidation.success) {
      setErrors(schemaValidation.error.issues.map((issue) => issue.message));
      return;
    }

    const filename = `template_${study.title.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'untitled'}.json`;
    downloadJson(template, filename);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleExport}
        className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2 font-medium"
      >
        <Download className="w-5 h-5" />
        Export Template
      </button>

      {errors.length > 0 && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-destructive mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">Please fix the following:</p>
              <ul className="text-sm text-destructive/90 mt-1 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-800">Template exported successfully!</p>
        </div>
      )}
    </div>
  );
}
