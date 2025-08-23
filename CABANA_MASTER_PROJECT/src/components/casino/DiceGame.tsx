import React, { useState } from 'react';
import { Dice1, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';

export default function DiceGame() {
  const [betAmount, setBetAmount] = useState('10.00');
  const [rollUnder, setRollUnder] = useState(50);
  const [isRolling, setIsRolling] = useState(false);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [profit, setProfit] = useState<number | null>(null);

  const multiplier = (99 / rollUnder).toFixed(4);
  const winChance = rollUnder.toFixed(2);

  const handleRoll = () => {
    setIsRolling(true);
    setTimeout(() => {
      const roll = Math.random() * 100;
      setLastRoll(roll);
      
      if (roll < rollUnder) {
        const winAmount = parseFloat(betAmount) * parseFloat(multiplier);
        setProfit(winAmount - parseFloat(betAmount));
      } else {
        setProfit(-parseFloat(betAmount));
      }
      
      setIsRolling(false);
    }, 1000);
  };

  const handleHalfBet = () => setBetAmount((parseFloat(betAmount) / 2).toFixed(2));
  const handleDoubleBet = () => setBetAmount((parseFloat(betAmount) * 2).toFixed(2));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2">
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            <div className="mb-6">
              <div className="flex items-center justify-center h-64 bg-[#0f212e] rounded-lg relative overflow-hidden">
                {isRolling ? (
                  <div className="animate-spin">
                    <Dice1 className="w-24 h-24 text-green-500" />
                  </div>
                ) : lastRoll !== null ? (
                  <div className="text-center">
                    <div className={`text-6xl font-bold mb-2 ${lastRoll < rollUnder ? 'text-green-500' : 'text-red-500'}`}>
                      {lastRoll.toFixed(2)}
                    </div>
                    <div className={`text-2xl font-semibold ${profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {profit > 0 ? '+' : ''}{profit?.toFixed(2)} USD
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Dice1 className="w-24 h-24 text-gray-600 mb-4" />
                    <p className="text-gray-400">Roll the dice to start playing</p>
                  </div>
                )}
                
                {/* Animated background effect */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-blue-500 animate-pulse" />
                </div>
              </div>
            </div>

            {/* Roll Under Slider */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-400">Roll Under</span>
                <span className="text-sm font-semibold text-green-500">{rollUnder}</span>
              </div>
              <Slider
                value={[rollUnder]}
                onValueChange={(value) => setRollUnder(value[0])}
                min={2}
                max={98}
                step={1}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>2</span>
                <span>50</span>
                <span>98</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#0f212e] rounded p-3">
                <p className="text-xs text-gray-400 mb-1">Multiplier</p>
                <p className="text-lg font-semibold text-yellow-500">{multiplier}x</p>
              </div>
              <div className="bg-[#0f212e] rounded p-3">
                <p className="text-xs text-gray-400 mb-1">Win Chance</p>
                <p className="text-lg font-semibold text-blue-500">{winChance}%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Betting Controls */}
        <div>
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Bet Amount</h3>
            
            <div className="mb-4">
              <div className="relative">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-[#0f212e] border-gray-700 pr-12"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">USD</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={handleHalfBet}
                className="border-gray-700 hover:bg-gray-800"
              >
                1/2
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDoubleBet}
                className="border-gray-700 hover:bg-gray-800"
              >
                2x
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-400 mb-1">Profit on Win</p>
              <p className="text-lg font-semibold text-green-500">
                +{((parseFloat(betAmount) * parseFloat(multiplier)) - parseFloat(betAmount)).toFixed(2)} USD
              </p>
            </div>

            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              onClick={handleRoll}
              disabled={isRolling}
            >
              {isRolling ? 'Rolling...' : 'Roll Dice'}
            </Button>

            {/* Quick Bet Options */}
            <div className="mt-6">
              <p className="text-sm text-gray-400 mb-2">Quick Bet</p>
              <div className="grid grid-cols-3 gap-2">
                {['10', '50', '100'].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setBetAmount(amount + '.00')}
                    className="border-gray-700 hover:bg-gray-800 text-xs"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>
          </Card>

          {/* Game History */}
          <Card className="bg-[#2f4553] border-gray-700 p-4 mt-4">
            <h3 className="font-semibold mb-3 text-sm">Recent Rolls</h3>
            <div className="space-y-1">
              {[87.23, 12.45, 45.67, 92.10, 23.89].map((roll, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="text-xs text-gray-400">#{1000 - i}</span>
                  <span className={`text-xs font-medium ${roll < 50 ? 'text-green-500' : 'text-red-500'}`}>
                    {roll}
                  </span>
                  {roll < 50 ? (
                    <TrendingUp className="w-3 h-3 text-green-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-red-500" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}