
import 'babel-polyfill';
import path from 'path';
import express from 'express';
import session from 'express-session';
import http from 'http';
import socketIO from 'socket.io';
import mongoose from 'mongoose';
import redis from 'redis';
import connectRedis from 'connect-redis';

import config from './config';

import Room from './models/room';

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer);
const redisClient = redis.createClient(config.redis.uri);
const RedisStore = connectRedis(session);

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
});

mongoose.Promise = Promise;

// Connect to the database
console.log(`Connecting to database at ${config.mongo.uri} ... `);
mongoose.connect(config.mongo.uri);
const db = mongoose.connection;

// Whoops, error connecting to the Mongo database
db.on('error', (error) => {
  console.error('Connection error: ' + error);
});

// We're connected to the Mongo database
db.on('open', () => {
  console.log('Connection to the database established!');

  // Express server settings
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // Express Middlewares
  app.use(express.static(path.join(__dirname, 'public')));

  app.use(sessionMiddleware);

  // Routes
  app.get('/',(req, res) => {
    console.log(req.session);
    res.render('index');
  });

  // Socket.IO Middlewares
  io.use(function(socket, next) {
    sessionMiddleware(socket.request, socket.request.res, next)
  });

  // Socket.IO Connection logic
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });

    socket.on('chat message', (message) => {
      let session = socket.request.session;
      if (session.messages) {
        session.messages++;
      } else {
        session.messages = 1;
      }
      session.save();

      io.emit('chat message',`[${session.messages}] ${socket.id}: ${message}`);
    });
  })

  httpServer.listen(config.port, () => {
    console.log(`The server is running at http://localhost:${config.port}`);
  });
})
