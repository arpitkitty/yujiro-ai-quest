export interface LicenseKey {
  user_id: string;
  issued_at: string;
  features: string[];
  expiry_iso?: string | null;
  nonce: string;
  is_owner?: boolean;
  device_fingerprint?: string;
}

export interface LicenseVerificationResult {
  ok: boolean;
  reason?: string;
  claims?: LicenseKey;
  isExpired?: boolean;
  isRevoked?: boolean;
}

export interface DeviceFingerprint {
  os: string;
  appVersion: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  hash: string;
}

export interface RevocationEntry {
  nonce: string;
  revoked_at: string;
  reason?: string;
}

export interface LicenseStorageInfo {
  path: string;
  exists: boolean;
  isValid: boolean;
  claims?: LicenseKey;
}

export type LicenseInputMethod = 'file' | 'paste' | 'upload' | 'auto-discover';

export interface LicenseInstallResult {
  success: boolean;
  method: LicenseInputMethod;
  error?: string;
  claims?: LicenseKey;
}