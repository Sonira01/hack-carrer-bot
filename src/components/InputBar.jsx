// src/components/InputBar.jsx
import React from 'react';

const InputBar = ({ input, setInput, handleSend }) => (
  <div className="input-bar">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleSend()}
      placeholder="Type your message..."
    />
    <button onClick={handleSend}>Send</button>
  </div>
);

export default InputBar;
