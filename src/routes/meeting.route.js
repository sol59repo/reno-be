import { Hono } from 'hono'
const router = new Hono();

const meetingController = require('../modules/meeting/controllers/meeting.controller');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');


router.post('/addParticipants', awaitHandlerFactory(meetingController.addParticipants));
// router.post('/createMeeting', awaitHandlerFactory(meetingController.createMeeting));
router.get('/getMeetings/:id', awaitHandlerFactory(meetingController.getMeetings));
// router.post('/getMeeting', awaitHandlerFactory(meetingController.getMeeting));
// router.post('/updateStatus', awaitHandlerFactory(meetingController.updateStatus));
router.post('/removeAttendee', awaitHandlerFactory(meetingController.removeAttendee));
// router.get('/getAttendees/:id', awaitHandlerFactory(meetingController.getAttendees));
router.get('/getZoomLink/:id', awaitHandlerFactory(meetingController.getZoomLink));
router.get('/getMeetingAttendee/:id', awaitHandlerFactory(meetingController.getMeetingAttendee));
router.get('/getManagers', awaitHandlerFactory(meetingController.getManagers));
// router.post('/generateMeetingSig', awaitHandlerFactory(meetingController.generateMeetingSig));
router.post('/createCalendarMeeting', awaitHandlerFactory(meetingController.createCalendarMeeting));
router.post('/removeMeeting', awaitHandlerFactory(meetingController.removeMeeting));


module.exports = router;