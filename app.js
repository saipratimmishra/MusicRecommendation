const express = require('express');
const app = express();
const axios = require('axios');
const env=require('dotenv').config();
app.use(express.json());
app.use(express.static('public'));
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
let access_token = null;

async function getSpotifyAccessToken() {
  const body = `grant_type=client_credentials&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}`;
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    access_token = response.data.access_token;
    return access_token;
  } catch (error) {
    console.error('Access token fetch failed');
  }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post('/mood', async (req, res) => {
  if (!access_token)
    { await getSpotifyAccessToken();
    }

  try {
    const moodToGenre = {
      Happy: "happy upbeat",
      Sad: "sad acoustic",
      Angry: "metal rock",
      Stressed: "chill lofi",
      Tired: "sleep ambient"
    };
    let mood = moodToGenre[req.body.mood]===undefined?req.body.mood:moodToGenre[req.body.mood] ;
    let language=req.body.language;
    console.log(language)
    console.log(mood)
    const result = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(mood+" "+language)}&type=track`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    res.json(result.data.tracks);
  } catch (err) {
    console.error("API Error:");
    res.status(500).send("TOO MANY ATTEMPTS");
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
