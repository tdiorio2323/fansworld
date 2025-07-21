import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Share2, QrCode, Link, Check } from 'lucide-react';
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

interface ReferralCodeItemProps {
  code: ReferralCode;
}

export function ReferralCodeItem({ code }: ReferralCodeItemProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const copyCodeToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code.code);
      setIsCopied(true);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const shareCode = async () => {
    const shareUrl = `${window.location.origin}/invite/${code.code}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join me on Cabana!',
          text: 'Use my referral code to get exclusive benefits',
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error, do nothing.
      }
    } else {
      // Fallback to copying the URL
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Share link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy share link');
      }
    }
  };

  const toggleQRCode = async () => {
    if (qrCodeUrl) {
      setQrCodeUrl(null);
      return;
    }
    try {
      const shareUrl = `${window.location.origin}/invite/${code.code}`;
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 256,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      toast.error('Failed to generate QR code');
    }
  };

  return (
    <div className="p-4 rounded-lg border border-border/50 bg-background/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <code className="text-lg font-mono font-bold text-primary">{code.code}</code>
          <Badge variant="outline" className="border-green-500/50 text-green-500">Active</Badge>
          {code.uses_remaining > 0 && <Badge variant="secondary">{code.uses_remaining} uses left</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={copyCodeToClipboard} aria-label="Copy code">
            {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={shareCode} aria-label="Share code">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={toggleQRCode} aria-label="Show QR code">
            <QrCode className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{code.total_uses} times used</span>
        {code.expires_at && <span>Expires {new Date(code.expires_at).toLocaleDateString()}</span>}
      </div>

      {code.custom_message && <div className="p-3 rounded bg-muted/50 text-sm">{code.custom_message}</div>}

      {code.landing_page_url && (
        <div className="flex items-center gap-2 text-sm">
          <Link className="h-3 w-3" />
          <a href={code.landing_page_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Custom landing page</a>
        </div>
      )}

      {qrCodeUrl && (
        <div className="mt-4 p-4 bg-white rounded-lg inline-block">
          <img src={qrCodeUrl} alt={`QR code for ${code.code}`} />
          <p className="text-xs text-center mt-2 text-black">Scan to share</p>
        </div>
      )}
    </div>
  );
}