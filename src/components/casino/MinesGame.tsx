import React, { useState } from 'react';
import { Bomb, Gem, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export default function MinesGame() {
  const [betAmount, setBetAmount] = useState('10.00');
  const [minesCount, setMinesCount] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [grid, setGrid] = useState<Array<{revealed: boolean, hasMine: boolean, isGem: boolean}>>([]);
  const [gameOver, setGameOver] = useState(false);
  const [cashoutAmount, setCashoutAmount] = useState(0);
  const [gemsFound, setGemsFound] = useState(0);

  const gridSize = 25; // 5x5 grid
  const totalGems = gridSize - minesCount;

  const initializeGame = () => {
    const newGrid = Array(gridSize).fill(null).map(() => ({
      revealed: false,
      hasMine: false,
      isGem: false,
    }));

    // Place mines randomly
    const minePositions = new Set<number>();
    while (minePositions.size < minesCount) {
      minePositions.add(Math.floor(Math.random() * gridSize));
    }

    minePositions.forEach(pos => {
      newGrid[pos].hasMine = true;
    });

    // Mark gems
    newGrid.forEach((cell, i) => {
      if (!cell.hasMine) cell.isGem = true;
    });

    setGrid(newGrid);
    setIsPlaying(true);
    setGameOver(false);
    setGemsFound(0);
    updateCashout(0);
  };

  const updateCashout = (gems: number) => {
    const multiplier = calculateMultiplier(gems);
    setCashoutAmount(parseFloat(betAmount) * multiplier);
  };

  const calculateMultiplier = (gems: number) => {
    if (gems === 0) return 1;
    const baseMultiplier = 1 + (minesCount * 0.1);
    return baseMultiplier * Math.pow(1.2, gems);
  };

  const revealCell = (index: number) => {
    if (!isPlaying || grid[index].revealed || gameOver) return;

    const newGrid = [...grid];
    newGrid[index].revealed = true;

    if (newGrid[index].hasMine) {
      // Game Over - reveal all mines
      newGrid.forEach(cell => {
        if (cell.hasMine) cell.revealed = true;
      });
      setGrid(newGrid);
      setGameOver(true);
      setIsPlaying(false);
      setCashoutAmount(0);
    } else {
      // Found a gem
      const newGemsFound = gemsFound + 1;
      setGemsFound(newGemsFound);
      setGrid(newGrid);
      updateCashout(newGemsFound);

      // Check if all gems found
      if (newGemsFound === totalGems) {
        setIsPlaying(false);
        // Win bonus for finding all gems
        setCashoutAmount(parseFloat(betAmount) * calculateMultiplier(newGemsFound) * 1.5);
      }
    }
  };

  const cashout = () => {
    if (isPlaying && gemsFound > 0) {
      setIsPlaying(false);
      // Reveal all cells
      const newGrid = grid.map(cell => ({ ...cell, revealed: true }));
      setGrid(newGrid);
    }
  };

  const currentMultiplier = calculateMultiplier(gemsFound);
  const nextMultiplier = calculateMultiplier(gemsFound + 1);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Game Area */}
        <div className="lg:col-span-2">
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            {/* Mines Grid */}
            <div className="mb-6">
              <div className="grid grid-cols-5 gap-2 max-w-md mx-auto">
                {grid.map((cell, i) => (
                  <button
                    key={i}
                    onClick={() => revealCell(i)}
                    disabled={!isPlaying || cell.revealed}
                    className={`
                      aspect-square rounded-lg transition-all duration-300 transform
                      ${!cell.revealed ? 'bg-[#0f212e] hover:bg-[#1a3344] hover:scale-105 cursor-pointer' : ''}
                      ${cell.revealed && cell.hasMine ? 'bg-red-900' : ''}
                      ${cell.revealed && cell.isGem ? 'bg-green-900' : ''}
                      ${!isPlaying && !cell.revealed ? 'opacity-50' : ''}
                    `}
                  >
                    {cell.revealed && (
                      <div className="flex items-center justify-center h-full">
                        {cell.hasMine ? (
                          <Bomb className="w-8 h-8 text-red-500" />
                        ) : (
                          <Gem className="w-8 h-8 text-green-500" />
                        )}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Game Info */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-[#0f212e] rounded p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Gems Found</p>
                <p className="text-lg font-semibold text-green-500">{gemsFound}/{totalGems}</p>
              </div>
              <div className="bg-[#0f212e] rounded p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Current Multiplier</p>
                <p className="text-lg font-semibold text-yellow-500">{currentMultiplier.toFixed(2)}x</p>
              </div>
              <div className="bg-[#0f212e] rounded p-3 text-center">
                <p className="text-xs text-gray-400 mb-1">Next Multiplier</p>
                <p className="text-lg font-semibold text-blue-500">{nextMultiplier.toFixed(2)}x</p>
              </div>
            </div>

            {/* Status Message */}
            {gameOver && (
              <div className="bg-red-900/20 border border-red-800 rounded p-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-semibold text-red-500">Game Over!</p>
                  <p className="text-sm text-gray-400">You hit a mine and lost your bet.</p>
                </div>
              </div>
            )}

            {!isPlaying && !gameOver && cashoutAmount > 0 && (
              <div className="bg-green-900/20 border border-green-800 rounded p-4">
                <p className="font-semibold text-green-500">Success!</p>
                <p className="text-sm text-gray-400">
                  You cashed out ${cashoutAmount.toFixed(2)} ({currentMultiplier.toFixed(2)}x)
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Controls */}
        <div>
          <Card className="bg-[#2f4553] border-gray-700 p-6">
            <h3 className="font-semibold mb-4">Game Controls</h3>
            
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

            {/* Mines Count */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <label className="text-sm text-gray-400">Mines</label>
                <span className="text-sm font-semibold text-red-500">{minesCount}</span>
              </div>
              <Slider
                value={[minesCount]}
                onValueChange={(value) => setMinesCount(value[0])}
                min={1}
                max={24}
                step={1}
                disabled={isPlaying}
                className="mb-2"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>1</span>
                <span>12</span>
                <span>24</span>
              </div>
            </div>

            {/* Potential Profit */}
            {isPlaying && (
              <div className="mb-4 p-3 bg-[#0f212e] rounded">
                <p className="text-xs text-gray-400 mb-1">Potential Cashout</p>
                <p className="text-lg font-semibold text-green-500">
                  ${cashoutAmount.toFixed(2)}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            {!isPlaying ? (
              <Button
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
                onClick={initializeGame}
              >
                Start Game
              </Button>
            ) : (
              <Button
                className="w-full bg-orange-600 hover:bg-orange-700"
                size="lg"
                onClick={cashout}
                disabled={gemsFound === 0}
              >
                Cashout ${cashoutAmount.toFixed(2)}
              </Button>
            )}

            {/* Game Info */}
            <div className="mt-6 p-3 bg-[#0f212e] rounded">
              <h4 className="text-sm font-medium mb-2">How to Play</h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Click tiles to reveal gems or mines</li>
                <li>• Find gems to increase your multiplier</li>
                <li>• Hit a mine and lose everything</li>
                <li>• Cash out anytime to secure profits</li>
              </ul>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="bg-[#2f4553] border-gray-700 p-4 mt-4">
            <h3 className="font-semibold mb-3 text-sm">Game Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Games Played</span>
                <span>234</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Mines Hit</span>
                <span className="text-red-500">87</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Perfect Games</span>
                <span className="text-green-500">12</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Best Multiplier</span>
                <span className="text-yellow-500">128.5x</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}