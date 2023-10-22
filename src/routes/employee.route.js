import { Hono } from 'hono'
const router = new Hono();

const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const employeeController = require('../modules/employee/controllers/employee.controller');


// router.get('/getRoles', awaitHandlerFactory(employeeController.getRoles));
// router.get('/getEmployeeTypes', awaitHandlerFactory(employeeController.getEmployeeTypes));
// router.get('/getDepartments', awaitHandlerFactory(employeeController.getDepartments));
// router.post('/getEmpByStatus', awaitHandlerFactory(employeeController.getEmpByStatus));


router.post('/getEmployees', awaitHandlerFactory(employeeController.getEmployees));
router.post('/updateStatus', awaitHandlerFactory(employeeController.updateStatus));
router.post('/create', awaitHandlerFactory(employeeController.createEmloyee));
router.post('/updateInfo', awaitHandlerFactory(employeeController.updateInfo));
router.get('/getEmployee/:id', awaitHandlerFactory(employeeController.getEmployee));

module.exports = router;