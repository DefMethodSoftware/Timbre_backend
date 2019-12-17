const express = require('express');
const User = require('../models/User')
const Passport = require('passport')

const router = express.Router();

router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateJWT()
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }

})

router.post('/login',
  passport.authenticate('local'),
  function(req, res) {
    let token = req.user.generateJWT()
    res.body = { 'Token': token}
  })

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

module.exports = router;
