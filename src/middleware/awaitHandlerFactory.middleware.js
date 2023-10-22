const awaitHandlerFactory = (middleware) => {
    return async (c, next) => {
        try {
          return middleware(c, next)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = awaitHandlerFactory;