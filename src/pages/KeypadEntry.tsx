import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const KeypadEntry = () => {
  const [enteredCode, setEnteredCode] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDots, setShowDots] = useState(false);
  const navigate = useNavigate();
  
  const correctCode = '420';
  const maxLength = 3;

  useEffect(() => {
    if (enteredCode.length > 0) {
      setShowDots(true);
    }
    
    if (enteredCode.length === maxLength) {
      setTimeout(() => {
        if (enteredCode === correctCode) {
          setIsSuccess(true);
          setTimeout(() => {
            navigate('/studio-home');
          }, 1500);
        } else {
          setIsShaking(true);
          setTimeout(() => {
            setIsShaking(false);
            setEnteredCode('');
            setShowDots(false);
          }, 600);
        }
      }, 300);
    }
  }, [enteredCode, navigate]);

  const handleNumberClick = (number: string) => {
    if (enteredCode.length < maxLength && !isSuccess) {
      setEnteredCode(prev => prev + number);
    }
  };

  const handleClear = () => {
    setEnteredCode('');
    setShowDots(false);
    setIsShaking(false);
  };

  const numbers = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '', '#']
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* 3D Glass Background - matches tdstudiosdigital.com */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%2300d4ff'/%3E%3Cstop offset='50%25' stop-color='%23ff00ff'/%3E%3Cstop offset='100%25' stop-color='%23ffaa00'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23a)' opacity='0.1'/%3E%3C/svg%3E")`
        }}
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-orange-900/20" />
        
        {/* 3D Glass Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-br from-orange-400/20 to-pink-400/20 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-md mx-auto px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Logo/Brand - matches tdstudiosdigital.com style */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Large 3D CABANA Logo */}
          <div className="relative mb-6">
            <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 mb-2 tracking-wider filter drop-shadow-2xl">
              CABANA
            </h1>
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 text-8xl font-black text-cyan-300/20 blur-2xl tracking-wider">
              CABANA
            </div>
          </div>
          <p className="text-gray-400 text-sm tracking-wider">
            Welcome back
          </p>
        </motion.div>

        {/* Keypad Container */}
        <motion.div
          className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl ${
            isShaking ? 'animate-shake' : ''
          }`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {/* Display Screen */}
          <div className="bg-black/50 rounded-2xl p-6 mb-8 border border-white/10">
            <div className="flex justify-center items-center h-16">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-green-400 text-4xl"
                  >
                    ✓
                  </motion.div>
                ) : showDots ? (
                  <motion.div 
                    className="flex space-x-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(maxLength)].map((_, i) => (
                      <motion.div
                        key={i}
                        className={`w-4 h-4 rounded-full border-2 ${
                          i < enteredCode.length
                            ? 'bg-purple-400 border-purple-400 shadow-lg shadow-purple-400/50'
                            : 'border-gray-600'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: i < enteredCode.length ? [0, 1.2, 1] : 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    className="text-gray-500 text-lg"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Enter Code
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Number Keypad */}
          <div className="grid grid-cols-3 gap-4">
            {numbers.flat().map((num, index) => {
              // Skip empty string (where 0 used to be)
              if (num === '') return <div key={index}></div>;
              
              return (
                <motion.button
                  key={index}
                  onClick={() => {
                    if (num !== '*' && num !== '#') {
                      handleNumberClick(num);
                    } else if (num === '*') {
                      handleClear();
                    }
                  }}
                  className={`
                    aspect-square rounded-2xl font-bold text-2xl transition-all duration-200 relative overflow-hidden
                    ${num === '*' || num === '#' 
                      ? 'bg-gradient-to-br from-red-600/80 to-red-700/80 text-white border border-red-500/50 hover:from-red-500/80 hover:to-red-600/80' 
                      : 'bg-gradient-to-br from-white/20 to-white/10 text-white border border-white/20 hover:from-white/30 hover:to-white/20 hover:border-purple-400/50'
                    }
                    ${isSuccess ? 'pointer-events-none opacity-50' : ''}
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 + 0.6 }}
                  disabled={isSuccess}
                >
                  <span className="relative z-10">
                    {num === '*' ? '⌫' : num === '#' ? '⌨' : num}
                  </span>
                  
                  {/* Ripple effect */}
                  <motion.div
                    className="absolute inset-0 bg-white/20 rounded-2xl"
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.1 }}
                  />
                </motion.button>
              );
            })}
            
          </div>
          
          {/* Bottom row with 0 and Auto Entry */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {/* Empty space */}
            <div></div>
            
            {/* 0 Button */}
            <motion.button
              onClick={() => handleNumberClick('0')}
              className="aspect-square rounded-2xl font-bold text-2xl transition-all duration-200 relative overflow-hidden bg-gradient-to-br from-white/20 to-white/10 text-white border border-white/20 hover:from-white/30 hover:to-white/20 hover:border-purple-400/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.0 }}
              disabled={isSuccess || enteredCode.length >= maxLength}
            >
              <span className="relative z-10">0</span>
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-2xl"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
              />
            </motion.button>
            
            {/* Auto Entry Button - Green Arrow */}
            <motion.button
              onClick={() => {
                setEnteredCode('420');
                setTimeout(() => {
                  setIsSuccess(true);
                  setTimeout(() => {
                    navigate('/studio-home');
                  }, 1500);
                }, 300);
              }}
              className="aspect-square rounded-2xl font-bold text-3xl transition-all duration-200 relative overflow-hidden bg-gradient-to-br from-green-600/80 to-green-700/80 text-white border border-green-500/50 hover:from-green-500/80 hover:to-green-600/80"
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(34, 197, 94, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 1.2 }}
              disabled={isSuccess}
            >
              <span className="relative z-10">▶</span>
              
              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 bg-white/20 rounded-2xl"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.1 }}
              />
            </motion.button>
          </div>

          {/* Hint */}
          <motion.p 
            className="text-center text-gray-500 text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            Premium members only • ⌫ to clear
          </motion.p>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="text-green-400 font-semibold mb-2">Access Granted</p>
              <p className="text-gray-400 text-sm">Welcome to Cabana Studios</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Custom shake animation styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default KeypadEntry;