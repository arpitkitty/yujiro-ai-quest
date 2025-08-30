import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, FileText, Copy, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLicense } from './LicenseProvider';
import { LicenseHelperAgent } from '@/lib/ai/licenseHelperAgent';
import { generateUIText } from '@/lib/ai/uiCopyAgent';

interface LicenseUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LicenseUploadModal({ open, onOpenChange }: LicenseUploadModalProps) {
  const { verifyLicenseToken, isLoading } = useLicense();
  const [dragActive, setDragActive] = useState(false);
  const [licenseText, setLicenseText] = useState('');
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [showHelp, setShowHelp] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileRead(files[0]);
    }
  };

  const handleFileRead = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setLicenseText(content);
    };
    reader.readAsText(file);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleVerify = async () => {
    if (!licenseText.trim()) return;

    const result = await verifyLicenseToken(licenseText.trim());
    setVerificationResult(result);
    
    if (result.ok) {
      setTimeout(() => {
        onOpenChange(false);
        setLicenseText('');
        setVerificationResult(null);
      }, 2000);
    } else {
      setShowHelp(true);
    }
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setLicenseText(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const getSuggestions = () => {
    if (!verificationResult || verificationResult.ok) return [];
    return LicenseHelperAgent.getHelpSuggestions(verificationResult);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gradient flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Upload Your License
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Drop Zone */}
          <Card
            className={`p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
              dragActive
                ? 'border-primary bg-primary/10 glow-neon'
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleFileSelect}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.txt"
              onChange={(e) => e.target.files?.[0] && handleFileRead(e.target.files[0])}
              className="hidden"
            />
            
            <div className="text-center">
              <motion.div
                animate={{
                  scale: dragActive ? 1.1 : 1,
                  rotate: dragActive ? 5 : 0
                }}
                transition={{ duration: 0.2 }}
              >
                <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              </motion.div>
              
              <h3 className="text-lg font-semibold mb-2">
                Drop your license file here
              </h3>
              <p className="text-muted-foreground mb-4">
                or click to browse files (.json, .txt)
              </p>
              
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={handleFileSelect}>
                  Browse Files
                </Button>
                <Button variant="outline" size="sm" onClick={handlePasteFromClipboard}>
                  <Copy className="w-4 h-4 mr-2" />
                  Paste from Clipboard
                </Button>
              </div>
            </div>
          </Card>

          {/* Text Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Or paste your license token:
            </label>
            <Textarea
              value={licenseText}
              onChange={(e) => setLicenseText(e.target.value)}
              placeholder="Paste your license token here..."
              className="min-h-[120px] font-mono text-sm"
            />
          </div>

          {/* Verification Result */}
          <AnimatePresence>
            {verificationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card className={`p-4 ${
                  verificationResult.ok 
                    ? 'border-green-500 bg-green-500/10' 
                    : 'border-red-500 bg-red-500/10'
                }`}>
                  <div className="flex items-start gap-3">
                    {verificationResult.ok ? (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">
                        {verificationResult.ok ? '✅ License Verified!' : '❌ Verification Failed'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {verificationResult.ok 
                          ? 'Your license is valid and active. Welcome aboard!' 
                          : verificationResult.reason
                        }
                      </p>
                      
                      {verificationResult.claims && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {verificationResult.claims.features?.map((feature: string) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {verificationResult.claims.is_owner && (
                            <Badge variant="default" className="text-xs">
                              👑 OWNER
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Help Suggestions */}
          <AnimatePresence>
            {showHelp && getSuggestions().length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card className="p-4 border-yellow-500 bg-yellow-500/10">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                    Need Help?
                  </h4>
                  <div className="grid gap-2">
                    {getSuggestions().map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className="justify-start h-auto p-3 text-left"
                        onClick={() => {
                          if (suggestion.action === 'retry') {
                            handleVerify();
                          } else if (suggestion.action === 'contact') {
                            window.open(LicenseHelperAgent.generateSupportEmail(verificationResult));
                          }
                        }}
                      >
                        <div>
                          <div className="font-medium">{suggestion.title}</div>
                          <div className="text-xs text-muted-foreground">{suggestion.description}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={!licenseText.trim() || isLoading}
              className="min-w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify License'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}