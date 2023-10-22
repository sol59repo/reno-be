import { Hono } from 'hono'
const router = new Hono()

const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const accountController = require("../modules/account/controllers/account.controller");

router.post('/', awaitHandlerFactory(accountController.create));
router.patch('/id/:id', awaitHandlerFactory(accountController.updateUser)); 
router.get('/', awaitHandlerFactory(accountController.userList)); 
router.get('/id/:id', awaitHandlerFactory(accountController.getUser)); 
router.delete('/id/:id', awaitHandlerFactory(accountController.deleteUser));
module.exports = router;
