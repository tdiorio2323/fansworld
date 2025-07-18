import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAdvancedReferral } from '@/hooks/useAdvancedReferral';
import { Copy, Share2, QrCode, Link, Plus, Check } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'qrcode';

interface ReferralCode {
  id: string;
  code: string;
  uses_remaining: number;
  total_uses: number;
  expires_at?: string;
  active: boolean;
  custom_message?: string;
  landing_page_url?: string;
}

interface ReferralCodeGeneratorProps {
  existingCodes: ReferralCode[];
}

export function ReferralCodeGenerator({ existingCodes }: ReferralCodeGeneratorProps) {
  const { generateCustomCode } = useAdvancedReferral();
  const [showGenerator, setShowGenerator] = useState(false);
  const [prefix, setPrefix] = useState('');
  const [message, setMessage] = useState('');
  const [landingPage, setLandingPage] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<Record<string, string>>({});

  const handleGenerateCode = async () => {
    await generateCustomCode.mutateAsync({
      prefix: prefix || undefined,
      message: message || undefined,
      landingPage: landingPage || undefined
    });
    
    // Reset form
    setPrefix('');
    setMessage('');
    setLandingPage('');
    setShowGenerator(false);
  };

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const shareCode = async (code: string) => {
    const shareUrl = `${window.location.origin}/invite/${code}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Cabana!',
          text: 'Use my referral code to get exclusive benefits',
          url: shareUrl
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const generateQR = async (code: string) => {
    try {
      const shareUrl = `${window.location.origin}/invite/${code}`;
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodes(prev => ({ ...prev, [code]: qrDataUrl }));
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  const activeCodes = existingCodes.filter(code => code.active);
  const expiredCodes = existingCodes.filter(code => !code.active);

  return (
    <div className="space-y-6">
      {/* Active Codes */}
      <Card className="glass-morphism">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Referral Codes</CardTitle>
              <CardDescription>Share these codes to earn commissions</CardDescription>
            </div>
            <Button onClick={() => setShowGenerator(!showGenerator)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Custom Code
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showGenerator && (
            <div className="mb-6 p-4 border border-border/50 rounded-lg bg-background/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prefix">Code Prefix (Optional)</Label>
                  <Input
                    id="prefix"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value.toUpperCase().slice(0, 10))}
                    placeholder="e.g., SPECIAL"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="landingPage">Custom Landing Page (Optional)</Label>
                  <Input
                    id="landingPage"
                    value={landingPage}
                    onChange={(e) => setLandingPage(e.target.value)}
                    placeholder="https://example.com/promo"
                    type="url"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Custom Message (Optional)</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a personalized message for your referrals..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowGenerator(false)}>
                  Cancel
                </Button>
                <Button onClick={handleGenerateCode} disabled={generateCustomCode.isPending}>
                  {generateCustomCode.isPending ? 'Generating...' : 'Generate Code'}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {activeCodes.map((code) => (
              <div
                key={code.id}
                className="p-4 rounded-lg border border-border/50 bg-background/50 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <code className="text-lg font-mono font-bold text-primary">
                      {code.code}
                    </code>
                    <Badge variant="outline" className="border-green-500/50 text-green-500">
                      Active
                    </Badge>
                    {code.uses_remaining > 0 && (
                      <Badge variant="secondary">
                        {code.uses_remaining} uses left
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(code.code)}
                    >
                      {copiedCode === code.code ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => shareCode(code.code)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => generateQR(code.code)}
                    >
                      <QrCode className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{code.total_uses} times used</span>
                  {code.expires_at && (
                    <span>Expires {new Date(code.expires_at).toLocaleDateString()}</span>
                  )}
                </div>

                {code.custom_message && (
                  <div className="p-3 rounded bg-muted/50 text-sm">
                    {code.custom_message}
                  </div>
                )}

                {code.landing_page_url && (
                  <div className="flex items-center gap-2 text-sm">
                    <Link className="h-3 w-3" />
                    <a
                      href={code.landing_page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Custom landing page
                    </a>
                  </div>
                )}

                {qrCodes[code.code] && (
                  <div className="mt-4 p-4 bg-white rounded-lg inline-block">
                    <img src={qrCodes[code.code]} alt={`QR code for ${code.code}`} />
                    <p className="text-xs text-center mt-2 text-black">Scan to share</p>
                  </div>
                )}
              </div>
            ))}

            {activeCodes.length === 0 && !showGenerator && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No active referral codes yet</p>
                <Button onClick={() => setShowGenerator(true)}>
                  Create Your First Code
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Expired Codes */}
      {expiredCodes.length > 0 && (
        <Card className="glass-morphism opacity-75">
          <CardHeader>
            <CardTitle className="text-sm">Expired Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiredCodes.map((code) => (
                <div
                  key={code.id}
                  className="p-3 rounded-lg bg-background/30 flex items-center justify-between"
                >
                  <code className="font-mono text-muted-foreground line-through">
                    {code.code}
                  </code>
                  <Badge variant="outline" className="border-muted">
                    Expired
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}