import express from 'express';
import config from './config';
import FB from 'fb';

FB.options({
  appId: config.fb.appId,
  appSecret: config.fb.appSecret,
  version: 'v2.5'
});
const router = express.Router();

// Authenticate the User via FB
router.post('/fb', (req, res) => {
  res.set('Content-Type', 'application/json');

  let accessToken = req.body.accessToken;
  if (!accessToken) {
    res.status(500).send(JSON.stringify({ error: "No access token provided!" }));
    return;
  }

  const fields = ['id', 'name', 'first_name', 'last_name'];
  FB.withAccessToken(accessToken).napi('me', { fields: fields }, (error, response) => {
    if (error) {
      res.status(500).send(JSON.stringify({ error: `FB API Error: ${error.message}` }));
    } else {
      let profile = {
        id: response.id,
        name: response.name,
        firstName: response.first_name,
        lastName: response.last_name
      };
      req.session.realm = 'fb';
      req.session.fb = profile;

      // TODO: Try to retrieve the user and save to databse.

      res.send(JSON.stringify(profile));
    }
  });

});

export default router;
