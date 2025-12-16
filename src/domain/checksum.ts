/**
 * Generate SHA-256 checksum for template verification
 */
export async function generateChecksum(data: object): Promise<string> {
  const jsonString = JSON.stringify(data, null, 0);
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(jsonString);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

/**
 * Verify a template's checksum
 */
export async function verifyChecksum(data: object, expectedChecksum: string): Promise<boolean> {
  const actualChecksum = await generateChecksum(data);
  return actualChecksum === expectedChecksum;
}
