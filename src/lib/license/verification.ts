import { verifyJWT, isLicenseExpired, generateDeviceFingerprint } from './crypto';
import { 
  saveLicenseToCache, 
  getLicenseFromCache, 
  isNonceUsed, 
  markNonceAsUsed,
  saveDeviceFingerprint,
  getDeviceFingerprint,
  getLicenseSettings
} from './storage';
import { REVOCATION_ENDPOINT } from './constants';
import type { LicenseKey, LicenseVerificationResult } from './types';

/**
 * Check if a license is revoked (optional, non-blocking)
 */
async function checkRevocation(nonce: string): Promise<boolean> {
  const settings = getLicenseSettings();
  
  if (!settings.enableRevocationCheck) {
    return false;
  }
  
  try {
    const response = await fetch(`${REVOCATION_ENDPOINT}?nonce=${nonce}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.revoked === true;
    }
  } catch (error) {
    console.warn('Revocation check failed (non-blocking):', error);
    // If revocation check fails, show warning but don't block
    if (settings.allowOfflineMode) {
      console.info('Continuing in offline mode...');
      return false;
    }
  }
  
  return false;
}

/**
 * Verify required features are present in license
 */
function hasRequiredFeatures(claims: LicenseKey, requiredFeatures: string[]): boolean {
  if (claims.is_owner) return true; // Owner has all features
  
  return requiredFeatures.every(feature => 
    claims.features.includes(feature)
  );
}

/**
 * Main license verification function
 */
export async function verifyLicense(
  licenseInput: string, 
  requiredFeatures: string[] = []
): Promise<LicenseVerificationResult> {
  try {
    let claims: LicenseKey | null = null;
    
    // Try to parse as JWT first
    if (licenseInput.includes('.')) {
      claims = await verifyJWT(licenseInput);
    } else {
      // Try to parse as JSON
      try {
        const parsed = JSON.parse(licenseInput);
        if (parsed.token) {
          claims = await verifyJWT(parsed.token);
        } else if (parsed.user_id && parsed.nonce) {
          // Direct license object
          claims = parsed;
        }
      } catch {
        return { ok: false, reason: 'Invalid license format' };
      }
    }
    
    if (!claims) {
      return { ok: false, reason: 'Invalid license signature' };
    }
    
    // Check expiry
    if (isLicenseExpired(claims.expiry_iso)) {
      return { 
        ok: false, 
        reason: 'License has expired', 
        claims,
        isExpired: true 
      };
    }
    
    // Check nonce uniqueness (basic local check)
    if (isNonceUsed(claims.nonce)) {
      return { 
        ok: false, 
        reason: 'License nonce already used', 
        claims 
      };
    }
    
    // Check required features
    if (!hasRequiredFeatures(claims, requiredFeatures)) {
      return { 
        ok: false, 
        reason: `Missing required features: ${requiredFeatures.join(', ')}`, 
        claims 
      };
    }
    
    // Check revocation (non-blocking)
    const isRevoked = await checkRevocation(claims.nonce);
    if (isRevoked) {
      return { 
        ok: false, 
        reason: 'License has been revoked', 
        claims,
        isRevoked: true 
      };
    }
    
    // Generate and store device fingerprint
    const deviceFp = generateDeviceFingerprint();
    saveDeviceFingerprint(deviceFp);
    
    // Mark nonce as used and cache the license
    markNonceAsUsed(claims.nonce);
    saveLicenseToCache(claims);
    
    return { ok: true, claims };
    
  } catch (error) {
    console.error('License verification error:', error);
    return { 
      ok: false, 
      reason: `Verification failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}

/**
 * Quick license validation (uses cache for performance)
 */
export function quickVerifyLicense(requiredFeatures: string[] = []): LicenseVerificationResult {
  const cached = getLicenseFromCache();
  
  if (!cached) {
    return { ok: false, reason: 'No valid license found' };
  }
  
  // Check expiry
  if (isLicenseExpired(cached.expiry_iso)) {
    return { 
      ok: false, 
      reason: 'License has expired', 
      claims: cached,
      isExpired: true 
    };
  }
  
  // Check required features
  if (!hasRequiredFeatures(cached, requiredFeatures)) {
    return { 
      ok: false, 
      reason: `Missing required features: ${requiredFeatures.join(', ')}`, 
      claims: cached 
    };
  }
  
  return { ok: true, claims: cached };
}

/**
 * Check if user has owner privileges
 */
export function isOwner(): boolean {
  const cached = getLicenseFromCache();
  return cached?.is_owner === true;
}

/**
 * Get current license claims
 */
export function getCurrentLicense(): LicenseKey | null {
  return getLicenseFromCache();
}