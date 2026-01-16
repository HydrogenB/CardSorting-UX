/**
 * Checksum utilities for template integrity verification
 * Uses Web Crypto API for SHA-256 hashing
 * @module domain/checksum
 */

/**
 * Generate SHA-256 checksum for template verification
 * Uses the Web Crypto API for secure hashing
 * 
 * @param data - Object to hash (will be JSON stringified)
 * @returns Promise resolving to lowercase hex string (64 characters)
 * 
 * @example
 * ```ts
 * const checksum = await generateChecksum({ foo: 'bar' });
 * // => 'a1b2c3d4...' (64 hex characters)
 * ```
 */
export async function generateChecksum(data: object): Promise<string> {
  // Deterministic JSON stringification (no whitespace for consistency)
  const jsonString = JSON.stringify(data, Object.keys(data).sort(), 0);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);

  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Verify a template's checksum matches expected value
 * 
 * @param data - Object to verify
 * @param expectedChecksum - Expected SHA-256 checksum (64 hex characters)
 * @returns Promise resolving to true if checksums match
 * 
 * @example
 * ```ts
 * const isValid = await verifyChecksum(template, storedChecksum);
 * if (!isValid) {
 *   console.error('Template has been modified!');
 * }
 * ```
 */
export async function verifyChecksum(
  data: object,
  expectedChecksum: string
): Promise<boolean> {
  const actualChecksum = await generateChecksum(data);
  // Use constant-time comparison to prevent timing attacks
  return constantTimeEquals(actualChecksum, expectedChecksum);
}

/**
 * Constant-time string comparison to prevent timing attacks
 * @internal
 */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Validate that a string is a valid SHA-256 checksum format
 * 
 * @param checksum - String to validate
 * @returns true if the string is exactly 64 lowercase hex characters
 */
export function isValidChecksum(checksum: string): boolean {
  return /^[a-f0-9]{64}$/.test(checksum);
}
