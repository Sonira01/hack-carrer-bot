// src/App.jsx
import React, { useState } from 'react';
import WaveHeader from './components/WaveHeader';
import Header from './components/Header';
import ChatBody from './components/ChatBody';
import InputBar from './components/InputBar';
import './App.css';
import bg from './assets/bg.jpg';

function App() {
  const [messages, setMessages] = useState([
    { text: 'Hey, man!', fromUser: false },
    { text: 'Are you surfing now?', fromUser: false },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    setMessages([...messages, { text: input, fromUser: true }]);
    setInput('');
  };

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      <div className="phone-frame">
        <WaveHeader />
        <Header />
        <ChatBody messages={messages} />
        <InputBar
          input={input}
          setInput={setInput}
          handleSend={handleSend}
        />
      </div>
    </div>
  );
}

export default App;
