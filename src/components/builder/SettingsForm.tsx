import { useBuilderStore } from '@/store/builderStore';

export function SettingsForm() {
  const { study, setStudy } = useBuilderStore();
  const { settings } = study;

  const updateSetting = <K extends keyof typeof settings>(
    key: K,
    value: (typeof settings)[K]
  ) => {
    setStudy({ settings: { ...settings, [key]: value } });
  };

  return (
    <section className="p-6 border border-border rounded-lg bg-card">
      <h2 className="text-lg font-semibold mb-4">Study Settings</h2>
      <div className="space-y-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.randomizeCardOrder}
            onChange={(e) => updateSetting('randomizeCardOrder', e.target.checked)}
            className="mt-0.5 rounded border-input"
          />
          <div>
            <span className="text-sm font-medium">Randomize card order</span>
            <p className="text-xs text-muted-foreground">
              Reduces ordering effects by shuffling cards for each participant
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.requireAllCardsSorted}
            onChange={(e) => updateSetting('requireAllCardsSorted', e.target.checked)}
            className="mt-0.5 rounded border-input"
          />
          <div>
            <span className="text-sm font-medium">Require all cards sorted</span>
            <p className="text-xs text-muted-foreground">
              Participants must sort all cards before exporting results
            </p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enableUnsureBucket}
            onChange={(e) => updateSetting('enableUnsureBucket', e.target.checked)}
            className="mt-0.5 rounded border-input"
          />
          <div>
            <span className="text-sm font-medium">Enable "Unsure" bucket</span>
            <p className="text-xs text-muted-foreground">
              Provides a place for items participants can't categorize
            </p>
          </div>
        </label>

        {settings.enableUnsureBucket && (
          <div className="ml-6">
            <label className="block text-sm font-medium mb-1">Unsure bucket label</label>
            <input
              type="text"
              value={settings.unsureBucketLabel}
              onChange={(e) => updateSetting('unsureBucketLabel', e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Unsure / Doesn't fit"
            />
          </div>
        )}

        {(study.sortType === 'open' || study.sortType === 'hybrid') && (
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowCreateCategories}
              onChange={(e) => updateSetting('allowCreateCategories', e.target.checked)}
              className="mt-0.5 rounded border-input"
            />
            <div>
              <span className="text-sm font-medium">Allow creating categories</span>
              <p className="text-xs text-muted-foreground">
                Participants can add their own categories during sorting
              </p>
            </div>
          </label>
        )}
      </div>
    </section>
  );
}
