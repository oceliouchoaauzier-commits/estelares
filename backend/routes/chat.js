import express from 'express';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /chat - Send a chat message
router.post('/', async (req, res) => {
  try {
    const { message, conversationId, systemPrompt, model = 'gpt-4-turbo' } = req.body;

    // Validation
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Create chat completion
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'You are a helpful assistant.',
        },
        {
          role: 'user',
          content: message,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content;

    res.json({
      id: uuidv4(),
      conversationId: conversationId || uuidv4(),
      message: assistantMessage,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
