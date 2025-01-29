const express = require("express");
const app = express();
const {
  getListOfEndpoints,
  getListOfTopics,
  getArticle,
} = require("./controllers/controller");
const port = 3000;
app.use(express.json());

app.get("/api", getListOfEndpoints);

app.get("/api/topics", getListOfTopics);

app.get("/api/articles/:article_id", getArticle);

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint Not Found" });
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  }
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 404 && err.error === "Article not found") {
    res.status(err.status).send({ msg: err.msg });
  }
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err, "You have not accounted for this error yet!");
  response.status(500).send({ msg: "Internal Server error" });
});

module.exports = app;
