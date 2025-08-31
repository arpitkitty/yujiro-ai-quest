import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { verifyLicense, quickVerifyLicense, getCurrentLicense, isOwner } from '@/lib/license/verification';
import { FraudHeuristicsAgent } from '@/lib/ai/fraudHeuristicsAgent';
import type { LicenseKey, LicenseVerificationResult } from '@/lib/license/types';

interface LicenseContextType {
  license: LicenseKey | null;
  isLicensed: boolean;
  isOwner: boolean;
  isLoading: boolean;
  error: string | null;
  verifyLicenseToken: (token: string) => Promise<LicenseVerificationResult>;
  clearLicense: () => void;
  hasFeature: (feature: string) => boolean;
  fraudAlerts: any[];
}

const LicenseContext = createContext<LicenseContextType | undefined>(undefined);

interface LicenseProviderProps {
  children: ReactNode;
}

export function LicenseProvider({ children }: LicenseProviderProps) {
  const [license, setLicense] = useState<LicenseKey | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fraudAlerts, setFraudAlerts] = useState<any[]>([]);

  // Initialize license state
  useEffect(() => {
    const initializeLicense = async () => {
      try {
        setIsLoading(true);

        // Check for cached license first
        const cached = getCurrentLicense();
        if (cached) {
          const result = quickVerifyLicense();
          if (result.ok) {
            setLicense(cached);
            setError(null);
          } else {
            setError(result.reason || 'License verification failed');
          }
        } else {
          // Auto-discover fallback license file from public root (stateless)
          try {
            const res = await fetch('/yujiro_license.json', { cache: 'no-store' });
            if (res.ok) {
              const text = await res.text();
              const verifyRes = await verifyLicense(text);
              if (verifyRes.ok && verifyRes.claims) {
                setLicense(verifyRes.claims);
                setError(null);
              }
            }
          } catch (e) {
            // ignore if not present
          }
        }

        // Record device usage for fraud detection
        FraudHeuristicsAgent.recordDeviceUsage();

        // Run security scan
        const alerts = FraudHeuristicsAgent.runSecurityScan();
        setFraudAlerts(alerts);

      } catch (err) {
        console.error('License initialization failed:', err);
        setError('Failed to initialize license system');
      } finally {
        setIsLoading(false);
      }
    };

    initializeLicense();
  }, []);

  const verifyLicenseToken = async (token: string): Promise<LicenseVerificationResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Record activation attempt
      FraudHeuristicsAgent.recordActivation();
      
      const result = await verifyLicense(token);
      
      if (result.ok && result.claims) {
        setLicense(result.claims);
        setError(null);
        
        // Record successful activation
        FraudHeuristicsAgent.recordDeviceUsage();
      } else {
        setError(result.reason || 'License verification failed');
      }
      
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMsg);
      return { ok: false, reason: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const clearLicense = () => {
    setLicense(null);
    setError(null);
    localStorage.removeItem('yujiro_license_cache');
  };

  const hasFeature = (feature: string): boolean => {
    if (!license) return false;
    if (license.is_owner) return true;
    return license.features.includes(feature);
  };

  const contextValue: LicenseContextType = {
    license,
    isLicensed: !!license,
    isOwner: isOwner(),
    isLoading,
    error,
    verifyLicenseToken,
    clearLicense,
    hasFeature,
    fraudAlerts
  };

  return (
    <LicenseContext.Provider value={contextValue}>
      {children}
    </LicenseContext.Provider>
  );
}

export function useLicense() {
  const context = useContext(LicenseContext);
  if (context === undefined) {
    throw new Error('useLicense must be used within a LicenseProvider');
  }
  return context;
}