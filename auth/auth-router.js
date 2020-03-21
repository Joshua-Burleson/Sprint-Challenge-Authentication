const router = require('express').Router();
const { users } = require('../database/models/userModel');
const requestVerify = require('./user-middleware');

router.use(requestVerify);

router.post('/register', async (req, res) => {
  try {
    const insertedUser = await users.insertUser(req.body);
    res.status(201).json(insertedUser);
  }
  catch(err) {
    console.error(err);
    res.status(503).json({'message': 'something went wrong'})
  }
});

router.post('/login', async (req, res) => {
  try {
    const authData = await users.attemptAuth(req.body);
    res.status(200).json({...authData, message: 'Login successful'});
  }
  catch(exc){
    res.status(503).json({'message': exc.message ? exc.message : 'something went wrong'})
  }
});

module.exports = router;
