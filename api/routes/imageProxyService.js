const Router = require('express-promise-router');
const request = require('request')
const axios = require('axios')

const router = new Router();

module.exports = router;

router.get('/image', async (req, res) => {

  const url = req.query.url;
  request.get(url).pipe(res)
});
