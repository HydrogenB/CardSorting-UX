import { Outlet, Link } from 'react-router-dom';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-foreground hover:text-primary">
            Card Sorting UX
          </Link>
          <nav className="flex gap-4">
            <Link
              to="/builder"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Builder
            </Link>
            <Link
              to="/run"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Run Study
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>All data stays on your device. No server, no tracking.</p>
        </div>
      </footer>
    </div>
  );
}
