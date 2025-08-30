interface UIText {
  [key: string]: string;
}

const cachedText: UIText = {
  // Welcome messages
  'welcome.title': '🔥 Welcome to Yujiro Mode',
  'welcome.subtitle': 'Level up your life like an anime protagonist',
  'welcome.locked': 'Unlock your potential with a valid license',
  
  // License errors
  'error.invalid_signature': '❌ Yo, that license signature is fake AF! Get a legit one.',
  'error.expired': '⏰ License expired bro! Time to renew and get back to grinding.',
  'error.missing_features': '🔒 You need premium features for this epic content!',
  'error.nonce_used': '♻️ This license was already activated somewhere else!',
  'error.revoked': '🚫 License got revoked. Contact support if this is wrong.',
  'error.invalid_format': '📝 License format is wack. Check if you copied it right.',
  
  // Success messages
  'success.license_verified': '✅ License activated! Ready to dominate? 💪',
  'success.owner_mode': '👑 OWNER MODE UNLOCKED! You have unlimited power!',
  'success.premium_active': '⭐ Premium features now available!',
  
  // Profile selector
  'profile.select_title': 'Choose Your Fighter',
  'profile.owner_badge': 'OWNER',
  'profile.premium_badge': 'PREMIUM',
  'profile.free_badge': 'FREE',
  
  // Feature cards
  'feature.boss_mode': '⚡ Boss Mode',
  'feature.boss_mode_desc': 'Epic daily challenges with anime-style battles',
  'feature.pro_charts': '📊 Pro Analytics',
  'feature.pro_charts_desc': 'Deep insights into your warrior journey',
  'feature.coach_personas': '🤖 AI Coach Squad',
  'feature.coach_personas_desc': 'Multiple AI personalities to motivate you',
  'feature.unlock_required': '🔓 License Required',
  
  // Upload modal
  'upload.title': 'Upload Your License',
  'upload.subtitle': 'Drag & drop or paste your license file/token',
  'upload.paste_placeholder': 'Paste your license token here...',
  'upload.drag_text': 'Drop your license file here',
  'upload.browse_text': 'or click to browse files',
  
  // Navigation
  'nav.dashboard': 'Dashboard',
  'nav.profile': 'Profile',
  'nav.settings': 'Settings',
  'nav.license': 'Manage License',
  'nav.logout': 'Sign Out',
  
  // Settings
  'settings.revocation_check': 'Check for revoked licenses online',
  'settings.offline_mode': 'Allow offline usage when servers unreachable',
  'settings.auto_discover': 'Auto-discover license files on device',
  
  // Loading states
  'loading.verifying': 'Verifying your license...',
  'loading.unlocking': 'Unlocking features...',
  'loading.syncing': 'Syncing with the matrix...',
  
  // Generic actions
  'action.try_again': 'Try Again',
  'action.upload': 'Upload License',
  'action.paste': 'Paste Token',
  'action.browse': 'Browse Files',
  'action.continue': 'Continue',
  'action.cancel': 'Cancel',
  'action.save': 'Save',
  'action.close': 'Close'
};

export async function generateUIText(key: string, context?: any): Promise<string> {
  // Return cached text for common keys
  if (cachedText[key]) {
    return cachedText[key];
  }
  
  // For dynamic content, we could call OpenAI API here
  // For now, return a default with context interpolation
  return `Text for ${key}${context ? ` (${JSON.stringify(context)})` : ''}`;
}

export async function explainLicenseError(reason: string, context?: any): Promise<string> {
  const explanations: { [key: string]: string } = {
    'Invalid license signature': `
      🚨 **License Verification Failed**
      
      Your license signature couldn't be verified. This usually means:
      • The license file got corrupted during transfer
      • Someone tampered with the license
      • Wrong license format
      
      **Quick fixes:**
      1. Re-download your license from the original source
      2. Copy-paste carefully without extra spaces
      3. Contact support if the problem persists
      
      Need help? Email: support@yujiromode.com
    `,
    
    'License has expired': `
      ⏰ **License Expired**
      
      Your license has reached its expiry date. But don't worry!
      
      **What you can do:**
      1. Contact your license provider for renewal
      2. Purchase a new license if you're loving the app
      3. Some features might still work in limited mode
      
      Want to upgrade? Check our pricing page!
    `,
    
    'Missing required features': `
      🔒 **Feature Not Included**
      
      Your current license doesn't include this premium feature.
      
      **Available options:**
      1. Upgrade your license for more features
      2. Contact sales for a custom plan
      3. Use the free features for now
      
      Ready to level up? Hit that upgrade button! 💪
    `,
    
    'License nonce already used': `
      ♻️ **License Already Activated**
      
      This license is already being used on another device/browser.
      
      **What's happening:**
      • Each license can only be used once for security
      • You might have it installed somewhere else
      • Check your other devices
      
      **Solutions:**
      1. Use the same browser/device where it's activated
      2. Contact support to reset activation
      3. Get additional licenses for multiple devices
    `
  };
  
  return explanations[reason] || `
    ❓ **Unexpected Error**
    
    Something went wrong: ${reason}
    
    **Try these steps:**
    1. Refresh the page and try again
    2. Clear browser cache
    3. Contact support with this error message
    
    We're here to help: support@yujiromode.com
  `;
}