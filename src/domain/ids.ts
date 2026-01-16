/**
 * ID generation utilities for Card Sorting Platform
 * Uses nanoid for cryptographically secure, URL-friendly unique IDs
 * @module domain/ids
 */

import { nanoid } from 'nanoid';

/** Length of generated ID suffix (excluding prefix) */
const ID_LENGTH = 10;

/** ID prefixes for different entity types */
export const ID_PREFIXES = {
  template: 'tmpl_',
  category: 'cat_',
  card: 'card_',
  session: 'sess_',
  result: 'res_',
} as const;

export type IdPrefix = typeof ID_PREFIXES[keyof typeof ID_PREFIXES];

/**
 * Generate a unique template ID
 * Format: tmpl_[10-char-nanoid]
 * 
 * @example
 * ```ts
 * const id = generateTemplateId();
 * // => 'tmpl_V1StGXR8_Z'
 * ```
 */
export function generateTemplateId(): string {
  return `${ID_PREFIXES.template}${nanoid(ID_LENGTH)}`;
}

/**
 * Generate a unique category ID
 * Format: cat_[10-char-nanoid]
 * 
 * @example
 * ```ts
 * const id = generateCategoryId();
 * // => 'cat_a2b3c4d5e6'
 * ```
 */
export function generateCategoryId(): string {
  return `${ID_PREFIXES.category}${nanoid(ID_LENGTH)}`;
}

/**
 * Generate a unique card ID
 * Format: card_[10-char-nanoid]
 * 
 * @example
 * ```ts
 * const id = generateCardId();
 * // => 'card_x7y8z9w0q1'
 * ```
 */
export function generateCardId(): string {
  return `${ID_PREFIXES.card}${nanoid(ID_LENGTH)}`;
}

/**
 * Generate a unique session ID
 * Format: sess_[10-char-nanoid]
 */
export function generateSessionId(): string {
  return `${ID_PREFIXES.session}${nanoid(ID_LENGTH)}`;
}

/**
 * Generate a unique result ID
 * Format: res_[10-char-nanoid]
 */
export function generateResultId(): string {
  return `${ID_PREFIXES.result}${nanoid(ID_LENGTH)}`;
}

/**
 * Check if a string is a valid ID with the expected prefix
 * 
 * @example
 * ```ts
 * isValidId('cat_abc123', 'cat_'); // true
 * isValidId('card_xyz', 'cat_');   // false
 * ```
 */
export function isValidId(id: string, expectedPrefix: IdPrefix): boolean {
  if (!id || typeof id !== 'string') return false;
  if (!id.startsWith(expectedPrefix)) return false;
  
  const suffix = id.slice(expectedPrefix.length);
  // nanoid uses A-Za-z0-9_- characters
  return suffix.length === ID_LENGTH && /^[A-Za-z0-9_-]+$/.test(suffix);
}

/**
 * Extract the prefix from an ID
 * 
 * @example
 * ```ts
 * getIdPrefix('cat_abc123'); // 'cat_'
 * getIdPrefix('unknown');    // undefined
 * ```
 */
export function getIdPrefix(id: string): IdPrefix | undefined {
  for (const prefix of Object.values(ID_PREFIXES)) {
    if (id.startsWith(prefix)) {
      return prefix;
    }
  }
  return undefined;
}

/**
 * Get the entity type from an ID
 * 
 * @example
 * ```ts
 * getIdType('cat_abc123');  // 'category'
 * getIdType('card_xyz789'); // 'card'
 * ```
 */
export function getIdType(id: string): keyof typeof ID_PREFIXES | undefined {
  for (const [type, prefix] of Object.entries(ID_PREFIXES)) {
    if (id.startsWith(prefix)) {
      return type as keyof typeof ID_PREFIXES;
    }
  }
  return undefined;
}
