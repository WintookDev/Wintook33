process.env.NODE_ENV = process.env.NODE_ENV || 'production'

// process.env.URL_WEBHOOK   = 'https://evabot.wintook.com'
process.env.URL_WEBHOOK   = 'https://devbot.wintook.com'

const environment = require('./environment')

module.exports = environment.toWebpackConfig()
