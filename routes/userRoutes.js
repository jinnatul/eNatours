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
  updatePassword,
  restrictTo 
} = require('./../controllers/authController');

let router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);
 
// Protect all routes after middleware
router.use(protect);

router.patch('/updateMyPassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateMe', updateMe);
router.delete('/deleteMe', deleteMe);

// Protect all routes after this (Only-Admin) middleware
router.use(restrictTo('admin'));

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;