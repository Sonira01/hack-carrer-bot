import React from 'react';

export default function ChatBubble({ message, fromUser }) {
  return (
    <div
      style={{
        alignSelf: fromUser ? 'flex-end' : 'flex-start',
        backgroundColor: fromUser ? '#0078ff' : '#2d2d2d',
        color: '#fff',
        padding: '10px 15px',
        borderRadius: '20px',
        maxWidth: '70%',
        margin: '5px 0',
      }}
    >
      {message}
    </div>
  );
}
