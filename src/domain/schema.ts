import { z } from 'zod';

// Study Settings Schema
export const studySettingsSchema = z.object({
  randomizeCardOrder: z.boolean(),
  allowCreateCategories: z.boolean(),
  requireAllCardsSorted: z.boolean(),
  enableUnsureBucket: z.boolean(),
  unsureBucketLabel: z.string(),
});

// Study Schema
export const studySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  language: z.string().default('en'),
  sortType: z.enum(['open', 'closed', 'hybrid']),
  settings: studySettingsSchema,
  instructionsMarkdown: z.string(),
});

// Category Schema
export const categorySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1, 'Category label is required'),
  description: z.string(),
  image: z.string().optional(),
});

// Card Schema
export const cardSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1, 'Card label is required'),
  description: z.string(),
  image: z.string().optional(),
  meta: z.record(z.string(), z.unknown()).default({}),
});

// Template Schema
export const templateSchema = z.object({
  schemaVersion: z.string(),
  templateId: z.string(),
  study: studySchema,
  categories: z.array(categorySchema),
  cards: z.array(cardSchema).min(1, 'At least one card is required'),
  createdAt: z.string(),
});

// Participant Schema
export const participantSchema = z.object({
  name: z.string().min(1, 'Participant name is required'),
});

// Session Schema
export const sessionSchema = z.object({
  startedAt: z.string(),
  completedAt: z.string(),
  durationMs: z.number(),
  timezone: z.string(),
  userAgent: z.string(),
  viewport: z.object({ w: z.number(), h: z.number() }),
});

// Output Group Schema
export const outputGroupSchema = z.object({
  categoryId: z.string(),
  cardIdsInOrder: z.array(z.string()),
});

// Output Schema
export const outputSchema = z.object({
  groups: z.array(outputGroupSchema),
  unsureCardIds: z.array(z.string()),
});

// Telemetry Schema
export const telemetrySchema = z.object({
  movesCount: z.number(),
  undoCount: z.number(),
});

// Result Schema
export const resultSchema = z.object({
  schemaVersion: z.string(),
  templateId: z.string(),
  templateChecksumSha256: z.string(),
  participant: participantSchema,
  session: sessionSchema,
  output: outputSchema,
  telemetry: telemetrySchema,
});

// Validation helpers
export function validateTemplate(data: unknown) {
  return templateSchema.safeParse(data);
}

export function validateResult(data: unknown) {
  return resultSchema.safeParse(data);
}

// Type exports inferred from schemas
export type StudySettingsInput = z.infer<typeof studySettingsSchema>;
export type StudyInput = z.infer<typeof studySchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type CardInput = z.infer<typeof cardSchema>;
export type TemplateInput = z.infer<typeof templateSchema>;
export type ResultInput = z.infer<typeof resultSchema>;
