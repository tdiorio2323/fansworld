import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, AlertCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function CrashGame() {
  const [betAmount, setBetAmount] = useState('10.00');
  const [autoCashout, setAutoCashout] = useState('2.00');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isCrashed, setIsCrashed] = useState(false);
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [cashedOut, setCashedOut] = useState(false);
  const [cashoutMultiplier, setCashoutMultiplier] = useState<number | null>(null);
  const [gameHistory, setGameHistory] = useState<number[]>([2.34, 1.12, 5.67, 1.89, 3.45]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isPlaying && !isCrashed) {
      intervalRef.current = setInterval(() => {
        setCurrentMultiplier(prev => {
          const newMultiplier = prev + 0.01;
          
          // Random crash point
          if (Math.random() < 0.01) {
            setIsCrashed(true);
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            
            // Add to history
            setGameHistory(prev => [newMultiplier, ...prev.slice(0, 4)]);
            
            // Reset after 3 seconds
            setTimeout(() => {
              resetGame();
            }, 3000);
            
            return newMultiplier;
          }
          
          // Auto cashout
          if (newMultiplier >= parseFloat(autoCashout) && !cashedOut) {
            handleCashout();
          }
          
          return newMultiplier;
        });
      }, 50);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, isCrashed, autoCashout, cashedOut]);

  const resetGame = () => {
    setCurrentMultiplier(1.00);
    setIsCrashed(false);
    setCashedOut(false);
    setCashoutMultiplier(null);
  };

  const handleBet = () => {
    if (!isPlaying) {
      resetGame();
      setIsPlaying(true);
    }
  };

  const handleCashout = () => {
    if (isPlaying && !isCrashed && !cashedOut) {
      setCashedOut(true);
      setCashoutMultiplier(currentMultiplier);
      setIsPlaying(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  const profit = cashoutMultiplier 
    ? (parseFloat(betAmount) * cashoutMultiplier - parseFloat(betAmount)).toFixed(2)
    : '0.00';

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2">
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            {/* Crash Graph */}
            <div className="h-96 bg-[#0f212e] rounded-lg relative overflow-hidden mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-7xl font-bold mb-2 transition-all ${
                    isCrashed ? 'text-red-500' : 
                    cashedOut ? 'text-green-500' : 
                    isPlaying ? 'text-yellow-500' : 'text-gray-500'
                  }`}>
                    {currentMultiplier.toFixed(2)}x
                  </div>
                  
                  {isCrashed && !cashedOut && (
                    <div className="text-red-500 text-xl font-semibold">
                      CRASHED!
                    </div>
                  )}
                  
                  {cashedOut && (
                    <div className="text-green-500 text-xl font-semibold">
                      CASHED OUT! +${profit}
                    </div>
                  )}
                  
                  {!isPlaying && !isCrashed && !cashedOut && (
                    <div className="text-gray-400">
                      Place your bet to start
                    </div>
                  )}
                </div>
              </div>
              
              {/* Graph visualization */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d={`M 0 ${380} Q ${(currentMultiplier - 1) * 100} ${380 - (currentMultiplier - 1) * 50} ${(currentMultiplier - 1) * 200} ${380 - (currentMultiplier - 1) * 100}`}
                  stroke={isCrashed ? '#ef4444' : '#10b981'}
                  strokeWidth="3"
                  fill="none"
                  className="transition-all"
                />
              </svg>
            </div>

            {/* Game History */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sm text-gray-400">Previous:</span>
              <div className="flex gap-2">
                {gameHistory.map((mult, i) => (
                  <Badge
                    key={i}
                    variant={mult < 2 ? 'destructive' : mult < 5 ? 'default' : 'secondary'}
                    className={`${
                      mult < 2 ? 'bg-red-900 text-red-300' : 
                      mult < 5 ? 'bg-gray-700' : 
                      'bg-green-900 text-green-300'
                    }`}
                  >
                    {mult.toFixed(2)}x
                  </Badge>
                ))}
              </div>
            </div>

            {/* Live Bets */}
            <Card className="bg-[#0f212e] border-gray-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium">Live Bets</span>
                <Badge variant="secondary" className="bg-green-900 text-green-300 text-xs">
                  {Math.floor(Math.random() * 100 + 50)} playing
                </Badge>
              </div>
              
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full" />
                      <span className="text-gray-300">Player{i}***</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">${(Math.random() * 100).toFixed(2)}</span>
                      {isPlaying && (
                        <Badge variant="outline" className="border-yellow-500 text-yellow-500 text-xs">
                          Betting
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Card>
        </div>

        {/* Betting Controls */}
        <div>
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Place Bet</h3>
            
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

            {/* Auto Cashout */}
            <div className="mb-6">
              <label className="text-sm text-gray-400 mb-1 block">Auto Cashout</label>
              <div className="relative">
                <Input
                  type="number"
                  value={autoCashout}
                  onChange={(e) => setAutoCashout(e.target.value)}
                  className="bg-[#0f212e] border-gray-700 pr-8"
                  disabled={isPlaying}
                  step="0.1"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">x</span>
              </div>
            </div>

            {/* Action Buttons */}
            {!isPlaying ? (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={handleBet}
                disabled={isCrashed && !cashedOut}
              >
                {isCrashed && !cashedOut ? 'Waiting...' : 'Place Bet'}
              </Button>
            ) : (
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
                onClick={handleCashout}
                disabled={cashedOut || isCrashed}
              >
                {cashedOut ? `Cashed Out ${cashoutMultiplier?.toFixed(2)}x` : 
                 isCrashed ? 'Crashed' : 
                 `Cash Out ${currentMultiplier.toFixed(2)}x`}
              </Button>
            )}

            {/* Potential Profit */}
            {isPlaying && !cashedOut && !isCrashed && (
              <div className="mt-4 p-3 bg-[#0f212e] rounded">
                <p className="text-xs text-gray-400">Potential Profit</p>
                <p className="text-lg font-semibold text-green-500">
                  ${(parseFloat(betAmount) * currentMultiplier - parseFloat(betAmount)).toFixed(2)}
                </p>
              </div>
            )}

            {/* Info */}
            <div className="mt-6 p-3 bg-[#0f212e] rounded flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400">
                  The multiplier increases until it crashes. Cash out before it crashes to win!
                </p>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="bg-[#2f4553] border-gray-700 p-4 mt-4">
            <h3 className="font-semibold mb-3 text-sm">Statistics</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Games Played</span>
                <span>1,234</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Wagered</span>
                <span className="text-yellow-500">$12,345.67</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Profit</span>
                <span className="text-green-500">+$2,345.67</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}