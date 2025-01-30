const endPoints = require("../endpoints.json");
const db = require("../db/connection");
const { commentData } = require("../db/data/development-data");
const comments = require("../db/data/development-data/comments");

function fetchAllTopics() {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
}

function fetchArticle(id) {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [id])
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          error: "Article not found",
          msg: `Article not found for article_id: ${id}`,
        });
      } else {
        return rows[0];
      }
    });
}

function fetchAllArticles() {
  return db
    .query(
      `
    SELECT articles.article_id,
    title,
    topic,
    articles.author,
    articles.created_at,
    articles.votes,
    article_img_url,
    COUNT(comments.comment_id)::INT AS comment_count
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
}

function fetchArticleComments(article_id) {
  if (isNaN(Number(article_id))) {
    return Promise.reject({
      status: 400,
      msg: "Bad request",
    });
  }
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          error: "Article not found",
          msg: `Article not found for article_id: ${article_id}`,
        });
      }
    })
    .then(() => {
      return db
        .query(
          `SELECT 
          comment_id,
          comments.votes,
          comments.created_at,
          comments.author,
          comments.body,
          comments.article_id FROM comments WHERE article_id = $1
          ORDER BY comments.created_at DESC;`,
          [article_id]
        )
        .then(({ rows }) => {
          return rows;
        });
    });
}

module.exports = {
  fetchAllTopics,
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
};
