import express from 'express';
import cors from 'cors';
import { popular, newSeason, search, anime, watchAnime } from './scrapper.js'; 

const app = express();
app.use(cors());


app.get('/', (req, res) => {
    res.send('👋 Hello world🌍, Welcome to 🦄 GogoAnime API 🧬 </br> Available routes : /Popular , /NewSeasons , /search/:query , /getAnime/:animeId , /getEpisode/:episodeId');
});

app.get('/Popular/:page', async (req, res) => {
    const result = await popular(req.params.page); 
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4));
});

app.get('/NewSeasons/:page', async (req, res) => {
    const result = await newSeason(req.params.page);
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4));
});

app.get('/search/:query', async (req, res) => {
    const result = await search(req.params.query);
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4));
});

app.get('/getAnime/:query', async (req, res) => {
    const result = await anime(req.params.query);
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4));
});

app.get('/getEpisode/:query', async (req, res) => {
    const result = await watchAnime(req.params.query);
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result, null, 4));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});
