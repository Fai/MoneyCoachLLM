'use client';
import React from 'react';
import { useCustomChat } from './useCustomChat';
import './style.css';

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useCustomChat();
  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(m => (
        <div key={m.id} className={`message ${m.role === 'user' ? 'userMessage' : 'aiMessage'}`}>
          <div className='font-bold'>{m.role === 'user' ? 'User: ' : 'AI: '}</div>
          <div className='text-gray-600'>{m.content}</div>
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}