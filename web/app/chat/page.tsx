'use client';
import React, { useEffect, useState } from 'react';
import { useCustomChat } from './useCustomChat';
import { useChat } from 'ai/react';
import './style.css';

export default function Chat() {
  // const { messages, input, handleSubmit, handleInputChange, isLoading } =
  //   useChat({
  //     // api: '/api/chat?protocol=text',
  //     streamProtocol: 'text',
  //   });
  const { messages, input, handleSubmit, handleInputChange } = useCustomChat();
  const [ startMessage, setStartMessage ] = React.useState('');
  const masterUrl = process.env.MASTER_URL;

  useEffect(() => {
    
    const getStartMessage = async () => {
      const response = await fetch(`${masterUrl}/api/get_initial_advice`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      setStartMessage(data.message);
    }
    getStartMessage();
  }, []);
    
  return (
    <>
      <div className="header">
          <h1>Money Clinic</h1>
      </div>
      <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch chat">
      <div className='message aiMessage'>
          <div className='message-role font-bold'>พี่หมอ</div>
          <div className='message-content text-gray-600'>สวัสดีค่ะ</div>
        </div>
        { startMessage !== '' && (<div className='message aiMessage'>
          <div className='message-role font-bold'>พี่หมอ</div>
          <div className='message-content text-gray-600'>{ startMessage }</div>
        </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={`message ${m.role === 'user' ? 'userMessage' : 'aiMessage'}`}>
            <div className='message-role font-bold'>{m.role === 'user' ? 'คนไข้' : 'พี่หมอ'}</div>
            <div className='message-content text-gray-600'>{m.content}</div>
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
    </>
  );
}

