import { Hono } from 'hono'
const router = new Hono()

const awaitHandlerFactory = require("../middleware/awaitHandlerFactory.middleware");
const modelController = require("../modules/model/controllers/model.controller");

router.get('/matterportmodels', awaitHandlerFactory(modelController.getMatterportModels)); //converted
router.post('/addProject', awaitHandlerFactory(modelController.addProject)); //converted
router.post('/AddToProject', awaitHandlerFactory(modelController.AddToProject)); //converted
router.post('/saveModelChanges', awaitHandlerFactory(modelController.saveModelChanges));
router.post('/getProjects', awaitHandlerFactory(modelController.getProjects)); //converted
router.post('/updateStatus', awaitHandlerFactory(modelController.updateStatus)); // converted
router.post('/updateSpaceStatus', awaitHandlerFactory(modelController.updateSpaceStatus)); //converted
router.post('/updateAttendanceAvailability', awaitHandlerFactory(modelController.updateAttendanceAvailability));
router.get('/getMeasurements/:id', awaitHandlerFactory(modelController.getMeasurements));
router.get('/getLocationName/:id', awaitHandlerFactory(modelController.getLocationName)); //converted
router.get('/getComments/:id', awaitHandlerFactory(modelController.getComments));
router.get('/getCardActivities/:id', awaitHandlerFactory(modelController.getCardActivities));
router.get('/getcommentsMembers/:id', awaitHandlerFactory(modelController.getcommentsMembers));
router.get('/geticketCardMembers/:id', awaitHandlerFactory(modelController.geticketCardMembers));
router.get('/getObjStatus/:id', awaitHandlerFactory(modelController.getObjStatus));
router.get('/getAsignedStaff/:id', awaitHandlerFactory(modelController.getAsignedStaff)); // converted
router.get('/getSingleAttendance/:id', awaitHandlerFactory(modelController.getSingleAttendance)); //converted
router.get('/getSingleAttendanceLogs/:id', awaitHandlerFactory(modelController.getSingleAttendanceLogs));
router.get('/getAsignedManager/:id', awaitHandlerFactory(modelController.getAsignedManager)); //converted
router.get('/getAsignedMaterials/:id', awaitHandlerFactory(modelController.getAsignedMaterials)); //converted
router.get('/getProject/:id', awaitHandlerFactory(modelController.getProject)); //converted
router.get('/getProjectSpace/:id', awaitHandlerFactory(modelController.getProjectSpace)); // converted
router.get('/getAllStaffs', awaitHandlerFactory(modelController.getAllStaffs)); //converted
router.post('/getAttendance', awaitHandlerFactory(modelController.getAttendance)); //converted
router.post('/getEmployeesAttendance', awaitHandlerFactory(modelController.getEmployeesAttendance)); //converted
router.post('/getEmployeeAttendance', awaitHandlerFactory(modelController.getEmployeeAttendance));
router.get('/getAllManagers', awaitHandlerFactory(modelController.getAllManagers)); //converted
router.get('/getAllMaterials', awaitHandlerFactory(modelController.getAllMaterials)); //converted
router.post('/sendComment', awaitHandlerFactory(modelController.sendComment));
router.post('/sendTicketCardComment', awaitHandlerFactory(modelController.sendTicketCardComment));
router.post('/sendStatus', awaitHandlerFactory(modelController.sendStatus));
router.post('/sendTicketCardStatus', awaitHandlerFactory(modelController.sendTicketCardStatus));
router.post('/sendMembers', awaitHandlerFactory(modelController.sendMembers));
router.post('/sendticketCardMembers', awaitHandlerFactory(modelController.sendticketCardMembers));
router.post('/initComments', awaitHandlerFactory(modelController.initComments));
router.post('/asignStaff', awaitHandlerFactory(modelController.asignStaff)); // converted
router.post('/addMaterial', awaitHandlerFactory(modelController.addMaterial));
router.post('/qtyUpdate', awaitHandlerFactory(modelController.qtyUpdate));//converted
router.post('/updateAsignmentStatus', awaitHandlerFactory(modelController.updateAsignmentStatus)); //converted
router.post('/updateAdeddConsumableStatus', awaitHandlerFactory(modelController.updateAdeddConsumableStatus));
router.post('/submitAction', awaitHandlerFactory(modelController.submitAction));
router.post('/submitBulkActions', awaitHandlerFactory(modelController.submitBulkActions));
router.post('/submitBulkActionsLeaveOrAbsent', awaitHandlerFactory(modelController.submitBulkActionsLeaveOrAbsent));
router.post('/addAttendanceData', awaitHandlerFactory(modelController.addAttendanceData)); //converted
router.post('/addTicket', awaitHandlerFactory(modelController.addTicket));
router.get('/getTickets/:id', awaitHandlerFactory(modelController.getTickets));
router.post('/addCardList', awaitHandlerFactory(modelController.addCardList)); //converted
router.post('/addCard', awaitHandlerFactory(modelController.addCard));
router.post('/updateCardListSequence', awaitHandlerFactory(modelController.updateCardListSequence));
router.post('/updateCardInListSequence', awaitHandlerFactory(modelController.updateCardInListSequence));
router.post('/updateCard', awaitHandlerFactory(modelController.updateCard));
router.post('/updateCardInfo', awaitHandlerFactory(modelController.updateCardInfo));
router.post('/renameList', awaitHandlerFactory(modelController.renameList));
router.get('/getCardLists/:id', awaitHandlerFactory(modelController.getCardLists)); //converted
router.get('/getSequence/:id', awaitHandlerFactory(modelController.getSequence)); // converted
router.get('/getPoDetails/:id', awaitHandlerFactory(modelController.getPoDetails)); //converted
router.get('/getProjectConsumableLogs/:id', awaitHandlerFactory(modelController.getProjectConsumableLogs));//converted
router.post('/getSpaces', awaitHandlerFactory(modelController.getSpaces)); //converted
router.post('/gePO', awaitHandlerFactory(modelController.gePO)); //converted
router.post('/addPO', awaitHandlerFactory(modelController.addPO)); //converted
router.post('/acknowledgeOrders', awaitHandlerFactory(modelController.acknowledgeOrders)); //converted
router.post('/archiveList', awaitHandlerFactory(modelController.archiveList));
router.post('/archiveCard', awaitHandlerFactory(modelController.archiveCard));
router.post('/deleteAttachment', awaitHandlerFactory(modelController.deleteAttachment));
router.post('/updateComment', awaitHandlerFactory(modelController.updateComment));
router.post('/deleteComment', awaitHandlerFactory(modelController.deleteComment));
router.post('/updateTicketComment', awaitHandlerFactory(modelController.updateTicketComment));
router.post('/deleteTicketComment', awaitHandlerFactory(modelController.deleteTicketComment));
module.exports = router;
