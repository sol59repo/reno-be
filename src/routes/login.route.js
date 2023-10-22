import { Hono } from 'hono'
const router = new Hono();

const loginController = require('../modules/login/controllers/login.controller');
// const auth = require('../middleware/auth.middleware');

const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

// const { loginAccountSchema,updateloginSchema,validateLogin,verifyEmailSchema,verifyCodeSchema,updatePassSchema,updateAccountSchema} = require('../modules/login/validators/login.validator');


// router.post('/', validateLogin, awaitHandlerFactory(loginController.login)); // localhost:3000/login
router.post('/', awaitHandlerFactory(loginController.login)); // localhost:3000/login


// router.patch('/id/:id', updateloginSchema, awaitHandlerFactory(loginController.updateUser)); //localhost:3000/login/id/1 , using patch for partial update
// router.delete('/id/:id', awaitHandlerFactory(loginController.deleteUser)); // localhost:3000/login/id/1
// router.get('/id/:id',auth(), awaitHandlerFactory(loginController.getUser)); // localhost:3000/login/id/1

// router.post('/checkEmail', validateLogin, awaitHandlerFactory(loginController.checkEmail)); // localhost:3000/login/login
// router.post('/login', validateLogin, awaitHandlerFactory(loginController.userLogin)); // localhost:3000/login/login


// router.post('/verifyEmail',verifyEmailSchema, awaitHandlerFactory(loginController.verifyEmail)); // localhost:3000/login/verifyEmail
// router.post('/verifyCode',verifyCodeSchema, awaitHandlerFactory(loginController.verifyCode)); // localhost:3000/login/verifyCode
// router.post('/updatePass',updateAccountSchema, awaitHandlerFactory(loginController.updatePass)); // localhost:3000/login/updatePass

module.exports = router;