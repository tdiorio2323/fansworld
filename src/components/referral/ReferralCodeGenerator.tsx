import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { NewCodeForm } from './NewCodeForm';
import { ReferralCodeItem } from './ReferralCodeItem';

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
  const [showGenerator, setShowGenerator] = useState(false);

  const activeCodes = existingCodes.filter((code) => code.active);
  const expiredCodes = existingCodes.filter((code) => !code.active);

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
            <NewCodeForm
              onSuccess={() => setShowGenerator(false)}
              onCancel={() => setShowGenerator(false)}
            />
          )}

          <div className="space-y-3">
            {activeCodes.map((code) => (
              <ReferralCodeItem key={code.id} code={code} />
            ))}
          </div>

          {activeCodes.length === 0 && !showGenerator && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No active referral codes yet</p>
              <Button onClick={() => setShowGenerator(true)}>Create Your First Code</Button>
            </div>
          )}
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