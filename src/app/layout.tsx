import { Outlet, Link } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { useI18n } from '@/contexts/i18n-context';

export function Layout() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-foreground hover:text-primary">
            Card Sorting UX
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/builder"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('navigation.builder')}
            </Link>
            <Link
              to="/run"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('navigation.run')}
            </Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>{t('common.dataStaysOnDevice')}</p>
        </div>
      </footer>
    </div>
  );
}
