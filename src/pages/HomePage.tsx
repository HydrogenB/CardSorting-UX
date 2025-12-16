import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="max-w-2xl mx-auto text-center py-16">
      <h1 className="text-4xl font-bold text-foreground mb-4">
        Card Sorting Platform
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        A lightweight, frontend-only tool for running card sorting studies to validate 
        or discover information architecture groupings.
      </p>
      
      <div className="grid gap-4 sm:grid-cols-2 max-w-md mx-auto">
        <Link
          to="/builder"
          className="flex flex-col items-center p-6 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
        >
          <div className="text-3xl mb-3">🛠️</div>
          <h2 className="text-lg font-semibold text-card-foreground">Create Template</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Build your study with categories and cards
          </p>
        </Link>
        
        <Link
          to="/run"
          className="flex flex-col items-center p-6 rounded-lg border border-border bg-card hover:bg-accent transition-colors"
        >
          <div className="text-3xl mb-3">▶️</div>
          <h2 className="text-lg font-semibold text-card-foreground">Run Study</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a template and start sorting
          </p>
        </Link>
      </div>
      
      <div className="mt-12 p-4 rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">
          <strong>Privacy first:</strong> All data stays on your device. 
          No server calls, no analytics, no tracking.
        </p>
      </div>
      
      <div className="mt-8 text-sm text-muted-foreground">
        <h3 className="font-semibold mb-2">Supported Study Types</h3>
        <ul className="space-y-1">
          <li><strong>Open Sort:</strong> Participants create their own categories</li>
          <li><strong>Closed Sort:</strong> Participants sort into predefined categories</li>
          <li><strong>Hybrid Sort:</strong> Base categories provided, participants can add more</li>
        </ul>
      </div>
    </div>
  );
}
