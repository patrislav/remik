
const config = {
  env:  process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  secret: process.env.SECRET_KEY_BASE || 'keyboard cat',

  mongo: {
    uri: process.env.MONGODB_URI ||
         process.env.MONGOLAB_URI ||
         'mongodb://localhost/remikgame_development'
  },

  redis: {
    uri: process.env.REDIS_URI ||
         process.env.REDISCLOUD_URL ||
         'redis://localhost/1'
  },

  fb: {
    appId: process.env.FB_APP_ID,
    appSecret: process.env.FB_APP_SECRET
  },
}

export default config
