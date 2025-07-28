import React from 'react';

function DebugPage() {
  console.log('DebugPage rendering');
  
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: '#f0f0f0', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#333', fontSize: '2rem' }}>🚀 CABANA Debug Page</h1>
      <p style={{ color: '#666', fontSize: '1.2rem' }}>
        If you can see this, the React app is working!
      </p>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        marginTop: '20px',
        border: '1px solid #ddd'
      }}>
        <h2>System Status:</h2>
        <ul>
          <li>✅ React is rendering</li>
          <li>✅ CSS is loading</li>
          <li>✅ JavaScript is executing</li>
          <li>⏳ Time: {new Date().toLocaleTimeString()}</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => alert('JavaScript is working!')}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Test JavaScript
        </button>
      </div>
    </div>
  );
}

export default DebugPage;
