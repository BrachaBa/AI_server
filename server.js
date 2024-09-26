// const express = require('express');
// const dotenv = require('dotenv');
// const OpenAI = require('openai');
// const cors = require('cors'); // הוספת cors


// dotenv.config();

// const app = express();
// const port = process.env.PORT || 3000;

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// app.use(cors()); // שימוש ב-cors
// app.use(express.json());

// // POST endpoint to handle user requests
// app.post('/generate-greeting', async (req, res) => {
//   const { eventType, tone, length, language } = req.body;

//   // Validate required fields
//   if (!eventType || !tone || !length) {
//     return res.status(400).json({ error: 'Missing required fields' });
//   }

//   // Validate age if eventType is birthday
// //   if (eventType === 'birthday' && !age) {
// //     return res.status(400).json({ error: 'Age is required for birthday' });
// //   }

//   try {
//     // Constructing the prompt based on user inputs
//     const prompt = `Write a greeting for ${eventType} with a ${tone} tone and ${length} length in ${language}`;

//     // if (eventType === 'birthday') {
//     //     prompt += ` for someone turning ${age}`;
//     //   }
//     //   prompt += '.';


//     // Calling OpenAI API to generate the greeting
//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: prompt }],
//       max_tokens: 250,
//     });

//     console.log(response);

//     // Sending the generated greeting back to the client
//     res.json({ greeting: response.choices[0].message.content });
//   } catch (error) {
//     console.error('Error occurred:', error);
//     res.status(500).json({ error: 'Something went wrong' });
//   }
// });

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
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
  const { eventType, tone, length, language } = req.body;
  console.log('Request received:', req.body);  // הוספת לוגים

  if (!eventType || !tone || !length || !language) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // const prompt = `Write a greeting for ${eventType} with a ${tone} tone and ${length} length in ${language}`;
    // const prompt = `
    // Generate a greeting option for ${eventType} in ${language}. The greeting should have a ${tone} tone and be ${length} in length. Format the greeting as follows:

    // [Personal opening on a separate line]

    // [Event-specific content, well-wishes for the future, and closing statement, each in separate, logically divided paragraphs]

    // Guidelines:
    // - Use rich and expressive language appropriate for the ${tone} tone
    // - Include relevant imagery or metaphors suitable for the ${eventType}
    // - Ensure the greeting is original, heartfelt, and memorable
    // - Adapt the content to be culturally appropriate for ${language}
    // - Do not use colons after the personal opening
    // - Use line breaks to separate different sections of the greeting
    // `;    

    const prompt = `
  Generate a personalized greeting for a ${eventType} event in ${language}. The greeting should have a ${tone} tone and be ${length} in length.
  ${eventType === 'birthday' ? `This is for someone turning ${age} years old.` : ''}
  ${eventType === 'other' ? `This is for a custom event: "${customEvent}". Be very specific to this unique event.` : ''}
  
  Guidelines:
  - Tailor the greeting very specifically to the exact event type or custom event
  - If it's a birthday, make sure to reference the age and tailor the message accordingly
  - Maintain a ${tone} tone throughout the message
  - Ensure the greeting is ${length} as requested
  - Include highly relevant and specific congratulations or well-wishes
  - Avoid generic phrases; make each part of the greeting unique to the event
  - Focus on sincere, heartfelt, and personalized expressions
  
  Create a cohesive, flowing greeting that feels personal and tailored to the specific event or age.
  `;

    const response = await openai.chat.completions.create({
      // model: 'gpt-4o',
      model: 'gpt-4o-2024-08-06',
      // model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 250,
    });

    console.log('Response from OpenAI:', response);

    res.json({ greeting: response.choices[0].message.content });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Something went wrong', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
