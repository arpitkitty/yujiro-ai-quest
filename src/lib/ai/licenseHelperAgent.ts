import type { LicenseVerificationResult } from '../license/types';
import { explainLicenseError } from './uiCopyAgent';

export class LicenseHelperAgent {
  /**
   * Generate step-by-step fix instructions for license issues
   */
  static async generateFixInstructions(result: LicenseVerificationResult): Promise<string> {
    if (result.ok) {
      return '✅ Your license is working perfectly! No action needed.';
    }

    const reason = result.reason || 'Unknown error';
    
    const fixGuides: { [key: string]: string } = {
      'Invalid license signature': `
        🔧 **How to Fix License Signature Issues**
        
        **Step 1: Check Your License File**
        • Make sure you downloaded the complete file
        • File should end with .json or be a long token string
        • No extra characters or spaces
        
        **Step 2: Try Re-downloading**
        • Go back to your purchase email
        • Download the license again
        • Save it in a safe location
        
        **Step 3: Alternative Methods**
        • Try copying and pasting the license text directly
        • Use "Browse Files" instead of drag-and-drop
        • Clear browser cache and try again
        
        **Still stuck?** Our support team is standing by! 💬
      `,
      
      'License has expired': `
        ⏰ **License Renewal Guide**
        
        **Option 1: Automatic Renewal**
        • Check if you have auto-renewal enabled
        • Look for renewal emails in your inbox
        • Payment might have failed - update your card
        
        **Option 2: Manual Renewal**
        • Visit our pricing page
        • Use the same email address as before
        • You'll get a discount as an existing user!
        
        **Option 3: Contact Sales**
        • Need a custom plan? Hit up sales@yujiromode.com
        • Mention your current license for special pricing
        
        **Grace Period:** Some features might still work for 7 days ⭐
      `,
      
      'Missing required features': `
        🔓 **Feature Upgrade Required**
        
        **What's Happening:**
        Your current license (${result.claims?.features?.join(', ') || 'unknown'}) doesn't include this premium feature.
        
        **Upgrade Options:**
        
        **🥇 Premium Plan:**
        • All current features + this one
        • 30-day money-back guarantee
        • Priority support
        
        **👑 Owner Plan:**
        • Unlimited access to everything
        • Beta features first
        • Lifetime updates
        
        **🆓 Alternative:**
        • Explore similar free features
        • Wait for free tier updates
        
        **Ready to upgrade?** We've got special pricing for existing users! 💰
      `,
      
      'License nonce already used': `
        🔄 **License Already Active**
        
        **Why This Happens:**
        Each license can only be activated once for security. Yours is already running somewhere!
        
        **Find Your Active Session:**
        
        **Step 1: Check Other Devices**
        • Look on your phone, tablet, other computers
        • Check different browsers (Chrome, Firefox, Safari)
        • Close extra tabs with Yujiro Mode open
        
        **Step 2: Clear and Restart**
        • Clear browser data for this site
        • Log out from all devices
        • Try activating again
        
        **Step 3: Reset Activation**
        • Contact support to reset your license
        • We'll deactivate all sessions
        • Then you can activate fresh
        
        **Need Multiple Devices?** Ask about our multi-device licenses! 📱💻
      `,
      
      'License has been revoked': `
        🚫 **License Revoked**
        
        **This is serious!** Your license has been disabled.
        
        **Common Reasons:**
        • Payment dispute or chargeback
        • Terms of service violation
        • Suspected fraud or sharing
        • Administrative error
        
        **What to Do:**
        
        **Step 1: Check Your Email**
        • Look for official communication
        • Check spam/junk folders too
        
        **Step 2: Contact Support ASAP**
        • Email: support@yujiromode.com
        • Include your license details
        • Explain your situation
        
        **Step 3: Gather Info**
        • Screenshot this error
        • Note when it started happening
        • List any recent changes
        
        **We're here to help resolve this quickly! 🤝**
      `
    };

    return fixGuides[reason] || `
      ❓ **Troubleshooting: ${reason}**
      
      This is an unusual error. Here's what to try:
      
      **Quick Fixes:**
      1. Refresh the page
      2. Clear browser cache
      3. Try a different browser
      4. Restart your device
      
      **Get Help:**
      • Copy this error message: "${reason}"
      • Email it to: support@yujiromode.com
      • Include your license details
      
      Our support team will get you back up and running! 🛠️
    `;
  }

  /**
   * Generate a polite support email template
   */
  static generateSupportEmail(result: LicenseVerificationResult): string {
    const subject = `License Issue: ${result.reason || 'Unknown Error'}`;
    
    const body = `
Hi Yujiro Mode Support Team! 👋

I'm having trouble with my license and could use some help.

**Issue Details:**
• Error: ${result.reason || 'Unknown error occurred'}
• License Status: ${result.ok ? 'Valid' : 'Invalid'}
${result.isExpired ? '• Expiry: License has expired' : ''}
${result.isRevoked ? '• Status: License was revoked' : ''}

**My License Info:**
${result.claims ? `
• User ID: ${result.claims.user_id}
• Features: ${result.claims.features?.join(', ') || 'None listed'}
• Issued: ${result.claims.issued_at}
• Expires: ${result.claims.expiry_iso || 'Never'}
• Nonce: ${result.claims.nonce?.substring(0, 8)}...
` : '• No valid license data available'}

**What I've Tried:**
☐ Refreshed the page
☐ Cleared browser cache  
☐ Tried different browser
☐ Re-downloaded license file
☐ Other: ________________

**Additional Notes:**
[Please describe when this started happening and any other relevant details]

Thanks for your help! Looking forward to getting back to grinding in Yujiro Mode! 💪

Best regards,
[Your Name]
[Your Email]
    `.trim();

    return `mailto:support@yujiromode.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  /**
   * Get context-aware help suggestions
   */
  static getHelpSuggestions(result: LicenseVerificationResult): Array<{
    title: string;
    description: string;
    action: 'retry' | 'upload' | 'contact' | 'upgrade' | 'external';
    url?: string;
  }> {
    const suggestions = [];

    if (!result.ok) {
      suggestions.push({
        title: '🔄 Try Again',
        description: 'Sometimes a simple retry fixes temporary issues',
        action: 'retry'
      });

      suggestions.push({
        title: '📁 Upload New License',
        description: 'Re-upload your license file or paste the token',
        action: 'upload'
      });
    }

    if (result.reason?.includes('expired')) {
      suggestions.push({
        title: '⭐ Renew License',
        description: 'Get the latest license with new features',
        action: 'external',
        url: '/pricing'
      });
    }

    if (result.reason?.includes('Missing required features')) {
      suggestions.push({
        title: '🚀 Upgrade Plan',
        description: 'Unlock this feature and many more',
        action: 'upgrade'
      });
    }

    suggestions.push({
      title: '💬 Contact Support',
      description: 'Get personalized help from our team',
      action: 'contact'
    });

    suggestions.push({
      title: '📚 Help Center',
      description: 'Browse common solutions and guides',
      action: 'external',
      url: '/help'
    });

    return suggestions;
  }

  /**
   * Generate motivational message based on error type
   */
  static getMotivationalMessage(result: LicenseVerificationResult): string {
    if (result.ok) {
      return "🔥 You're all set! Time to unleash your inner warrior!";
    }

    const motivationalMessages: { [key: string]: string } = {
      'Invalid license signature': "Don't give up! Every warrior faces obstacles. Let's get this sorted! 💪",
      'License has expired': "Your journey isn't over! Renew and continue your epic quest! ⚡",
      'Missing required features': "Level up time! Unlock new powers with an upgrade! 🌟",
      'License nonce already used': "Almost there! Just need to sort out the activation. You got this! 🎯",
      'License has been revoked': "Every setback is a setup for a comeback! Let's fix this together! 🛡️"
    };

    const reason = result.reason || 'unknown';
    return motivationalMessages[reason] || "Every problem has a solution! We'll get you back in action! 🚀";
  }
}