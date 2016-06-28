import 'babel-polyfill'
import path from 'path'
import express from 'express'
import session from 'express-session'
import bodyParser from 'body-parser'
import http from 'http'
import mongoose from 'mongoose'
import redis from 'redis'
import connectRedis from 'connect-redis'

import config from './config'
import database from './database'
import routes from './routes'
import authProvider from './auth'
import sockets from './sockets'

const app = express()
const httpServer = http.createServer(app)
const redisClient = redis.createClient(config.redis.uri)
const RedisStore = connectRedis(session)

const db = database(app, mongoose)
const io = sockets(httpServer)

const sessionMiddleware = session({
  store: new RedisStore({ client: redisClient }),
  secret: config.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    name: 'sid',
    // TODO: enable secure cookies for production!
    // secure: false,
  }
})

// Configure Express app
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, 'views'))

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(sessionMiddleware)

// Routes
app.use('/', routes)
app.use('/auth', authProvider)

// Socket.IO Middlewares
io.use(function(socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next)
})

httpServer.listen(config.port, () => {
  console.log(`The server is running at http://localhost:${config.port}`)
})
