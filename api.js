require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

let mode = 'guide';

function getSystemPrompt() {
  switch (mode) {
    case 'shadow':
      return `You are a wise and fearless spiritual mentor helping the user explore their shadow self. Encourage them to confront hidden fears, past wounds, and unacknowledged aspects of their identity. Be bold yet supportive.`;
    case 'child':
      return `You are a gentle and playful inner child guide. Help the user reconnect with innocence, creativity, and safety. Respond with warmth, curiosity, and compassion.`;
    case 'light':
      return `You are a light-hearted and friendly companion. Engage the user in thoughtful, gentle, and sometimes playful conversation. Ask questions, share interesting reflections, and create a safe space to simply be. Encourage open sharing without pressure for deep self-analysis.`;
    case 'guide':
    default:
      return `You are a compassionate spiritual guide. Help the user explore their inner world through self-reflection, emotional awareness, and gentle questioning. Support healing, integration, and emotional clarity. Use simple, clear language. Reflect back emotions, and encourage connection with the self. Always remain respectful and calming.`;
  }
}

async function askAI(messages) {
  const fullMessages = [
    { role: 'system', content: getSystemPrompt() },
    ...messages,
  ];

  const response = await openai.chat.completions.create({
    model: process.env.VITE_OPENAI_API_MODEL || 'gpt-4o',
    messages: fullMessages,
  });

  return response.choices[0].message.content;
}

function setMode(newMode) {
  mode = newMode;
}

module.exports = { askAI, setMode };