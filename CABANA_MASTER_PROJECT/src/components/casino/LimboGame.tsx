import React, { useState } from 'react';
import { Zap, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export default function LimboGame() {
  const [betAmount, setBetAmount] = useState('10.00');
  const [targetMultiplier, setTargetMultiplier] = useState(2.00);
  const [isPlaying, setIsPlaying] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [isWin, setIsWin] = useState<boolean | null>(null);

  const winChance = (1 / targetMultiplier * 100).toFixed(2);
  const payout = (parseFloat(betAmount) * targetMultiplier).toFixed(2);

  const play = () => {
    setIsPlaying(true);
    setResult(null);
    setIsWin(null);

    setTimeout(() => {
      // Generate random multiplier (simplified - in real game would be provably fair)
      const randomMultiplier = 1 / Math.random();
      
      setResult(randomMultiplier);
      setIsWin(randomMultiplier >= targetMultiplier);
      setIsPlaying(false);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Display */}
        <div className="lg:col-span-2">
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            {/* Result Display */}
            <div className="h-80 bg-[#0f212e] rounded-lg flex items-center justify-center relative overflow-hidden mb-6">
              {/* Animated background */}
              <div className="absolute inset-0">
                <div className={`absolute inset-0 transition-all duration-1000 ${
                  isWin === true ? 'bg-gradient-to-t from-green-900/50 to-transparent' :
                  isWin === false ? 'bg-gradient-to-t from-red-900/50 to-transparent' :
                  ''
                }`} />
              </div>

              <div className="relative z-10 text-center">
                {isPlaying ? (
                  <div className="animate-pulse">
                    <Zap className="w-24 h-24 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-400">Rolling...</p>
                  </div>
                ) : result !== null ? (
                  <div>
                    <div className={`text-7xl font-bold mb-4 ${
                      isWin ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {result.toFixed(2)}x
                    </div>
                    <div className="text-2xl font-semibold">
                      {isWin ? (
                        <span className="text-green-500">WIN! +${(parseFloat(payout) - parseFloat(betAmount)).toFixed(2)}</span>
                      ) : (
                        <span className="text-red-500">LOSE! -${betAmount}</span>
                      )}
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      Target was {targetMultiplier.toFixed(2)}x
                    </div>
                  </div>
                ) : (
                  <div>
                    <Zap className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">Set your target and play!</p>
                  </div>
                )}
              </div>

              {/* Visual indicator bar */}
              {result !== null && (
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-gray-800">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      isWin ? 'bg-green-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(100, (targetMultiplier / result) * 100)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Game Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-[#0f212e] rounded p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Win Chance</p>
                <p className="text-lg font-semibold text-blue-500">{winChance}%</p>
              </div>
              <div className="bg-[#0f212e] rounded p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Multiplier</p>
                <p className="text-lg font-semibold text-yellow-500">{targetMultiplier.toFixed(2)}x</p>
              </div>
              <div className="bg-[#0f212e] rounded p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Payout</p>
                <p className="text-lg font-semibold text-green-500">${payout}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div>
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Game Settings</h3>
            
            {/* Bet Amount */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-1 block">Bet Amount</label>
              <div className="relative">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-[#0f212e] border-gray-700 pr-12"
                  disabled={isPlaying}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">USD</span>
              </div>
            </div>

            {/* Target Multiplier */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Target Multiplier</label>
                <span className="text-sm font-semibold text-yellow-500">{targetMultiplier.toFixed(2)}x</span>
              </div>
              <Slider
                value={[targetMultiplier]}
                onValueChange={(value) => setTargetMultiplier(value[0])}
                min={1.01}
                max={1000}
                step={0.01}
                disabled={isPlaying}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1.01x</span>
                <span>10x</span>
                <span>100x</span>
                <span>1000x</span>
              </div>
            </div>

            {/* Quick Select */}
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-2">Quick Select</p>
              <div className="grid grid-cols-3 gap-2">
                {[1.5, 2, 3, 5, 10, 100].map((mult) => (
                  <Button
                    key={mult}
                    variant="outline"
                    size="sm"
                    onClick={() => setTargetMultiplier(mult)}
                    className="border-gray-700 hover:bg-gray-800"
                    disabled={isPlaying}
                  >
                    {mult}x
                  </Button>
                ))}
              </div>
            </div>

            {/* Profit on Win */}
            <div className="mb-4 p-3 bg-[#0f212e] rounded">
              <p className="text-xs text-gray-400 mb-1">Profit on Win</p>
              <p className="text-lg font-semibold text-green-500">
                +${(parseFloat(payout) - parseFloat(betAmount)).toFixed(2)}
              </p>
            </div>

            {/* Play Button */}
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              onClick={play}
              disabled={isPlaying}
            >
              {isPlaying ? 'Playing...' : 'Play'}
            </Button>
          </Card>

          {/* Recent Games */}
          <Card className="bg-[#2f4553] border-gray-700 p-4 mt-4">
            <h3 className="font-semibold mb-3 text-sm">Recent Games</h3>
            <div className="space-y-2">
              {[
                { target: 2.00, result: 3.45, win: true },
                { target: 10.00, result: 4.23, win: false },
                { target: 1.50, result: 8.91, win: true },
                { target: 5.00, result: 2.11, win: false },
                { target: 3.00, result: 12.45, win: true },
              ].map((game, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">Target: {game.target.toFixed(2)}x</span>
                  <span className={game.win ? 'text-green-500' : 'text-red-500'}>
                    {game.result.toFixed(2)}x
                  </span>
                  <TrendingUp className={`w-3 h-3 ${game.win ? 'text-green-500' : 'text-red-500 rotate-180'}`} />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}