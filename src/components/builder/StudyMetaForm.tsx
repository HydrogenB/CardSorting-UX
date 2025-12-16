import { useBuilderStore } from '@/store/builderStore';

export function StudyMetaForm() {
  const { study, setStudy } = useBuilderStore();

  return (
    <section className="p-6 border border-border rounded-lg bg-card">
      <h2 className="text-lg font-semibold mb-4">Study Metadata</h2>
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={study.title}
            onChange={(e) => setStudy({ title: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="e.g., TrueApp Menu Card Sort"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={study.description}
            onChange={(e) => setStudy({ description: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={2}
            placeholder="Brief description of what you're testing"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Sort Type</label>
            <select
              value={study.sortType}
              onChange={(e) => setStudy({ sortType: e.target.value as 'open' | 'closed' | 'hybrid' })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="closed">Closed (predefined categories)</option>
              <option value="open">Open (participants create categories)</option>
              <option value="hybrid">Hybrid (both)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select
              value={study.language}
              onChange={(e) => setStudy({ language: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="en">English</option>
              <option value="th">Thai</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Instructions for Participants</label>
          <textarea
            value={study.instructionsMarkdown}
            onChange={(e) => setStudy({ instructionsMarkdown: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            rows={2}
            placeholder="Instructions shown to participants before sorting"
          />
        </div>
      </div>
    </section>
  );
}
