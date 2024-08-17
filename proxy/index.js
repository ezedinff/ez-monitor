// index.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());


const supabaseAxios = axios.create({
    baseURL: process.env.SUPABASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.SUPABASE_KEY}`,
        'Content-Type': 'application/json',
    },
});

app.post('/report', async (req, res) => {
  const api_key = req.headers['x-api-key'];
  try {
    if (!api_key) {
      throw new Error('Missing API key');
    }
    const response = await supabaseAxios.post('/functions/create-report', { ...req.body, api_key });
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).send(error.message);
  }
});


app.listen(port, () => {
  console.log(`Proxy API listening at http://localhost:${port}`);
});
