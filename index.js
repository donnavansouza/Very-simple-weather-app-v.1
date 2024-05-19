import axios from "axios";
import bodyParser from "body-parser";
import express from "express";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.post("/", async (req, res) => {
  const city = req.body.city;
  const state = req.body.state || '';
  const country = req.body.country || '';
  const apiKey = process.env.API_KEY;
  console.log(req.body);
  try {
    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},${country}&appid=${apiKey}`
    );
    console.log(response.data);
    const lat = response.data[0].lat;
    const lon = response.data[0].lon;
    const weatherData = await axios.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m`
    );
    console.log(weatherData.data);
    res.render("index.ejs", { data: weatherData.data });
  } catch (error) {
    console.error(error);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
