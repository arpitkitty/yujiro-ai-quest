import { generateDeviceFingerprint } from '../license/crypto';
import { getDeviceFingerprint, getLicenseFromCache } from '../license/storage';

interface FraudAlert {
  type: 'warning' | 'suspicious' | 'critical';
  message: string;
  suggestion: string;
  timestamp: string;
}

interface DeviceUsagePattern {
  fingerprint: string;
  firstSeen: string;
  lastSeen: string;
  sessionCount: number;
  locations: string[];
}

/**
 * Detect suspicious usage patterns (client-side only, privacy-first)
 */
export class FraudHeuristicsAgent {
  private static readonly STORAGE_KEY = 'yujiro_fraud_detection';
  private static readonly MAX_DEVICES_24H = 3;
  private static readonly SUSPICIOUS_PATTERN_THRESHOLD = 10;

  /**
   * Check for suspicious device switching patterns
   */
  static checkDeviceSwitching(): FraudAlert | null {
    const currentFp = generateDeviceFingerprint();
    const storedFp = getDeviceFingerprint();
    const license = getLicenseFromCache();
    
    if (!license) return null;

    // If device fingerprint changed frequently
    const deviceHistory = this.getDeviceHistory();
    const recentDevices = deviceHistory.filter(d => 
      new Date().getTime() - new Date(d.lastSeen).getTime() < 24 * 60 * 60 * 1000
    );

    if (recentDevices.length > this.MAX_DEVICES_24H) {
      return {
        type: 'warning',
        message: `License used on ${recentDevices.length} different devices in 24h`,
        suggestion: 'If this isn\'t you, contact support immediately. Your license might be compromised.',
        timestamp: new Date().toISOString()
      };
    }

    return null;
  }

  /**
   * Detect rapid consecutive activations (bot-like behavior)
   */
  static checkActivationPattern(): FraudAlert | null {
    const activationLog = this.getActivationLog();
    const recentActivations = activationLog.filter(timestamp => 
      new Date().getTime() - new Date(timestamp).getTime() < 60 * 1000 // Last minute
    );

    if (recentActivations.length > 5) {
      return {
        type: 'suspicious',
        message: 'Rapid license activation attempts detected',
        suggestion: 'Take a break! If you\'re having issues, try refreshing the page or contact support.',
        timestamp: new Date().toISOString()
      };
    }

    return null;
  }

  /**
   * Check for suspicious timezone/location changes
   */
  static checkLocationPattern(): FraudAlert | null {
    const currentTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const deviceHistory = this.getDeviceHistory();
    
    const uniqueTimezones = new Set(deviceHistory.map(d => d.locations).flat());
    uniqueTimezones.add(currentTz);

    // If license used across many different timezones in short time
    if (uniqueTimezones.size > 5) {
      return {
        type: 'critical',
        message: `License used across ${uniqueTimezones.size} different locations/timezones`,
        suggestion: 'This looks suspicious! If you\'re traveling, that\'s cool. If not, your license might be leaked.',
        timestamp: new Date().toISOString()
      };
    }

    return null;
  }

  /**
   * Run all fraud detection checks
   */
  static runSecurityScan(): FraudAlert[] {
    const alerts: FraudAlert[] = [];
    
    const deviceAlert = this.checkDeviceSwitching();
    if (deviceAlert) alerts.push(deviceAlert);
    
    const activationAlert = this.checkActivationPattern();
    if (activationAlert) alerts.push(activationAlert);
    
    const locationAlert = this.checkLocationPattern();
    if (locationAlert) alerts.push(locationAlert);

    // Log scan for analytics (locally only)
    this.logSecurityScan(alerts);
    
    return alerts;
  }

  /**
   * Record device usage (privacy-first, local only)
   */
  static recordDeviceUsage(): void {
    const fingerprint = generateDeviceFingerprint();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date().toISOString();
    
    const history = this.getDeviceHistory();
    const existing = history.find(d => d.fingerprint === fingerprint);
    
    if (existing) {
      existing.lastSeen = now;
      existing.sessionCount++;
      if (!existing.locations.includes(timezone)) {
        existing.locations.push(timezone);
      }
    } else {
      history.push({
        fingerprint,
        firstSeen: now,
        lastSeen: now,
        sessionCount: 1,
        locations: [timezone]
      });
    }
    
    // Keep only last 30 days of data
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const filteredHistory = history.filter(d => d.lastSeen > thirtyDaysAgo);
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
      devices: filteredHistory,
      lastScan: now
    }));
  }

  /**
   * Record activation attempt
   */
  static recordActivation(): void {
    const activationLog = this.getActivationLog();
    activationLog.push(new Date().toISOString());
    
    // Keep only last 100 activations
    if (activationLog.length > 100) {
      activationLog.splice(0, activationLog.length - 100);
    }
    
    const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    data.activations = activationLog;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  /**
   * Get device usage history
   */
  private static getDeviceHistory(): DeviceUsagePattern[] {
    try {
      const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      return data.devices || [];
    } catch {
      return [];
    }
  }

  /**
   * Get activation log
   */
  private static getActivationLog(): string[] {
    try {
      const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      return data.activations || [];
    } catch {
      return [];
    }
  }

  /**
   * Log security scan results (locally only)
   */
  private static logSecurityScan(alerts: FraudAlert[]): void {
    try {
      const data = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
      if (!data.scans) data.scans = [];
      
      data.scans.push({
        timestamp: new Date().toISOString(),
        alertCount: alerts.length,
        alertTypes: alerts.map(a => a.type)
      });
      
      // Keep only last 50 scans
      if (data.scans.length > 50) {
        data.scans.splice(0, data.scans.length - 50);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to log security scan:', error);
    }
  }

  /**
   * Get security summary for user
   */
  static getSecuritySummary(): {
    deviceCount: number;
    recentAlerts: number;
    lastScan: string | null;
    recommendations: string[];
  } {
    const history = this.getDeviceHistory();
    const recentDevices = history.filter(d => 
      new Date().getTime() - new Date(d.lastSeen).getTime() < 7 * 24 * 60 * 60 * 1000
    );
    
    const alerts = this.runSecurityScan();
    const recommendations: string[] = [];
    
    if (recentDevices.length > 2) {
      recommendations.push('Consider using license on fewer devices for better security');
    }
    
    if (alerts.some(a => a.type === 'critical')) {
      recommendations.push('Review recent login activity immediately');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Your license usage looks secure! 🛡️');
    }
    
    return {
      deviceCount: recentDevices.length,
      recentAlerts: alerts.length,
      lastScan: new Date().toISOString(),
      recommendations
    };
  }
}
