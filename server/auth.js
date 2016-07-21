import express from 'express'
import config from './config'
import FB from 'fb'
import User from './models/user'

FB.options({
  appId: config.fb.appId,
  appSecret: config.fb.appSecret,
  version: 'v2.5'
})
const router = express.Router()

// Authenticate the User via FB
router.post('/fb', (req, res) => {
  res.set('Content-Type', 'application/json')

  let accessToken = req.body.accessToken
  if (!accessToken) {
    res.status(500).send(JSON.stringify({ error: 'No access token provided!' }))
    return
  }

  const fields = ['id', 'name', 'first_name', 'last_name']
  FB.withAccessToken(accessToken).napi('me', { fields: fields }, async (error, response) => {
    if (error) {
      res.status(500).send(JSON.stringify({ error: `FB API Error: ${error.message}` }))
    }
    else {
      try {
        let user = await User.findById('fb', response.id)
        if (!user) {
          user = new User({ realm: 'fb', id: response.id })
        }
        user.name = response.name
        user.firstName = response.first_name
        user.lastName = response.last_name
        await user.save()

        req.session.realm = 'fb'
        req.session.fb = { accessToken, user }

        res.send(JSON.stringify(user))
      }
      catch(error) {
        console.log('Error:', error) // eslint-disable-line no-console
      }
    }
  })

})

export default router
