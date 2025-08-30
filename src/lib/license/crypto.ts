import { jwtVerify, importSPKI } from 'jose';
import CryptoJS from 'crypto-js';
import { PUBLIC_KEY_PEM } from './constants';
import type { LicenseKey } from './types';

/**
 * Verify a JWT license token using the embedded public key
 */
export async function verifyJWT(token: string): Promise<LicenseKey | null> {
  try {
    // Import the public key
    const publicKey = await importSPKI(PUBLIC_KEY_PEM, 'ES256');
    
    // Verify the JWT
    const { payload } = await jwtVerify(token, publicKey, {
      algorithms: ['ES256', 'RS256']
    });
    
    // Validate payload structure
    if (!payload || typeof payload !== 'object') {
      return null;
    }
    
    const claims = payload as unknown as LicenseKey;
    
    // Validate required fields
    if (!claims.user_id || !claims.issued_at || !claims.features || !claims.nonce) {
      return null;
    }
    
    return claims;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
}

/**
 * Generate a device fingerprint for fraud detection
 */
export function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform
  ];
  
  const fingerprint = components.join('|');
  return CryptoJS.SHA256(fingerprint).toString();
}

/**
 * Validate license expiry
 */
export function isLicenseExpired(expiryIso?: string | null): boolean {
  if (!expiryIso) return false;
  return new Date(expiryIso) <= new Date();
}

/**
 * Generate a secure nonce for uniqueness validation
 */
export function generateNonce(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}

/**
 * Canonicalize JSON for consistent signing
 */
export function canonicalizeJSON(obj: any): string {
  if (obj === null || typeof obj !== 'object') {
    return JSON.stringify(obj);
  }
  
  if (Array.isArray(obj)) {
    return '[' + obj.map(canonicalizeJSON).join(',') + ']';
  }
  
  const keys = Object.keys(obj).sort();
  const pairs = keys.map(key => 
    JSON.stringify(key) + ':' + canonicalizeJSON(obj[key])
  );
  
  return '{' + pairs.join(',') + '}';
}