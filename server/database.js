
import config from './config'

function database(app, mongoose) {
  mongoose.Promise = Promise

  const options = {
    server: {
      socketOptions: { keepAlive: true }
    },
    auto_reconnect: true
  }

  const connect = function() {
    mongoose.connect(config.mongo.uri, options)
  }

  connect()

  // Error handler
  mongoose.connection.on('error', (error) => {
    console.error('Connection error: ' + error)
  })

  // Reconnect when disconnected
  mongoose.connection.on('disconnected', () => {
    connect()
  })

  return mongoose.connection
}

export default database
