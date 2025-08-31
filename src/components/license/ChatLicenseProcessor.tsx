import React, { useEffect } from 'react';
import { useLicense } from './LicenseProvider';
import { toast } from '@/hooks/use-toast';

interface ChatLicenseProcessorProps {
  onLicenseProcessed: () => void;
}

export function ChatLicenseProcessor({ onLicenseProcessed }: ChatLicenseProcessorProps) {
  const { verifyLicenseToken } = useLicense();

  useEffect(() => {
    // Listen for paste events or messages that might contain license keys
    const handleMessage = async (event: MessageEvent) => {
      const data = event.data;
      
      if (typeof data === 'string') {
        // Check if it looks like a JWT token
        const jwtPattern = /^eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/;
        
        if (jwtPattern.test(data.trim())) {
          toast({
            title: "License key detected!",
            description: "Processing your license key...",
          });

          try {
            const result = await verifyLicenseToken(data.trim());
            
            if (result.ok) {
              toast({
                title: "License activated!",
                description: "Welcome to Yujiro Mode! Access granted.",
                className: "bg-green-600 text-white",
              });
              onLicenseProcessed();
            } else {
              toast({
                title: "Invalid license key",
                description: result.reason || "The key you provided is not valid. Please DM @driveeon on Instagram for support.",
                variant: "destructive",
              });
            }
          } catch (error) {
            toast({
              title: "License verification failed",
              description: "There was an error processing your key. Please DM @driveeon on Instagram for support.",
              variant: "destructive",
            });
          }
        }
      }
    };

    // Listen for postMessage events (from parent window or other sources)
    window.addEventListener('message', handleMessage);
    
    // Clean up
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [verifyLicenseToken, onLicenseProcessed]);

  return null; // This is an invisible component
}

// Function to manually process a license key from chat
export function processLicenseFromChat(licenseKey: string) {
  // Send the license key as a message to trigger processing
  window.postMessage(licenseKey, window.location.origin);
}