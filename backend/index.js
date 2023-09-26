const express = require("express");
const http = require("http");
const ws = require("ws");

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  // создаем маршрут для главной страницы
  res.send("Hello World!"); // отправляем ответ на запрос
});

app.listen(port, () => {
  console.log("listening on port 3000");
});

const server = http.createServer(app);
const wss = new ws.Server({ server });

wss.on("connection", () => {
  console.log("connection");
});

wss.on("close", () => {
  console.log("User disconnected");
});
