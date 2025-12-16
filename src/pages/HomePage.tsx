import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/i18n-context';

export default function HomePage() {
  const { t } = useI18n();

  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h1 className="text-4xl font-bold text-foreground mb-4">
        {t('homePage.title')}
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        {t('homePage.description')}
      </p>
      
      <div className="grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
        <Link
          to="/builder"
          className="flex flex-col items-center p-6 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
        >
          <div className="text-3xl mb-3">🛠️</div>
          <h2 className="text-lg font-semibold text-card-foreground">
            {t('homePage.features.builder.title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('homePage.features.builder.description')}
          </p>
        </Link>
        
        <Link
          to="/run"
          className="flex flex-col items-center p-6 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
        >
          <div className="text-3xl mb-3">▶️</div>
          <h2 className="text-lg font-semibold text-card-foreground">
            {t('homePage.features.runner.title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t('homePage.features.runner.description')}
          </p>
        </Link>
      </div>
      
      <div className="mt-12 p-4 rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">
          <strong>{t('homePage.privacyFirst')}:</strong> {t('common.dataStaysOnDevice')}
        </p>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        <h3 className="font-semibold mb-2">{t('homePage.supportedTypes')}</h3>
        <ul className="space-y-1">
          <li><strong>{t('homePage.studyTypes.open')}:</strong> {t('homePage.studyTypes.openDesc')}</li>
          <li><strong>{t('homePage.studyTypes.closed')}:</strong> {t('homePage.studyTypes.closedDesc')}</li>
          <li><strong>{t('homePage.studyTypes.hybrid')}:</strong> {t('homePage.studyTypes.hybridDesc')}</li>
        </ul>
      </div>
    </div>
  );
}
