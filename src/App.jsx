// src/App.jsx
import React, { useState, useEffect } from 'react';
import WaveHeader from './components/WaveHeader';
import Header from './components/Header';
import ChatBody from './components/ChatBody';
import InputBar from './components/InputBar';
import './App.css';
import bg from './assets/bg.jpg';
import { FaSearch } from 'react-icons/fa'; 
import Typewriter from './components/Typewriter';
import axios from 'axios';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [inputPlaceholder, setInputPlaceholder] = useState('');
  const [isTypingPaused, setIsTypingPaused] = useState(false);

const handleSend = async () => {
  if (input.trim() === '') return;

  // ✅ Ensure this triggers every time input is sent
  if (!chatStarted) {
    setChatStarted(true);
  }

  const newMessages = [...messages, { text: input, fromUser: true }];
  setMessages(newMessages);
  setInput('');

  try {
    const response = await axios.post('http://localhost:5000/api/chat', {
      userQuery: input,
      history: newMessages.map((msg) => ({
        role: msg.fromUser ? 'user' : 'model',
        content: msg.text
      }))
    });

    setMessages((prev) => [...prev, { text: response.data.response, fromUser: false }]);
  } catch (err) {
    console.error("API Error:", err);
  }
};


  // Pause typewriter if user starts typing
  useEffect(() => {
    if (input.length > 0) {
      setIsTypingPaused(true);
    } else {
      setIsTypingPaused(false);
    }
  }, [input]);

  return (
    <div className="app" style={{ backgroundImage: `url(${bg})` }}>
      {!chatStarted ? (
        <div className="start-screen">
          {!isTypingPaused && (
            <Typewriter
              texts={[
                "What stream you chose?",
                "Which field you want to pursue?",
                "What's your dream job?"
              ]}
              setPlaceholder={setInputPlaceholder}
            />
          )}

          <div className="start-input">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={inputPlaceholder || 'Type your question here...'}
            />
            <button onClick={handleSend}>
              <FaSearch />
            </button>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  );
}

export default App;
