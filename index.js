const express = require("express");
const Datastore = require("nedb");
const fetch = require("node-fetch");
const app = express();
require('dotenv').config();

app.listen(3000, () => console.log("listening at 3000"));

app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
// Take the data from the client
// set up a routing, JSON Parsing, fetch() to specify a post-request
// Use DB-as-a-service with NeDB, use MongoDB API

const database = new Datastore("database.db");
database.loadDatabase();

app.get('/api', (request, response) => {
    database.find({}, (err, data) => {
        if (err) {
            response.end();
            return;
        }
        response.json(data);
    });
});

app.post("/api", (request, response) => {
    console.log("got a request !");
    const data = request.body;
    data.timestamp = Date.now();
    database.insert(data);
    response.json(data);
});

app.get("/weather/:latlon", async (request, response) => {
    console.log(request.params);
    const latlon = request.params.latlon.split(",");
    console.log(latlon);
    const lat = latlon[0];
    const lon = latlon[1];
    console.log(lat, lon);
    const api_key = process.env.API_KEY
    const weather_url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${api_key}`;
    const weather_response = await fetch(weather_url);
    const weather_json = await weather_response.json();
    const weather_data = {
        lat: lat,
        lon: lon,
        description: weather_json.weather[0].main,
        temp: weather_json.main.temp
    };

    const aq_url = `https://u50g7n0cbj.execute-api.us-east-1.amazonaws.com/v2/latest?limit=1&page=1&offset=0&sort=desc&coordinates=${lat}%2C${lon}&radius=10000&order_by=lastUpdated&dumpRaw=false`
    const aq_response = await fetch(aq_url);
    const aq_data = await aq_response.json();
    console.log(aq_data)
    const data = {
        weather: weather_data,
        air_quality: aq_data
    }
    response.json(data);

});
