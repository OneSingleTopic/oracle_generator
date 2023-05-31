const express = require('express');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.static("public"));

let game_icons_json = null;

function game_icons_is_stale() {
    return game_icons_json == null;
}

async function fecth_game_icons() {
    if (game_icons_is_stale()) {
        console.log("Fetching icons json data from https://game-icons.net/sitemaps/icons.json");
        game_icons_json = await fetch("https://game-icons.net/sitemaps/icons.json").then(data => data.json());
    }
    return game_icons_json;
}

app.get('/game_icons', (req, res) => {
    fecth_game_icons().then(data => res.json(data));
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));


