module.exports = {
  method: "GET",
  path: "/articles",
  handler: "articles.find",
  config: {
    middlewares: []
  }
}
