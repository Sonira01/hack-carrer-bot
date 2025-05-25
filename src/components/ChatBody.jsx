// src/components/ChatBody.jsx
import React from 'react';
import ChatBubble from './ChatBubble';
import chatBg from '../assets/chat-bg-2.jpeg';

const ChatBody = ({ messages }) => (
  <div
    className="chat-body"
    style={{
      backgroundImage: `url(${chatBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
    {messages.map((msg, index) => (
      <ChatBubble key={index} message={msg.text} fromUser={msg.fromUser} />
    ))}
  </div>
);

export default ChatBody;
