const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const socket = require("socket.io-client/lib/socket");
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require("dotenv").config({ path: "./config.env" });
const connectDb = require("./utilsServer/connectDb");
connectDb();
app.use(express.json());
const PORT = process.env.PORT || 3000;
const { addUser, removeUser } = require("./utilsServer/roomActions");
const { loadMessages } = require("./utilsServer/messageActions");

io.on("connection", (socket) => {
  socket.on("join", async ({ userId }) => {
    const users = await addUser(userId, socket.id);
    console.log(users);

    setInterval(() => {
      socket.emit("connectedUsers", {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 10000);
  });

  socket.on("loadMessages", async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith);

    if (!error) {
      socket.emit("messagesLoaded", { chat });
    }
  });

  socket.on("remove", () => removeUser(socket.id));
});

nextApp.prepare().then(() => {
  app.use("/api/search", require("./api/search"));
  app.use("/api/chats", require("./api/chats"));
  app.use("/api/notifications", require("./api/notifications"));
  app.use("/api/signup", require("./api/signup"));
  app.use("/api/profile", require("./api/profile"));
  app.use("/api/posts", require("./api/posts"));
  app.use("/api/auth", require("./api/auth"));

  app.all("*", (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Express server running");
  });
});
