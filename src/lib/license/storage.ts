import { STORAGE_KEYS, LICENSE_PATHS, CACHE_EXPIRY_MS } from './constants';
import type { LicenseKey, LicenseStorageInfo, DeviceFingerprint } from './types';

/**
 * Get the appropriate license file path for the current OS
 */
export function getLicenseFilePath(): string {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('win')) {
    return LICENSE_PATHS.windows;
  } else if (userAgent.includes('mac')) {
    return LICENSE_PATHS.macos;
  } else if (userAgent.includes('linux')) {
    return LICENSE_PATHS.linux;
  }
  
  return LICENSE_PATHS.fallback;
}

/**
 * Save license to localStorage cache
 */
export function saveLicenseToCache(claims: LicenseKey): void {
  const cacheData = {
    claims,
    cached_at: new Date().toISOString(),
    device_fingerprint: localStorage.getItem(STORAGE_KEYS.DEVICE_FINGERPRINT)
  };
  
  localStorage.setItem(STORAGE_KEYS.LICENSE_CACHE, JSON.stringify(cacheData));
}

/**
 * Get license from localStorage cache
 */
export function getLicenseFromCache(): LicenseKey | null {
  try {
    const cached = localStorage.getItem(STORAGE_KEYS.LICENSE_CACHE);
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    const cachedAt = new Date(cacheData.cached_at);
    const now = new Date();
    
    // Check if cache is expired
    if (now.getTime() - cachedAt.getTime() > CACHE_EXPIRY_MS) {
      localStorage.removeItem(STORAGE_KEYS.LICENSE_CACHE);
      return null;
    }
    
    return cacheData.claims;
  } catch {
    return null;
  }
}

/**
 * Clear license cache
 */
export function clearLicenseCache(): void {
  localStorage.removeItem(STORAGE_KEYS.LICENSE_CACHE);
}

/**
 * Save device fingerprint
 */
export function saveDeviceFingerprint(fingerprint: string): void {
  localStorage.setItem(STORAGE_KEYS.DEVICE_FINGERPRINT, fingerprint);
}

/**
 * Get device fingerprint
 */
export function getDeviceFingerprint(): string | null {
  return localStorage.getItem(STORAGE_KEYS.DEVICE_FINGERPRINT);
}

/**
 * Check if a nonce has been used (basic local check)
 */
export function isNonceUsed(nonce: string): boolean {
  try {
    const usedNonces = JSON.parse(localStorage.getItem(STORAGE_KEYS.NONCE_CACHE) || '[]');
    return usedNonces.includes(nonce);
  } catch {
    return false;
  }
}

/**
 * Mark a nonce as used
 */
export function markNonceAsUsed(nonce: string): void {
  try {
    const usedNonces = JSON.parse(localStorage.getItem(STORAGE_KEYS.NONCE_CACHE) || '[]');
    if (!usedNonces.includes(nonce)) {
      usedNonces.push(nonce);
      // Keep only last 1000 nonces to prevent storage bloat
      if (usedNonces.length > 1000) {
        usedNonces.splice(0, usedNonces.length - 1000);
      }
      localStorage.setItem(STORAGE_KEYS.NONCE_CACHE, JSON.stringify(usedNonces));
    }
  } catch (error) {
    console.warn('Failed to cache nonce:', error);
  }
}

/**
 * Get license settings
 */
export function getLicenseSettings() {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return settings ? JSON.parse(settings) : {
      enableRevocationCheck: true,
      allowOfflineMode: true,
      autoDiscoverLicense: true
    };
  } catch {
    return {
      enableRevocationCheck: true,
      allowOfflineMode: true,
      autoDiscoverLicense: true
    };
  }
}

/**
 * Save license settings
 */
export function saveLicenseSettings(settings: any): void {
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}
