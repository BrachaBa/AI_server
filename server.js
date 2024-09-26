const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.post('/generate-greeting', async (req, res) => {
  const { eventType, tone, length, language, age } = req.body;
  console.log('Request received:', req.body);

  if (!eventType || !tone || !length || !language) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const prompt = `
    Generate a personalized greeting for a ${eventType} event in ${language}. The greeting should have a ${tone} tone and be ${length} in length.
    ${age ? `This is for someone turning ${age} years old.` : ''}

    Guidelines:
    - Tailor the greeting very specifically to the exact event type
    - If an age is provided, make sure to reference it and tailor the message accordingly
    - Maintain a ${tone} tone throughout the message
    - Ensure the greeting is ${length} as requested
    - Include highly relevant and specific congratulations or well-wishes
    - Avoid generic phrases; make each part of the greeting unique to the event
    - Focus on sincere, heartfelt, and personalized expressions

    Create a cohesive, flowing greeting that feels personal and tailored to the specific event or age.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-2024-08-06',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
    });

    res.json({ greeting: response.choices[0].message.content });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
