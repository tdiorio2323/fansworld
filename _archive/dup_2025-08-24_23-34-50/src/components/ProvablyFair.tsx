import React, { useState } from 'react';
import { Shield, Eye, RefreshCw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface GameResult {
  gameId: string;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
  result: number;
  hash: string;
}

export default function ProvablyFair() {
  const [clientSeed, setClientSeed] = useState('player_seed_123');
  const [gameResults] = useState<GameResult[]>([
    {
      gameId: 'dice_001',
      serverSeed: '2f8a9c1b4e6d3a7f9e2c8b5a1d4g7j0k3m6n9p2q5r8s1t4u7v0w3x6y9z2a5b8c',
      clientSeed: 'player_seed_123',
      nonce: 1,
      result: 45.67,
      hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2'
    },
    {
      gameId: 'crash_002',
      serverSeed: '8e5d2a9f6c3b0g7h4i1j8k5l2m9n6o3p0q7r4s1t8u5v2w9x6y3z0a7b4c1d8e5f',
      clientSeed: 'player_seed_123',
      nonce: 2,
      result: 2.34,
      hash: 'f2e1d0c9b8a7z6y5x4w3v2u1t0s9r8q7p6o5n4m3l2k1j0i9h8g7f6e5d4c3b2a1'
    }
  ]);
  
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generateHash = (serverSeed: string, clientSeed: string, nonce: number) => {
    // Simplified hash generation (in real implementation, would use HMAC-SHA256)
    const combined = `${serverSeed}-${clientSeed}-${nonce}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  };

  const verifyResult = (result: GameResult) => {
    const calculatedHash = generateHash(result.serverSeed, result.clientSeed, result.nonce);
    return calculatedHash === result.hash.slice(-8);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-8 h-8 text-green-500" />
          <h1 className="text-3xl font-bold">Provably Fair</h1>
        </div>
        <p className="text-gray-400">
          Verify the fairness of every game result with cryptographic proof
        </p>
      </div>

      <Tabs defaultValue="verify" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#1a2c38] border-gray-800">
          <TabsTrigger value="verify" className="data-[state=active]:bg-[#2f4553]">
            Verify Results
          </TabsTrigger>
          <TabsTrigger value="seeds" className="data-[state=active]:bg-[#2f4553]">
            Manage Seeds
          </TabsTrigger>
          <TabsTrigger value="how-it-works" className="data-[state=active]:bg-[#2f4553]">
            How It Works
          </TabsTrigger>
        </TabsList>

        <TabsContent value="verify" className="mt-6">
          <Card className="bg-[#1a2c38] border-gray-800">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Verify Game Results</h3>
              
              <div className="space-y-4">
                {gameResults.map((result, index) => (
                  <Card key={index} className="bg-[#0f212e] border-gray-800">
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-gray-800">
                            {result.gameId}
                          </Badge>
                          <Badge 
                            variant={verifyResult(result) ? "default" : "destructive"}
                            className={verifyResult(result) ? "bg-green-900 text-green-300" : ""}
                          >
                            {verifyResult(result) ? "✓ Verified" : "✗ Invalid"}
                          </Badge>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="border-gray-700 hover:bg-gray-800"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <label className="text-gray-400 block mb-1">Server Seed Hash</label>
                          <div className="flex items-center gap-2">
                            <Input 
                              value={result.hash.slice(0, 16) + '...'} 
                              readOnly 
                              className="bg-[#1a2c38] border-gray-700 text-xs font-mono"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(result.hash, `hash-${index}`)}
                            >
                              {copiedField === `hash-${index}` ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-gray-400 block mb-1">Client Seed</label>
                          <div className="flex items-center gap-2">
                            <Input 
                              value={result.clientSeed} 
                              readOnly 
                              className="bg-[#1a2c38] border-gray-700 text-xs font-mono"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(result.clientSeed, `client-${index}`)}
                            >
                              {copiedField === `client-${index}` ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <label className="text-gray-400 block mb-1">Nonce</label>
                          <Input 
                            value={result.nonce} 
                            readOnly 
                            className="bg-[#1a2c38] border-gray-700"
                          />
                        </div>

                        <div>
                          <label className="text-gray-400 block mb-1">Result</label>
                          <Input 
                            value={result.result} 
                            readOnly 
                            className="bg-[#1a2c38] border-gray-700 font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="seeds" className="mt-6">
          <Card className="bg-[#1a2c38] border-gray-800">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-4">Seed Management</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Client Seed (You Control This)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={clientSeed}
                      onChange={(e) => setClientSeed(e.target.value)}
                      className="bg-[#0f212e] border-gray-700"
                      placeholder="Enter your custom seed"
                    />
                    <Button 
                      variant="outline" 
                      className="border-gray-700 hover:bg-gray-800"
                      onClick={() => setClientSeed(Math.random().toString(36).substring(2, 15))}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Change this before each game to ensure unpredictability
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Server Seed Hash (Pre-committed by Stake)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2"
                      readOnly
                      className="bg-[#0f212e] border-gray-700 font-mono text-xs"
                    />
                    <Button
                      variant="ghost"
                      onClick={() => copyToClipboard("a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2", "server-hash")}
                    >
                      {copiedField === "server-hash" ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    This hash is generated before you place your bet and cannot be changed
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 block mb-2">
                    Next Nonce
                  </label>
                  <Input
                    value="3"
                    readOnly
                    className="bg-[#0f212e] border-gray-700"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Automatically increments with each bet
                  </p>
                </div>

                <div className="bg-[#0f212e] rounded-lg p-4">
                  <h4 className="font-medium text-green-500 mb-2">Seed Pair Active</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    Your current seed configuration is active and will be used for the next game.
                  </p>
                  <Button className="bg-yellow-600 hover:bg-yellow-700">
                    Rotate Server Seed
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="how-it-works" className="mt-6">
          <Card className="bg-[#1a2c38] border-gray-800">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-6">How Provably Fair Works</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Server Seed Generation</h4>
                    <p className="text-sm text-gray-400">
                      Before you place any bet, our server generates a random seed and immediately 
                      creates a cryptographic hash (SHA-256) of it. This hash is shown to you 
                      before the game begins.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Client Seed Input</h4>
                    <p className="text-sm text-gray-400">
                      You provide your own client seed (or use a random one we generate). 
                      This ensures that neither you nor we can predict the outcome alone.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Nonce Counter</h4>
                    <p className="text-sm text-gray-400">
                      Each bet increments a nonce counter, ensuring that repeated bets with 
                      the same seeds produce different results.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Result Generation</h4>
                    <p className="text-sm text-gray-400">
                      The game result is calculated using: 
                      HMAC-SHA256(server_seed, client_seed + ":" + nonce)
                      This creates a deterministic but unpredictable outcome.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Verification</h4>
                    <p className="text-sm text-gray-400">
                      After the game, we reveal the original server seed. You can then 
                      verify that the hash matches and recalculate the result yourself 
                      using any third-party tool.
                    </p>
                  </div>
                </div>

                <div className="bg-[#0f212e] rounded-lg p-4 border border-yellow-600/20">
                  <h4 className="text-yellow-500 font-medium mb-2">External Verification</h4>
                  <p className="text-sm text-gray-400 mb-3">
                    You can verify any result using third-party tools or build your own verifier:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-xs">
                      Verify on GitHub
                    </Button>
                    <Button variant="outline" className="border-gray-700 hover:bg-gray-800 text-xs">
                      Third-party Verifier
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}