import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import validator from 'validator';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Security middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    credentials: true,
  })
);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Muitas requisições, tente mais tarde.',
});

app.use('/api/', limiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationId, systemPrompt } = req.body;

    // Validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required and must be a string' });
    }

    if (message.length > 5000) {
      return res.status(400).json({ error: 'Message is too long (max 5000 characters)' });
    }

    // Sanitize input
    const sanitizedMessage = validator.trim(validator.escape(message));

    // Check API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Create chat completion
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'Você é um assistente inteligente e prestativo.',
        },
        {
          role: 'user',
          content: sanitizedMessage,
        },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const assistantMessage = response.choices[0]?.message?.content;

    if (!assistantMessage) {
      return res.status(500).json({ error: 'Failed to get response from AI' });
    }

    res.json({
      id: uuidv4(),
      conversationId: conversationId || uuidv4(),
      message: assistantMessage,
      usage: {
        prompt_tokens: response.usage.prompt_tokens,
        completion_tokens: response.usage.completion_tokens,
        total_tokens: response.usage.total_tokens,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);

    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded on OpenAI API' });
    }

    res.status(500).json({
      error: process.env.NODE_ENV === 'development' ? error.message : 'Server error',
    });
  }
});

// Inference endpoint (for custom prompts)
app.post('/api/inference', async (req, res) => {
  try {
    const { prompt, maxTokens = 2000, temperature = 0.7 } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (prompt.length > 10000) {
      return res.status(400).json({ error: 'Prompt is too long' });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: Math.min(parseInt(maxTokens), 4000),
      temperature: Math.min(Math.max(parseFloat(temperature), 0), 2),
    });

    res.json({
      result: response.choices[0]?.message?.content,
      usage: response.usage,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Inference endpoint error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Server error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ESTELARES Backend running on http://localhost:${PORT}`);
  console.log(`📡 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:8000'}`);
  console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
});
