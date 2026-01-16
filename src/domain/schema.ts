/**
 * Zod validation schemas for Card Sorting Platform
 * Provides runtime validation for templates, results, and all domain types
 * @module domain/schema
 */

import { z } from 'zod';

// ============================================================================
// Constants
// ============================================================================

/** Maximum length for labels (titles, category names, etc.) */
const MAX_LABEL_LENGTH = 100;
/** Maximum length for descriptions */
const MAX_DESCRIPTION_LENGTH = 500;
/** Maximum number of cards recommended for usability */
const MAX_RECOMMENDED_CARDS = 100;
/** Maximum number of categories */
const MAX_CATEGORIES = 50;

// ============================================================================
// Study Configuration Schemas
// ============================================================================

/**
 * Study settings schema with validation
 */
export const studySettingsSchema = z.object({
  randomizeCardOrder: z.boolean().describe('Shuffle card order for each participant'),
  allowCreateCategories: z.boolean().describe('Allow participants to create categories'),
  requireAllCardsSorted: z.boolean().describe('Require all cards sorted before completion'),
  enableUnsureBucket: z.boolean().describe('Show an unsure bucket for ambiguous cards'),
  unsureBucketLabel: z.string().max(MAX_LABEL_LENGTH).describe('Label for the unsure bucket'),
});

/**
 * Main study configuration schema
 */
export const studySchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(MAX_LABEL_LENGTH, `Title must be ${MAX_LABEL_LENGTH} characters or less`),
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`),
  language: z.string().regex(/^[a-z]{2}(-[A-Z]{2})?$/, 'Invalid language code').default('en'),
  sortType: z.enum(['open', 'closed', 'hybrid']),
  settings: studySettingsSchema,
  instructionsMarkdown: z.string(),
});

// ============================================================================
// Cards and Categories Schemas
// ============================================================================

/**
 * Category schema with ID format validation
 */
export const categorySchema = z.object({
  id: z.string().regex(/^cat_/, 'Category ID must start with "cat_"'),
  label: z
    .string()
    .min(1, 'Category label is required')
    .max(MAX_LABEL_LENGTH, `Label must be ${MAX_LABEL_LENGTH} characters or less`),
  description: z.string().max(MAX_DESCRIPTION_LENGTH),
  image: z.string().optional(),
});

/**
 * Card schema with ID format validation
 */
export const cardSchema = z.object({
  id: z.string().regex(/^card_/, 'Card ID must start with "card_"'),
  label: z
    .string()
    .min(1, 'Card label is required')
    .max(MAX_LABEL_LENGTH, `Label must be ${MAX_LABEL_LENGTH} characters or less`),
  description: z.string().max(MAX_DESCRIPTION_LENGTH),
  image: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

// ============================================================================
// Template Schema
// ============================================================================

/**
 * Complete study template schema for import/export
 */
export const templateSchema = z
  .object({
    schemaVersion: z.string().regex(/^\d+\.\d+\.\d+$/, 'Invalid version format (expected semver)'),
    templateId: z.string().regex(/^tmpl_/, 'Template ID must start with "tmpl_"'),
    study: studySchema,
    categories: z
      .array(categorySchema)
      .max(MAX_CATEGORIES, `Maximum ${MAX_CATEGORIES} categories allowed`),
    cards: z
      .array(cardSchema)
      .min(1, 'At least one card is required')
      .max(MAX_RECOMMENDED_CARDS, `Maximum ${MAX_RECOMMENDED_CARDS} cards allowed`),
    createdAt: z.string().datetime('Invalid ISO 8601 datetime'),
  })
  .refine(
    (data) => {
      // For closed sorts, at least one category is required
      if (data.study.sortType === 'closed' && data.categories.length === 0) {
        return false;
      }
      return true;
    },
    { message: 'Closed sort requires at least one category' }
  );

// ============================================================================
// Session and Participant Schemas
// ============================================================================

/**
 * Participant identification schema
 */
export const participantSchema = z.object({
  name: z.string().min(1, 'Participant name is required').max(100),
});

/**
 * Session metadata schema
 */
export const sessionSchema = z.object({
  startedAt: z.string().datetime('Invalid start datetime'),
  completedAt: z.string().datetime('Invalid completion datetime'),
  durationMs: z.number().nonnegative('Duration cannot be negative'),
  timezone: z.string().min(1, 'Timezone is required'),
  userAgent: z.string(),
  viewport: z.object({
    w: z.number().positive('Width must be positive'),
    h: z.number().positive('Height must be positive'),
  }),
});

// ============================================================================
// Output/Results Schemas
// ============================================================================

/**
 * Output group (cards in a category) schema
 */
export const outputGroupSchema = z.object({
  categoryId: z.string(),
  cardIdsInOrder: z.array(z.string()),
});

/**
 * Complete sorting output schema
 */
export const outputSchema = z.object({
  groups: z.array(outputGroupSchema),
  unsureCardIds: z.array(z.string()),
});

/**
 * Interaction telemetry schema
 */
export const telemetrySchema = z.object({
  movesCount: z.number().nonnegative(),
  undoCount: z.number().nonnegative(),
});

/**
 * Complete study result schema
 */
export const resultSchema = z.object({
  schemaVersion: z.string().regex(/^\d+\.\d+\.\d+$/),
  templateId: z.string().regex(/^tmpl_/),
  templateChecksumSha256: z.string().regex(/^[a-f0-9]{64}$/, 'Invalid SHA-256 checksum'),
  participant: participantSchema,
  session: sessionSchema,
  output: outputSchema,
  telemetry: telemetrySchema,
});

// ============================================================================
// Validation Helpers
// ============================================================================

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: z.ZodError;
}

/**
 * Validate a template with detailed error information
 */
export function validateTemplate(data: unknown): ValidationResult<z.infer<typeof templateSchema>> {
  const result = templateSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    error: !result.success ? result.error : undefined,
  };
}

/**
 * Validate a result with detailed error information
 */
export function validateResult(data: unknown): ValidationResult<z.infer<typeof resultSchema>> {
  const result = resultSchema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    error: !result.success ? result.error : undefined,
  };
}

// ============================================================================
// Type Exports
// ============================================================================

export type StudySettingsInput = z.infer<typeof studySettingsSchema>;
export type StudyInput = z.infer<typeof studySchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CardInput = z.infer<typeof cardSchema>;
export type TemplateInput = z.infer<typeof templateSchema>;
export type ResultInput = z.infer<typeof resultSchema>;
