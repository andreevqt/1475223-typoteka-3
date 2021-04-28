module.exports = [
  {
    method: "GET",
    path: "/articles",
    handler: "article.find",
    config: {
      middlewares: []
    }
  }
]

