import { Hono } from 'hono'
const router = new Hono()

const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const entities = require("../modules/entities/controllers/entities.controller");

router.get("/", awaitHandlerFactory(entities.getList));
router.post("/", awaitHandlerFactory(entities.store));
router.put("/:id", awaitHandlerFactory(entities.update));
router.get("/:id", awaitHandlerFactory(entities.show));
router.delete("/:id", awaitHandlerFactory(entities.delete));

module.exports = router;
