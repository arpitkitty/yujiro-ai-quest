// Public key for license verification (embedded in client)
export const PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1234567890abcdefghijk
lmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmn
opqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqr
stuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvw
xyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyzAB
CDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyzABCDEF
GHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyzwibq==
-----END PUBLIC KEY-----`;

// License file paths for different operating systems
export const LICENSE_PATHS = {
  windows: '%APPDATA%/YujiroMode/license.json',
  macos: '~/Library/Application Support/YujiroMode/license.json',
  linux: '~/.config/yujiromode/license.json',
  fallback: './yujiro_license.json'
};

// Feature flags available in the system
export const FEATURES = {
  PREMIUM: 'premium',
  BOSS_MODE: 'boss_mode',
  AI_COACH: 'ai_coach',
  PRO_CHARTS: 'pro_charts',
  COACH_PERSONAS: 'coach_personas',
  UNLIMITED_TRACKING: 'unlimited_tracking',
  EXPORT_DATA: 'export_data',
  CUSTOM_THEMES: 'custom_themes'
} as const;

// Revocation check endpoint
export const REVOCATION_ENDPOINT = '/api/revoked';

// Local storage keys
export const STORAGE_KEYS = {
  LICENSE_CACHE: 'yujiro_license_cache',
  DEVICE_FINGERPRINT: 'yujiro_device_fp',
  NONCE_CACHE: 'yujiro_nonce_cache',
  SETTINGS: 'yujiro_license_settings'
};

// Maximum devices allowed for fraud detection
export const MAX_DEVICES_PER_LICENSE = 3;

// Cache expiry for license verification (24 hours)
export const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000;