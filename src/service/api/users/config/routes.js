module.exports = [
  {
    method: "GET",
    path: "/users",
    handler: "user.find",
    config: {
      middlewares: []
    }
  }
]

