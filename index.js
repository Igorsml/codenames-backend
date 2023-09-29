const express = require("express");
const http = require("http");
const ws = require("ws");
const wordsList = require("./wordsList");
console.log("wordsList:", wordsList);

const port = 3000;
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/cards", (req, res) => {
  function shuffleArray(array) {
    array.forEach((_, i) => {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    });
  }
  shuffleArray(wordsList);

  res.send(wordsList);
});

app.listen(port, () => {
  console.log("listening on port 3000");
});

const server = http.createServer(app);
const wss = new ws.Server({ server });

wss.on("connection", () => {
  console.log("connection");
});

wss.on("onmessage ", () => {
  console.log("on message");
});

wss.on("close", () => {
  console.log("User disconnected");
});
