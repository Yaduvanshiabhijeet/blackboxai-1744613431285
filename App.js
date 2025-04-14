import React, { useState } from 'react';
import Dashboard from './Dashboard';
import AIChat from './AIChat';

function App() {
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="relative min-h-screen">
      <Dashboard />
      
      {/* AI Chat Button */}
      <button 
        onClick={() => setShowChat(!showChat)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
      >
        <i className="fas fa-robot text-xl"></i>
      </button>

      {/* AI Chat Panel */}
      {showChat && <AIChat onClose={() => setShowChat(false)} />}
    </div>
  );
}

export default App;
