import React, { useState, useEffect } from 'react';
import { Circle, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function PlinkoGame() {
  const [betAmount, setBetAmount] = useState('10.00');
  const [risk, setRisk] = useState<'low' | 'medium' | 'high'>('medium');
  const [rows, setRows] = useState(12);
  const [isDropping, setIsDropping] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 });
  const [lastWin, setLastWin] = useState<number | null>(null);

  const multipliers = {
    low: {
      8: [5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
      12: [8.9, 3, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 3, 8.9],
      16: [16, 9, 2, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 2, 9, 16],
    },
    medium: {
      8: [13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
      12: [33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
      16: [110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
    },
    high: {
      8: [29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
      12: [170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 2, 8.1, 24, 170],
      16: [1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
    },
  };

  const currentMultipliers = multipliers[risk][rows as 8 | 12 | 16] || multipliers[risk][12];

  const dropBall = () => {
    setIsDropping(true);
    setBallPosition({ x: 50, y: 0 });
    setLastWin(null);

    // Simulate ball physics
    let currentX = 50;
    let currentY = 0;
    const dropInterval = setInterval(() => {
      currentY += 5;
      currentX += (Math.random() - 0.5) * 10;
      currentX = Math.max(0, Math.min(100, currentX));
      
      setBallPosition({ x: currentX, y: currentY });

      if (currentY >= 100) {
        clearInterval(dropInterval);
        
        // Calculate which slot the ball landed in
        const slotIndex = Math.floor((currentX / 100) * currentMultipliers.length);
        const multiplier = currentMultipliers[slotIndex];
        const winAmount = parseFloat(betAmount) * multiplier;
        
        setLastWin(winAmount);
        setIsDropping(false);
      }
    }, 50);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2">
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            {/* Plinko Board */}
            <div className="relative bg-[#0f212e] rounded-lg p-4 mb-6" style={{ minHeight: '500px' }}>
              {/* Pegs */}
              <div className="absolute inset-4">
                {Array.from({ length: rows }, (_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex justify-center gap-4"
                    style={{ marginTop: `${(100 / rows) * rowIndex}%` }}
                  >
                    {Array.from({ length: rowIndex + 3 }, (_, pegIndex) => (
                      <div
                        key={pegIndex}
                        className="w-2 h-2 bg-gray-600 rounded-full"
                      />
                    ))}
                  </div>
                ))}
              </div>

              {/* Ball */}
              {isDropping && (
                <div
                  className="absolute w-4 h-4 bg-yellow-500 rounded-full transition-all duration-100 z-10"
                  style={{
                    left: `${ballPosition.x}%`,
                    top: `${ballPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                />
              )}

              {/* Multiplier Slots */}
              <div className="absolute bottom-0 left-0 right-0 flex">
                {currentMultipliers.map((mult, i) => (
                  <div
                    key={i}
                    className={`flex-1 text-center py-2 text-xs font-semibold border-t-2 ${
                      mult >= 10 ? 'bg-yellow-900 text-yellow-300 border-yellow-600' :
                      mult >= 2 ? 'bg-green-900 text-green-300 border-green-600' :
                      mult >= 1 ? 'bg-gray-800 text-gray-300 border-gray-600' :
                      'bg-red-900 text-red-300 border-red-600'
                    }`}
                  >
                    {mult}x
                  </div>
                ))}
              </div>
            </div>

            {/* Last Win Display */}
            {lastWin !== null && (
              <div className="bg-[#0f212e] rounded p-4 text-center">
                <p className="text-sm text-gray-400 mb-1">You Won</p>
                <p className={`text-2xl font-bold ${lastWin >= parseFloat(betAmount) ? 'text-green-500' : 'text-red-500'}`}>
                  ${lastWin.toFixed(2)}
                </p>
              </div>
            )}
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
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">USD</span>
              </div>
            </div>

            {/* Risk Level */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-2 block">Risk Level</label>
              <RadioGroup value={risk} onValueChange={(value) => setRisk(value as typeof risk)}>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="text-green-500">Low</Label>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="text-yellow-500">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="text-red-500">High</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Rows */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Rows</label>
                <span className="text-sm font-semibold">{rows}</span>
              </div>
              <Slider
                value={[rows]}
                onValueChange={(value) => setRows(value[0])}
                min={8}
                max={16}
                step={4}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>8</span>
                <span>12</span>
                <span>16</span>
              </div>
            </div>

            {/* Drop Button */}
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              onClick={dropBall}
              disabled={isDropping}
            >
              <Play className="w-4 h-4 mr-2" />
              {isDropping ? 'Dropping...' : 'Drop Ball'}
            </Button>

            {/* Auto Mode */}
            <div className="mt-6 p-3 bg-[#0f212e] rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Auto Mode</span>
                <Button variant="outline" size="sm" className="border-gray-700 hover:bg-gray-800">
                  Configure
                </Button>
              </div>
              <p className="text-xs text-gray-400">
                Automatically drop balls with preset conditions
              </p>
            </div>
          </Card>

          {/* Game Stats */}
          <Card className="bg-[#2f4553] border-gray-700 p-4 mt-4">
            <h3 className="font-semibold mb-3 text-sm">Session Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Balls Dropped</span>
                <span>47</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Total Wagered</span>
                <span className="text-yellow-500">$470.00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Net Profit</span>
                <span className="text-green-500">+$125.50</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Biggest Win</span>
                <span className="text-blue-500">170x</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}