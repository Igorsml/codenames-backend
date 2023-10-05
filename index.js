const express = require("express");
const http = require("http");
const ws = require("ws");
const uuid = require("node-uuid");
const wordsListData = require("./getCards");

const games = {};

const port = 3000;
const app = express();
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/cards", (req, res) => {
  res.status(200).send(wordsListData);
});

const server = http.createServer(app);
const wss = new ws.Server({ server });

function start() {
  app.listen(port, () => {
    console.log(`listening on port ${port}`);
  });

  wss.on("connection", (wsClient) => {
    wsClient.on("message", async (message) => {
      wsClient.id = uuid.v4();

      const req = JSON.parse(message.toString());
      console.log("req:", req);

      if (req.event === "connection") {
        wsClient.nickname = req.payload.username;
        initGames(wsClient, req.payload.gameId);
      }
    });

    broadcast(req);
    console.log("clients:", wss.clients.size);
    wsClient.on("close", () => {
      console.log("User disconnected");
    });
  });
}

start();

function initGames(ws, gameId) {
  if (!games[gameId]) {
    games[gameId] = [ws];
  }
  if (games[gameId] && games[gameId]?.length < defaultGameState.limitPlayers) {
    games[gameId] = [...games[gameId], ws];
  }

  if (games[gameId] && games[gameId].length === 2) {
    games[gameId] = games[gameId].filter((wsc) => wsc.nickname !== ws.nickname);
    games[gameId] = [...games[gameId], ws];
  }
}

function broadcast(props) {
  let res;
  const { username, gameId } = props.payload;

  games[gameId].forEach((client) => {
    switch (props.event) {
      case "connect":
        res = {
          type: "connectToPlay",
          payload: {
            success: true,
            enemyName: games[gameId].find(
              (user) => user.nickname !== client.nickname
            )?.nickname,
            username: client.nickname,
          },
        };
        break;

      case "ready":
        res = {
          type: "readyToPlay",
          payload: { canStart: games[gameId].length > 1, username },
        };
        break;

      case "clickCorrectCard":
        res = {
          type: "afterCardClick",
          payload: props.payload,
        };

      case "killer":
        res = { type: "endGame", payload: props.payload };
        break;

      default:
        res = { type: "logout", payload: props.payload };
        break;
    }

    client.send(JSON.stringify(res));
  });
}
