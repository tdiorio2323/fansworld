import React, { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function RouletteGame() {
  const [betAmount, setBetAmount] = useState('10.00');
  const [selectedBets, setSelectedBets] = useState<Set<string>>(new Set());
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);

  const numbers = [
    0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10,
    5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26
  ];

  const redNumbers = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  const blackNumbers = [2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35];

  const getNumberColor = (num: number) => {
    if (num === 0) return 'green';
    return redNumbers.includes(num) ? 'red' : 'black';
  };

  const spin = () => {
    setIsSpinning(true);
    const spinResult = numbers[Math.floor(Math.random() * numbers.length)];
    const newRotation = rotation + 720 + Math.random() * 360;
    
    setRotation(newRotation);
    
    setTimeout(() => {
      setResult(spinResult);
      setIsSpinning(false);
      checkWins(spinResult);
    }, 3000);
  };

  const checkWins = (winningNumber: number) => {
    // Check winning bets logic here
    const color = getNumberColor(winningNumber);
    let totalWin = 0;

    selectedBets.forEach(bet => {
      const betValue = parseFloat(betAmount);
      
      if (bet === winningNumber.toString()) {
        totalWin += betValue * 35; // Straight up
      } else if (bet === color) {
        totalWin += betValue * 2; // Color bet
      } else if (bet === 'even' && winningNumber % 2 === 0 && winningNumber !== 0) {
        totalWin += betValue * 2;
      } else if (bet === 'odd' && winningNumber % 2 === 1) {
        totalWin += betValue * 2;
      }
      // Add more bet types...
    });
  };

  const toggleBet = (bet: string) => {
    const newBets = new Set(selectedBets);
    if (newBets.has(bet)) {
      newBets.delete(bet);
    } else {
      newBets.add(bet);
    }
    setSelectedBets(newBets);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Roulette Wheel */}
        <div className="lg:col-span-2">
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                {/* Wheel */}
                <div 
                  className="w-80 h-80 rounded-full bg-gradient-to-r from-red-900 via-black to-red-900 relative transition-transform duration-[3000ms]"
                  style={{ transform: `rotate(${rotation}deg)` }}
                >
                  <div className="absolute inset-4 bg-[#0f212e] rounded-full flex items-center justify-center">
                    <div className="text-center">
                      {isSpinning ? (
                        <RotateCw className="w-12 h-12 animate-spin text-yellow-500" />
                      ) : result !== null ? (
                        <div>
                          <div className={`text-5xl font-bold ${
                            getNumberColor(result) === 'red' ? 'text-red-500' :
                            getNumberColor(result) === 'black' ? 'text-white' :
                            'text-green-500'
                          }`}>
                            {result}
                          </div>
                          <Badge variant="secondary" className="mt-2">
                            {getNumberColor(result).toUpperCase()}
                          </Badge>
                        </div>
                      ) : (
                        <p className="text-gray-400">Place your bets</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2">
                  <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-yellow-500" />
                </div>
              </div>
            </div>

            {/* Betting Table */}
            <div className="bg-[#0f212e] rounded-lg p-4">
              {/* Numbers Grid */}
              <div className="grid grid-cols-12 gap-1 mb-4">
                <div 
                  className="col-span-1 row-span-3 bg-green-800 rounded flex items-center justify-center cursor-pointer hover:bg-green-700"
                  onClick={() => toggleBet('0')}
                >
                  <span className="text-white font-bold">0</span>
                </div>
                
                {[...Array(36)].map((_, i) => {
                  const num = i + 1;
                  const color = getNumberColor(num);
                  return (
                    <button
                      key={num}
                      onClick={() => toggleBet(num.toString())}
                      className={`
                        aspect-square rounded flex items-center justify-center font-semibold text-white
                        ${color === 'red' ? 'bg-red-700 hover:bg-red-600' : 'bg-gray-900 hover:bg-gray-800'}
                        ${selectedBets.has(num.toString()) ? 'ring-2 ring-yellow-500' : ''}
                      `}
                    >
                      {num}
                    </button>
                  );
                })}
              </div>

              {/* Outside Bets */}
              <div className="grid grid-cols-6 gap-2">
                <button
                  onClick={() => toggleBet('red')}
                  className={`bg-red-700 hover:bg-red-600 text-white py-2 rounded font-medium ${
                    selectedBets.has('red') ? 'ring-2 ring-yellow-500' : ''
                  }`}
                >
                  RED
                </button>
                <button
                  onClick={() => toggleBet('black')}
                  className={`bg-gray-900 hover:bg-gray-800 text-white py-2 rounded font-medium ${
                    selectedBets.has('black') ? 'ring-2 ring-yellow-500' : ''
                  }`}
                >
                  BLACK
                </button>
                <button
                  onClick={() => toggleBet('even')}
                  className={`bg-[#1a2c38] hover:bg-[#2f4553] text-white py-2 rounded font-medium ${
                    selectedBets.has('even') ? 'ring-2 ring-yellow-500' : ''
                  }`}
                >
                  EVEN
                </button>
                <button
                  onClick={() => toggleBet('odd')}
                  className={`bg-[#1a2c38] hover:bg-[#2f4553] text-white py-2 rounded font-medium ${
                    selectedBets.has('odd') ? 'ring-2 ring-yellow-500' : ''
                  }`}
                >
                  ODD
                </button>
                <button
                  onClick={() => toggleBet('1-18')}
                  className={`bg-[#1a2c38] hover:bg-[#2f4553] text-white py-2 rounded font-medium ${
                    selectedBets.has('1-18') ? 'ring-2 ring-yellow-500' : ''
                  }`}
                >
                  1-18
                </button>
                <button
                  onClick={() => toggleBet('19-36')}
                  className={`bg-[#1a2c38] hover:bg-[#2f4553] text-white py-2 rounded font-medium ${
                    selectedBets.has('19-36') ? 'ring-2 ring-yellow-500' : ''
                  }`}
                >
                  19-36
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls */}
        <div>
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Place Your Bet</h3>
            
            {/* Bet Amount */}
            <div className="mb-4">
              <label className="text-sm text-gray-400 mb-1 block">Bet Amount</label>
              <div className="relative">
                <Input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  className="bg-[#0f212e] border-gray-700 pr-12"
                  disabled={isSpinning}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">USD</span>
              </div>
            </div>

            {/* Selected Bets */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Selected Bets</p>
              <div className="min-h-[60px] bg-[#0f212e] rounded p-2">
                {selectedBets.size > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {Array.from(selectedBets).map(bet => (
                      <Badge key={bet} variant="secondary" className="bg-yellow-900 text-yellow-300">
                        {bet}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 text-center py-4">No bets selected</p>
                )}
              </div>
            </div>

            {/* Total Bet */}
            <div className="mb-4 p-3 bg-[#0f212e] rounded">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Total Bet</span>
                <span className="font-semibold text-yellow-500">
                  ${(parseFloat(betAmount) * selectedBets.size).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Spin Button */}
            <Button
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
              onClick={spin}
              disabled={isSpinning || selectedBets.size === 0}
            >
              {isSpinning ? 'Spinning...' : 'Spin Wheel'}
            </Button>

            {/* Clear Bets */}
            <Button
              variant="outline"
              className="w-full mt-2 border-gray-700 hover:bg-gray-800"
              onClick={() => setSelectedBets(new Set())}
              disabled={isSpinning}
            >
              Clear All Bets
            </Button>
          </Card>

          {/* Recent Results */}
          <Card className="bg-[#2f4553] border-gray-700 p-4 mt-4">
            <h3 className="font-semibold mb-3 text-sm">Recent Results</h3>
            <div className="flex gap-1 flex-wrap">
              {[14, 0, 23, 8, 31, 17, 25, 2, 19].map((num, i) => (
                <Badge
                  key={i}
                  variant="secondary"
                  className={`
                    ${getNumberColor(num) === 'red' ? 'bg-red-900 text-red-300' :
                      getNumberColor(num) === 'black' ? 'bg-gray-800 text-white' :
                      'bg-green-900 text-green-300'}
                  `}
                >
                  {num}
                </Badge>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}