let express = require('express');
let { 
  getAllUsers, 
  createUser, 
  getUser, 
  updateUser, 
  deleteUser,
  updateMe,
  deleteMe,
  getMe 
} = require('./../controllers/userController');

let { 
  signup, 
  login, 
  forgotPassword, 
  resetPassword,
  protect,
  updatePassword 
} = require('./../controllers/authController');

let router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
router.patch('/updateMyPassword', protect, updatePassword);
router.get('/me', protect, getMe, getUser);
router.patch('/updateMe', protect, updateMe);
router.delete('/deleteMe', protect, deleteMe);

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;