let express = require('express');
let { 
  getAllUsers, 
  createUser, 
  getUser, 
  updateUser, 
  deleteUser 
} = require('./../controllers/userController');

let { signup, login } = require('./../controllers/authController');

let router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.route('/')
  .get(getAllUsers)
  .post(createUser)

router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser)

module.exports = router;