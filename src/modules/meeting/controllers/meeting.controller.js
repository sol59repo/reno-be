import { sign } from 'hono/jwt'
import * as MyModel from '../../../models/MyModel'
const HttpException = require('../../../utils/HttpException.utils');
const { formatData } = require("../../../utils/settings");
const shortid = require('shortid');
const { formatDate } = require("../../../utils/helper")


class Meeting {

    tbl = "meeting";

    // createMeeting = async (c, next) => {
    //     const payload = {
    //         iss: c.env.ZOOM_JWT_API_KEY,
    //         exp: (new Date()).getTime() + 5000
    //     };

    //     // const token = await sign(payload, process.env.ZOOM_JWT_API_SECRET);


    //     const tbl = this.tbl;
    //     const { user, postData, count, content } = req.body
    //     const response = await fetch(`https://api.zoom.us/v2/users/${user}/meetings`, {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         },
    //         body: postData
    //     });

    //     if (response.status !== 201) {
    //         if (response.status === 404) {
    //             throw new HttpException(404, 'User has no zoom account');
    //         } else {
    //             throw new HttpException(401, 'Errorfrom zoom api!');
    //         }
    //     }
    //     const data = await response.json();
    //     let meetingData = {
    //         ID: data.id,
    //         host: count,
    //         meetingData: JSON.stringify(data),
    //         hostEmail: user,
    //         notes: JSON.stringify(content),
    //         status: "Pending",
    //     }

    //     const result = await MyModel.insert(`${tbl}`, meetingData);
    //     if (result == 0) {
    //         throw new HttpException(500, 'Something went wrong adding meeting to database');
    //     }
    //     const formatted = formatData({ message: 'Meeting was created!', insertId: result });
    //     res.status(200).send(formatted);
    // }

    // getMeeting = async (req, res, next) => {
    //     const payload = {
    //         iss: process.env.ZOOM_JWT_API_KEY,
    //         exp: (new Date()).getTime() + 5000
    //     };

    //     const token = jwt.sign(payload, process.env.ZOOM_JWT_API_SECRET);

    //     const { meetingId } = req.body
    //     const response = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
    //         method: 'GET',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': `Bearer ${token}`
    //         }
    //     });

    //     console.log(response);

    //     if (response.status !== 200) {
    //         throw new HttpException(401, 'Error from zoom api!');
    //     }
    //     const data = await response.json();
    //     const formatted = formatData({ message: 'Meeting was created!', data: data });
    //     res.status(200).send(formatted);
    // }

    // updateStatus = async (req, res, next) => {
    //     const tbl = this.tbl;

    //     const set = {
    //         status: req.body.status,
    //     };
    //     const where = {
    //         ID: req.body.meetingId
    //     };

    //     const result = await MyModel.update(tbl, set, where);
    //     if (!result) {
    //         throw new HttpException(404, 'Something went wrong');
    //     }

    //     const { affectedRows, changedRows, info } = result;
    //     console.log(result);
    //     const message = !affectedRows ? 'Data not found' :
    //         affectedRows && changedRows ? 'Data updated successfully' :
    //             affectedRows && !changedRows ? 'Data was found but already up to date' : "Update failed!";

    //     const formatted = formatData({ message, info });
    //     res.status(200).send(formatted);
    // }


    // getAttendees = async (req, res, next) => {
    //     const { id } = req.params;

    //     console.log(id);
    //     const options = {
    //         select: 'users.count as UserId,users.ID ,meetingAttendees.count,meetingAttendees.attendStatus,firstname,lastname,usertype',
    //         where: { "fkMeetingCount": id },
    //         join: {
    //             "meeting": "meeting.ID = meetingAttendees.fkMeetingCount",
    //             "users": "users.ID = meetingAttendees.fkUserCount",
    //             "userdetails": "users.count = userdetails.fkUserCount",
    //         }
    //     }
    //     const response = await MyModel.getRows('meetingAttendees', options);
    //     if (!response) {
    //         throw new HttpException(404, 'Meetings  not found');
    //     }
    //     const formatted = formatData(response);
    //     res.status(200).send(formatted);
    // }

    // generateMeetingSig = async (req, res, next) => {
    //     const { meetingNumber, role } = req.body
    //     const timestamp = new Date().getTime() - 30000
    //     const msg = Buffer.from(process.env.ZOOM_JWT_API_KEY + meetingNumber + timestamp + role).toString('base64')
    //     const hash = crypto.createHmac('sha256', process.env.ZOOM_JWT_API_SECRET).update(msg).digest('base64')
    //     const signature = Buffer.from(`${process.env.ZOOM_JWT_API_KEY}.${meetingNumber}.${timestamp}.${role}.${hash}`).toString('base64')
    //     const formatted = formatData({ signature: signature });
    //     res.status(200).send(formatted);
    // }


    getManagers = async (c, next) => {
        const options = {
            "select": `
                 userdetails.firstname || ' ' || userdetails.lastname AS name,
                 users.count,
                 users.ID,
                 userdetails.avatar
            `,
            "where": {
                "usertype !=": "Staff",
                "status": "Active"
            },
            "join": {
                "userdetails": "userdetails.fkUsercount  = users.count"
            }
        }

        console.log('options', options);


        const { sql, values } = await MyModel.getRows("users", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();
        if (!result.success) {
            throw c.json(new HttpException(404, 'Meetings  not found'), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    }

    getZoomLink = async (c, next) => {
        // const { id } = req.params
        const id = c.req.param('id')
        const options = {
            "select": `zoomLink `,
            "where": { fkUsercount: id }
        }

        const { sql, values } = await MyModel.getRows("userdetails", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();
        if (!result.success) {
            throw c.json(new HttpException(404, 'Meetings  not found'), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    }

    createCalendarMeeting = async (c, next) => {
        const body = await c.req.json();
        const { title, schedule, atendees, note, host, type } = body

        const meetingData = {
            ID: shortid.generate(),
            host: host,
            notes: note,
            status: "Incoming",
            title: title,
            schedule: formatDate(new Date(schedule)),
            type: type
        }

        const { sql, values } = await MyModel.insert("meeting", meetingData);

        const result = await c.env.DB.prepare(sql).bind(...values).run();


        if (result.meta.last_row_id == 0) {
            return c.json(new HttpException(400, 'Something went wrong adding attendance'), 400);
        }

        var i;
        for (i = 0; i < atendees.length; i++) {
            const meetingAttendees = {
                fkMeetingCount: result.meta.last_row_id.toString(),
                fkUserCount: atendees[i].count.toString(),
                attendStatus: "Active"
            }

            const { sql: sql_attendees, values: values_attendees } = await MyModel.insert('meetingAttendees', meetingAttendees);
            await c.env.DB.prepare(sql_attendees).bind(...values_attendees).run();
        }

        const formatted = formatData({ message: 'Meeting was created!', insertId: result.meta.last_row_id });
        return c.json(formatted);
    }

    removeMeeting = async (c, next) => {
        const body = await c.req.json();
        const { meetingCount } = body

        const { sql: sql_meeting_delete, values: values_meeting_delete } = await MyModel.delete('meeting', {
            count: meetingCount,
        });

        const { sql: sql_meetingAttendees_delete, values: values_meetingAttendees_delete } = await MyModel.delete('meetingAttendees', {
            fkMeetingCount: meetingCount,
        });

        const result = await Promise.all([
            c.env.DB.prepare(sql_meeting_delete).bind(...values_meeting_delete).run(),
            c.env.DB.prepare(sql_meetingAttendees_delete).bind(...values_meetingAttendees_delete).run()
        ])
        if (!result) {
            return c.json(new HttpException(400, 'Something went wrong deleting of meeting'), 400);
        }

        const message = 'Data was found but already up to date';

        const formatted = formatData({ message });
        return c.json(formatted);
    }

    getMeetings = async (c, next) => {
        const id = c.req.param('id')

        const options = {
            "select": `meeting.*,
            meeting.ID as id,
            userdetails.email
            `,
            "where": {
                "meetingAttendees.fkUserCount": id
            },
            "join": {
                "meeting": "meeting.count=meetingAttendees.fkMeetingCount",
                "userdetails": "userdetails.fkUsercount=meeting.host",
            }
        }

        const { sql, values } = await MyModel.getRows("meetingAttendees", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();
        if (!result.success) {
            throw c.json(new HttpException(404, 'Meetings  not found'), 404);

        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    }

    getMeetingAttendee = async (c, next) => {
        const id = c.req.param('id')

        const options = {
            "select": `
              CONCAT(userdetails.firstname,' ', userdetails.lastname) name,
              avatar,
              userdetails.fkUsercount,
              meetingAttendees.count as AttendeeCount
            `,
            "where": {
                "fkMeetingCount": id
            },
            "join": {
                "userdetails": "userdetails.fkUsercount=meetingAttendees.fkUserCount"
            }
        }

        const { sql, values } = await MyModel.getRows("meetingAttendees", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();
        if (!result.success) {
            throw c.json(new HttpException(404, 'meetingAttendees  not found'), 404);

        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    }


    // addParticipants = async (req, res, next) => {

    //     const { fkMeetingCount, fkUserCount, attendStatus } = req.body

    //     let meetingData = {
    //         fkMeetingCount: fkMeetingCount,
    //         fkUserCount: fkUserCount,
    //         attendStatus: attendStatus
    //     }

    //     const result = await MyModel.insert(`meetingAttendees`, meetingData);
    //     if (result == 0) {
    //         throw new HttpException(500, 'Something went wrong adding meeting paticipants to database');
    //     }
    //     const formatted = formatData({ message: 'Participant was added!', insertId: result });
    //     res.status(200).send(formatted);
    // }


    // removeAttendee = async (req, res, next) => {
    //     const where = {
    //         fkMeetingCount: req.body.meetingCount,
    //         fkUserCount: req.body.count,
    //     };

    //     const result = await MyModel.delete('meetingAttendees', where);
    //     if (!result) {
    //         throw new HttpException(404, 'Something went wrong');
    //     }

    //     console.log(result);
    //     const message = 'Data was found but already up to date';

    //     const formatted = formatData({ message });
    //     res.status(200).send(formatted);
    // }

}

module.exports = new Meeting;
