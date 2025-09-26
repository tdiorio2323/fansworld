import React from 'react'

const TestPage = () => {
  return (
    <div 
      className="min-h-screen flex items-center justify-center text-white text-center"
      style={{
        background: 'linear-gradient(135deg, #0A0B14 0%, #C77DFF 50%, #FF006E 100%)',
      }}
    >
      <div className="max-w-md">
        <h1 className="text-4xl font-bold mb-4">🎉 SUCCESS!</h1>
        <p className="text-xl mb-4">You made it to the test page!</p>
        <p className="text-white/70">Navigation is working correctly.</p>
        <div className="mt-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-2 border-white rotate-45 rounded-sm mr-3"></div>
            <span className="text-2xl font-light italic">Cabana</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestPage