/**
 * Core domain types for Card Sorting Platform
 * @module domain/model
 */

// ============================================================================
// Study Configuration
// ============================================================================

/**
 * Settings that control how the card sorting study behaves
 */
export interface StudySettings {
  /** Whether to shuffle card order for each participant */
  randomizeCardOrder: boolean;
  /** Allow participants to create their own categories (open sort) */
  allowCreateCategories: boolean;
  /** Require all cards to be sorted before completion */
  requireAllCardsSorted: boolean;
  /** Show an "Unsure" bucket for ambiguous cards */
  enableUnsureBucket: boolean;
  /** Custom label for the unsure bucket */
  unsureBucketLabel: string;
}

/**
 * Main study configuration containing metadata and settings
 * 
 * @example
 * ```ts
 * const study: Study = {
 *   title: 'Navigation Card Sort',
 *   description: 'Help us organize our main navigation',
 *   language: 'en',
 *   sortType: 'closed',
 *   settings: { ... },
 *   instructionsMarkdown: '...',
 * };
 * ```
 */
export interface Study {
  /** Display title of the study */
  title: string;
  /** Brief description shown to participants */
  description: string;
  /** ISO 639-1 language code (e.g., 'en', 'th') */
  language: string;
  /** Type of card sort: open (create categories), closed (predefined), or hybrid */
  sortType: 'open' | 'closed' | 'hybrid';
  /** Study behavior settings */
  settings: StudySettings;
  /** Instructions shown to participants (supports Markdown) */
  instructionsMarkdown: string;
}

// ============================================================================
// Cards and Categories
// ============================================================================

/**
 * A category that cards can be sorted into
 * 
 * @example
 * ```ts
 * const category: Category = {
 *   id: 'cat_abc123',
 *   label: 'Account Settings',
 *   description: 'User profile and preferences',
 * };
 * ```
 */
export interface Category {
  /** Unique identifier (prefixed with 'cat_') */
  id: string;
  /** Display label shown to participants */
  label: string;
  /** Optional description for context */
  description: string;
  /** Optional base64 encoded image */
  image?: string;
}

/**
 * A card that participants will sort into categories
 * 
 * @example
 * ```ts
 * const card: Card = {
 *   id: 'card_xyz789',
 *   label: 'Change Password',
 *   description: 'Update your account password',
 *   meta: {},
 * };
 * ```
 */
export interface Card {
  /** Unique identifier (prefixed with 'card_') */
  id: string;
  /** Display label shown to participants */
  label: string;
  /** Optional description for additional context */
  description: string;
  /** Optional base64 encoded image */
  image?: string;
  /** Extensible metadata for custom fields */
  meta: Record<string, unknown>;
}

// ============================================================================
// Study Template (Import/Export)
// ============================================================================

/**
 * Complete study template for import/export
 * Contains all configuration needed to run a study
 */
export interface StudyTemplate {
  /** Schema version for backwards compatibility */
  schemaVersion: string;
  /** Unique identifier for this template */
  templateId: string;
  /** Study configuration */
  study: Study;
  /** Predefined categories */
  categories: Category[];
  /** Cards to be sorted */
  cards: Card[];
  /** ISO 8601 timestamp of template creation */
  createdAt: string;
}

// ============================================================================
// Participant Session
// ============================================================================

/**
 * Information about the participant (anonymous or named)
 */
export interface Participant {
  /** Participant's name or identifier */
  name: string;
}

/**
 * Session metadata captured during the sort
 */
export interface Session {
  /** ISO 8601 timestamp when sort started */
  startedAt: string;
  /** ISO 8601 timestamp when sort completed */
  completedAt: string;
  /** Total duration in milliseconds */
  durationMs: number;
  /** IANA timezone identifier */
  timezone: string;
  /** Browser user agent string */
  userAgent: string;
  /** Viewport dimensions at completion */
  viewport: { w: number; h: number };
}

// ============================================================================
// Study Output/Results
// ============================================================================

/**
 * A group of cards sorted into a single category
 */
export interface OutputGroup {
  /** Category ID the cards were sorted into */
  categoryId: string;
  /** Ordered list of card IDs in this category */
  cardIdsInOrder: string[];
}

/**
 * Complete sorting output from a participant
 */
export interface Output {
  /** Cards grouped by category */
  groups: OutputGroup[];
  /** Cards placed in the "unsure" bucket */
  unsureCardIds: string[];
}

/**
 * Interaction telemetry for analysis
 */
export interface Telemetry {
  /** Total number of card moves */
  movesCount: number;
  /** Number of undo actions used */
  undoCount: number;
}

/**
 * Complete result from a single participant's card sort session
 * 
 * @example
 * ```ts
 * const result: StudyResult = {
 *   schemaVersion: '1.0.0',
 *   templateId: 'tpl_abc123',
 *   templateChecksumSha256: '...',
 *   participant: { name: 'User 1' },
 *   session: { ... },
 *   output: { groups: [...], unsureCardIds: [] },
 *   telemetry: { movesCount: 42, undoCount: 3 },
 * };
 * ```
 */
export interface StudyResult {
  /** Schema version for backwards compatibility */
  schemaVersion: string;
  /** Template ID this result belongs to */
  templateId: string;
  /** SHA-256 checksum of template for integrity verification */
  templateChecksumSha256: string;
  /** Participant information */
  participant: Participant;
  /** Session metadata */
  session: Session;
  /** Sorting output */
  output: Output;
  /** Interaction telemetry */
  telemetry: Telemetry;
}
