// server.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/repositories/:username', async (req, res) => {
    const { username } = req.params;

    try {
        const userData = await getUserData(username);
        const reposData = await getRepositories(username);

        res.json({ userData, reposData });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

async function getUserData(username) {
    const response = await axios.get(`https://api.github.com/users/${username}`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json',
            'Authorization': `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`
        }
    });

    return response.data;
}

async function getRepositories(username) {
    const response = await axios.get(`https://api.github.com/users/${username}/repos`, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    return response.data;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
