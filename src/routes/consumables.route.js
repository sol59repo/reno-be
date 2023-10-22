import { Hono } from 'hono'
const router = new Hono();

const consumablesController = require('../modules/consumables/controllers/consumables.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


router.post('/initItems', awaitHandlerFactory(consumablesController.initItems));
router.post('/createItems', awaitHandlerFactory(consumablesController.createItems));
router.post('/getConsumables', awaitHandlerFactory(consumablesController.getConsumables));
router.post('/updateStatus', awaitHandlerFactory(consumablesController.updateStatus));
router.post('/updatePoStatus', awaitHandlerFactory(consumablesController.updatePoStatus));
router.post('/declinePo', awaitHandlerFactory(consumablesController.declinePo));
router.post('/updateInfo', awaitHandlerFactory(consumablesController.updateInfo));
router.post('/getAllPO', awaitHandlerFactory(consumablesController.getAllPO));


module.exports = router;