import { useState } from 'react';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export const useCustomChat = () => {
  const masterUrl = 'http://3.1.200.9:8000';
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages([...messages, userMessage]);

    try {
      const response = await fetch(`${masterUrl}/api/custom_chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const aiMessage: Message = { id: Date.now().toString(), role: 'ai', content: data.reply };

      setMessages([...messages, userMessage, aiMessage]);
      setInput('');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
  };
};
