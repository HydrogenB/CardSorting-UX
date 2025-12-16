// Core domain types for Card Sorting Platform

export interface StudySettings {
  randomizeCardOrder: boolean;
  allowCreateCategories: boolean;
  requireAllCardsSorted: boolean;
  enableUnsureBucket: boolean;
  unsureBucketLabel: string;
}

export interface Study {
  title: string;
  description: string;
  language: string;
  sortType: 'open' | 'closed' | 'hybrid';
  settings: StudySettings;
  instructionsMarkdown: string;
}

export interface Category {
  id: string;
  label: string;
  description: string;
  image?: string; // base64 encoded image
}

export interface Card {
  id: string;
  label: string;
  description: string;
  image?: string; // base64 encoded image
  meta: Record<string, unknown>;
}

export interface StudyTemplate {
  schemaVersion: string;
  templateId: string;
  study: Study;
  categories: Category[];
  cards: Card[];
  createdAt: string;
}

export interface Participant {
  name: string;
}

export interface Session {
  startedAt: string;
  completedAt: string;
  durationMs: number;
  timezone: string;
  userAgent: string;
  viewport: { w: number; h: number };
}

export interface OutputGroup {
  categoryId: string;
  cardIdsInOrder: string[];
}

export interface Output {
  groups: OutputGroup[];
  unsureCardIds: string[];
}

export interface Telemetry {
  movesCount: number;
  undoCount: number;
}

export interface StudyResult {
  schemaVersion: string;
  templateId: string;
  templateChecksumSha256: string;
  participant: Participant;
  session: Session;
  output: Output;
  telemetry: Telemetry;
}
