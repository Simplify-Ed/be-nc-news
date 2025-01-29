const {
  fetchAllTopics,
  fetchArticle,
  fetchAllArticles,
} = require("../models/model");
const endpoints = require("../endpoints.json");
const data = require("../db/data/development-data/index");

function getListOfEndpoints(req, res, next) {
  try {
    res.status(200).send({ endpoints: endpoints });
  } catch (err) {
    next(err);
  }
}

function getListOfTopics(req, res, next) {
  return fetchAllTopics()
    .then((topics) => {
      res.status(200).send(topics);
    })
    .catch((err) => {
      next(err);
    });
}

function getArticle(req, res, next) {
  const id = req.params.article_id;

  return fetchArticle(id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => next(err));
}

function getAllArticles(req, res, next) {
  return fetchAllArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
}

module.exports = {
  getListOfEndpoints,
  getListOfTopics,
  getArticle,
  getAllArticles,
};
