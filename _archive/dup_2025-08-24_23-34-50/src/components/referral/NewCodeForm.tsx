import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdvancedReferral } from '@/hooks/useAdvancedReferral';

interface NewCodeFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function NewCodeForm({ onSuccess, onCancel }: NewCodeFormProps) {
  const { generateCustomCode } = useAdvancedReferral();
  const [prefix, setPrefix] = useState('');
  const [message, setMessage] = useState('');
  const [landingPage, setLandingPage] = useState('');

  const handleGenerateCode = async () => {
    await generateCustomCode.mutateAsync({
      prefix: prefix || undefined,
      message: message || undefined,
      landingPage: landingPage || undefined,
    });
    onSuccess();
  };

  return (
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
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleGenerateCode} disabled={generateCustomCode.isPending}>
          {generateCustomCode.isPending ? 'Generating...' : 'Generate Code'}
        </Button>
      </div>
    </div>
  );
}