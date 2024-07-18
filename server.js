const express = require('express');
const dotenv = require('dotenv');
const OpenAI = require('openai');
const cors = require('cors'); // הוספת cors


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors()); // שימוש ב-cors
app.use(express.json());

// POST endpoint to handle user requests
app.post('/generate-greeting', async (req, res) => {
  const { eventType, tone, length, language } = req.body;

  // Validate required fields
  if (!eventType || !tone || !length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Validate age if eventType is birthday
//   if (eventType === 'birthday' && !age) {
//     return res.status(400).json({ error: 'Age is required for birthday' });
//   }

  try {
    // Constructing the prompt based on user inputs
    const prompt = `Write a greeting for ${eventType} with a ${tone} tone and ${length} length in ${language}`;

    // if (eventType === 'birthday') {
    //     prompt += ` for someone turning ${age}`;
    //   }
    //   prompt += '.';
  

    // Calling OpenAI API to generate the greeting
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
    });

    console.log(response);

    // Sending the generated greeting back to the client
    res.json({ greeting: response.choices[0].message.content });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
