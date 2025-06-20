// File: ChatUI.jsx
import React, { useEffect, useRef, useState } from 'react';

function ChatUI({ prefs, user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const [hasSystemIntro, setHasSystemIntro] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    window.electronAPI.loadHistory(user).then((history) => {
      const alreadyHasSystem = history.some(msg => msg.role === 'system');
      setHasSystemIntro(alreadyHasSystem);
      setMessages(history);
    });
  }, [user]);

  useEffect(() => {
    if (messages.length > 0) {
      window.electronAPI.saveHistory(user, messages);
    }
  }, [messages, user]);

  const detectTone = (inputText) => {
    if (/\b(sad|tired|overwhelmed|heavy)\b/i.test(inputText)) return 'calm';
    if (/\b(stuck|bored|unfulfilled|numb)\b/i.test(inputText)) return 'creative';
    if (/\b(play|joke|laugh|funny)\b/i.test(inputText)) return 'playful';
    if (/\b(meaning|life|death|soul|universe)\b/i.test(inputText)) return 'philosophical';
    return 'neutral';
  };

  const toneDescriptionMap = {
    calm: "Speak in a calm, gentle, and grounding tone. Use short poetic affirmations.",
    creative: "Respond with imaginative, symbolic language. Use metaphors and creativity.",
    playful: "Use light, friendly language and a touch of humor. Add emojis where it feels natural.",
    philosophical: "Speak in a deep, reflective manner with existential insights.",
    neutral: "Speak with compassionate neutrality."
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages = [
      ...messages,
      { role: 'user', content: input, timestamp }
    ];

    setMessages(newMessages);
    setInput('');

    const detectedTone = detectTone(input);
    const toneDescription = toneDescriptionMap[detectedTone];

    const systemIntro = {
      role: 'system',
      content: `You are a compassionate spiritual guide. The user's name is ${prefs.name}. Their cultural/spiritual background: ${prefs.culture || 'not specified'}. Support them mindfully. ${toneDescription}`
    };

    const messageContext = hasSystemIntro ? newMessages : [systemIntro, ...newMessages];

    try {
      const response = await window.electronAPI.askAI(messageContext);
      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
      if (!hasSystemIntro) setHasSystemIntro(true);
    } catch (err) {
      console.error('AI error:', err);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div ref={chatRef} style={{ height: '65vh', overflowY: 'auto', marginBottom: '1rem', marginTop: '1rem' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: '1.5rem' }}>
            <div><strong>{msg.role === 'user' ? 'You' : msg.role === 'system' ? 'System' : 'Guide'}</strong> • {msg.timestamp}</div>
            <div>{msg.content}</div>
          </div>
        ))}
      </div>

      <textarea
        ref={inputRef}
        rows={2}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Ask your guide..."
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatUI;
