import * as MyModel from '../../../models/MyModel'
import { HTTPException } from 'hono/http-exception'
import { Buffer } from 'node:buffer';
const HttpException = require('../../../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const { formatData } = require("../../../utils/settings")
const { formatDate } = require("../../../utils/helper")
const shortid = require("shortid");


/******************************************************************************
 *                              Employee Controller
 ******************************************************************************/
class Model {
    tblprojectModels = "projectModels";
    tblmeasurements = "measurements";


    isInArray = (addedSpaces, obj) => {
        var i;
        for (i = 0; i < addedSpaces.length; i++) {
            if (addedSpaces[i].spaceId === obj.id) {
                return true;
            }
        }
        return false;
    };

    getMatterportModels = async (c, next) => {
        const token = c.env.TOKEN_ID;
        const secret = c.env.TOKEN_SECRET;
        const mp_url = c.env.MP_URL;
        const auth = Buffer.from(token + ":" + secret).toString("base64");
        const _body = JSON.stringify({
            query: `
                  query {
                    models(query: "*"){
                      totalResults
                      results {
                        id
                        name
                        measurements{
                          count,
                          labels
                        }
                      }
                    }
                  }
                `,
        });

        const response = await fetch(mp_url, {
            method: "POST",
            headers: {
                Authorization: `Basic ${auth}`,
                "Content-type": "application/json",
            },
            body: _body,
        });

        let data = await response.json();

        // const getAllAddedSpaces = await MyModel.getRows("projectModelSpaces", {
        //     select: "spaceId",
        // });

        const { sql, values } = await MyModel.getRows("projectModelSpaces", {
            select: "spaceId",
        });
        const getAllAddedSpaces = await c.env.DB.prepare(sql).bind(...values).all();

        const filterModels = data.data.models.results.filter((val) => {
            const checked = this.isInArray(getAllAddedSpaces.results, val);
            if (checked) return false;
            return true;
        });

        const formatted = formatData({ models: filterModels });
        return c.json(formatted);
    };

    qtyUpdate = async (c, next) => {
        const body = await c.req.json();
        const { data, modelId, addedBy } = body;

        let response = 0;
        var i;
        for (i = 0; i < data.length; i++) {
            let set = {
                qty: data[i].newQty,
                status: data[i].newQty > 0 ? "In-Stock" : "Out-of-Stock",
            };

            let where = {
                count: data[i].count,
            };

            // response = await MyModel.update("projectConsumables", set, where);

            const { sql, values } = await MyModel.update("projectConsumables", set, where);
            response = await c.env.DB.prepare(sql).bind(...values).run();
        }

        const description = data[0] === "Minus" ? 'Subtracting of quantity to materials' : 'Adding of quantity to materials';
        const type = data[0] === "Minues" ? 'Consumed Qty' : 'Add Qty';

        const logData = {
            ID: shortid.generate(),
            fkModel: modelId,
            refId: "n/a",
            description: description,
            dateTime: new Date().toString(),
            addedBy: addedBy,
            type: type,
        };

        // await MyModel.insert("consumableLogs", logData);

        const { sql, values } = await MyModel.insert("consumableLogs", logData);
        await c.env.DB.prepare(sql).bind(...values).run();

        // const { affectedRows, changedRows, info } = response.results;
        // const message = !affectedRows
        //     ? "Data not found"
        //     : affectedRows && changedRows
        //         ? "Data updated successfully"
        //         : affectedRows && !changedRows
        //             ? "Data was found but already up to date"
        //             : "Update failed!";

        // return await c.json(response);
        const formatted = formatData({
            "message": "Data updated successfully",
            "info": `Rows matched: ${response.meta.rows_written}  Changed: ${response.meta.changes}`
        });
        return c.json(formatted);
    };

    addAttendanceData = async (c, next) => {
        const body = await c.req.json();
        const { staffs, dateNow, projectModel } = body;

        let result = 0;
        var i;
        for (i = 0; i < staffs.length; i++) {
            const insertData = {
                date: dateNow.toString(),
                fkUser: staffs[i].fkUser,
                projectModel: projectModel,
            };

            const { sql, values } = await MyModel.insert('attendance', insertData);
            result = await c.env.DB.prepare(sql).bind(...values).run();

            if (result.meta.last_row_id === 0) {
                return c.json(500, "Something went wrong adding of attendance", 500);
            }
        }

        const formatted = formatData({
            message: "success!",
            insertId: result !== 0 ? result.meta.last_row_id.toString() : 0,
        });
        return c.json(formatted);
    };

    addMaterial = async (req, res, next) => {
        const { materials, fkProject, addedBy } = req.body;

        let result = 0;
        var i;
        for (i = 0; i < materials.length; i++) {
            const insertData = {
                fkProject: fkProject,
                dateAdded: new Date().getTime(),
                status: "Out-of-Stock",
                qty: 0,
                fkConsumables: materials[i].count,
                addedBy: addedBy,
            };
            result = await MyModel.insert("projectConsumables", insertData);

            if (result === 0) {
                throw new HttpException(
                    500,
                    "Something went wrong adding of material to projects"
                );
            }
        }
        const formatted = formatData({ message: "success!", insertId: result });
        res.status(200).send(formatted);
    };

    asignStaff = async (c, next) => {
        const body = await c.req.json();
        const { staffs, modelId, addedBy } = body;

        let result = 0;
        var i;
        for (i = 0; i < staffs.length; i++) {
            const insertData = {
                fkModel: modelId,
                dateAdded: new Date().getTime(),
                status: "Active",
                fkUser: staffs[i].count,
                addedBy: addedBy,
            };

            const { sql, values } = await MyModel.insert('projectAsignment', insertData);
            result = await c.env.DB.prepare(sql).bind(...values).run();

            if (result.meta.last_row_id === 0) {
                return c.json(500, "Something went wrong asigning staff to projects", 500);
            }
        }
        const formatted = formatData({ message: "success!", insertId: result.meta.last_row_id.toString() });
        return c.json(formatted);
    };

    addProject = async (c, next) => {
        const tbl = this.tblprojectModels;
        const body = await c.req.json();

        const { addedBy, Name, Location } = body;

        const projectData = {
            modelId: shortid.generate(),
            dateAdded: formatDate(new Date()),
            status: "Pending",
            Name: Name,
            addedBy: addedBy,
            location: Location,
        };

        const { sql, values } = await MyModel.insert(tbl, projectData);
        const result = await c.env.DB.prepare(sql).bind(...values).run();

        if (result.meta.last_row_id === 0) {
            return c.json(500, "Something went wrong adding of projects", 500);
        }
        const formatted = formatData({
            message: "Project was added!",
            insertId: result.meta.last_row_id.toString(),
        });
        return c.json(formatted);
    };

    AddToProject = async (c, next) => {
        const body = await c.req.json();
        const { spaceId, fkModel, location, addedBy } = body;

        const projectData = {
            spaceId: spaceId,
            fkModel: fkModel,
            status: "Pending",
            addedBy: addedBy,
            location: location,
        };

        const { sql, values } = await MyModel.getRows("projectModelSpaces", projectData);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            throw c.json(new HttpException(404, "Employees  not found!"));
        }
        const formatted = formatData({
            message: "Project was added!",
            insertId: result.meta.last_row_id.toString(),
        });
        return c.json(formatted);
    };

    getProjects = async (c, next) => {
        const tbl = this.tblprojectModels;
        const body = await c.req.json();

        const { status, loggedInId, usertype } = body;

        const options = {
            select: "*",
            where: {
                "projectModels.status !=": "Deleted",
            },
        };

        if (usertype !== "Superadmin") {
            options.join = {
                "projectAsignment": "projectAsignment.fkModel = projectModels.modelId",
            };
            options.where = {
                ...options.where,
                "projectAsignment.fkUser": loggedInId,
            };

            if (status !== "All") {
                options.where = {
                    ...options.where,
                    "projectModels.status": status,
                };
            }
        } else {
            if (status !== "All") {
                options.where = {
                    "projectModels.status": status,
                };
            }
        }

        const { sql, values } = await MyModel.getRows(tbl, options);
        // return c.json( sql);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result.success) {
            return c.json(new HttpException(404, "Projects  not found!"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    saveModelChanges = async (c, next) => {
        const body = await c.req.json();
        const { measurements, modelId, type, measurementDesc } = body
        let table = "measurements";
        if (type === "ticket") {
            table = "tickets";
        }

        const { sql: checkExists_sql, values: checkExists_values } = await MyModel.getRows(table, {
            where: { modelId: modelId },
        });

        const checkExists = await c.env.DB.prepare(checkExists_sql).bind(...checkExists_values).all();

        if (checkExists.success && checkExists.results.length > 0) {
            let set = {
                dateUpdAted: new Date().toISOString(),
                measurements: JSON.stringify(measurements),
            };
            let where = {
                modelId: modelId,
            };
            const { sql, values } = await MyModel.update(table, set, where);
            const result = await c.env.DB.prepare(sql).bind(...values).run();
            if (result && !result.success) {
                return c.json(new HttpException(400, 'Something went wrong'), 400);
            }
            const formatted = formatData({
                "message": "Data updated successfully",
                "info": `Rows matched: ${result.meta.rows_written}  Changed: ${result.meta.changes}`
            });
            return c.json(formatted);

        } else {
            let insertData = {
                dateAdded: new Date().toISOString(),
                status: 1,
                measurements: JSON.stringify(measurements),
                modelId: modelId,
            };
            const { sql: sql2, values: values2 } = await MyModel.insert(table, insertData);
            const _result = await c.env.DB.prepare(sql2).bind(...values2).run();
            if (_result.meta.last_row_id == 0) {
                return c.json(new HttpException(400, `Something went wrong adding ${table}`), 400);
            }
            const formatted = formatData({ message: `${table} was created!`, insertId: _result.meta.last_row_id.toString() });
            return c.json(formatted);
        }
    };

    getMeasurements = async (c, next) => {
        const tbl = this.tblmeasurements;
        const id = c.req.param('id')
        const options = {
            select: "*",
            where: {
                modelId: id,
                status: 1,
            },
        };

        const { sql, values } = await MyModel.getRows(tbl, options);
        const response = await c.env.DB.prepare(sql).bind(...values).all();
        if (!response.success) {
            return c.json(new HttpException(404, "Projects  not found!"), 404);
        }

        const formatted = formatData(response.results);
        return c.json(formatted);
    };

    getTickets = async (c, next) => {
        const id = c.req.param('id')
        const options = {
            select: "*",
            where: {
                modelId: id,
                status: 1,
            },
        };

        const { sql, values } = await MyModel.getRows("tickets", options);
        const response = await c.env.DB.prepare(sql).bind(...values).all();
        if (!response.success) {
            return c.json(new HttpException(404, "Projects  not found!"), 404);
        }

        const formatted = formatData(response.results);
        return c.json(formatted);
    };

    getLocationName = async (c, next) => {
        const tbl = this.tblmeasurements;
        const id = c.req.param('id');
        const options = {
            select: "location",
            where: {
                modelId: id,
            },
        };

        const { sql, values } = await MyModel.getRows("projectModels", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, "Projects  not found"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    getObjStatus = async (req, res, next) => {
        const { id } = req.params;
        const options = {
            select: "status",
            where: {
                refId: id,
            },
        };

        const response = await MyModel.getRows("comments", options);
        if (!response) {
            throw new HttpException(404, "Projects  not found");
        }

        const formatted = formatData(response);
        res.status(200).send(formatted);
    };

    getcommentsMembers = async (req, res, next) => {
        const { id } = req.params;
        const options = {
            select: `
        userdetails.avatar as Avatar,
        commentsMembers.*`,
            where: {
                refId: id,
                "commentsMembers.status": "Active",
            },
            join: {
                users: "users.ID = commentsMembers.userID",
                userdetails: "userdetails.fkUsercount = users.count",
            },
        };

        const response = await MyModel.getRows("commentsMembers", options);
        if (!response) {
            throw new HttpException(404, "Projects  not found");
        }

        const formatted = formatData(response);
        res.status(200).send(formatted);
    };

    getAsignedManager = async (c, next) => {
        const id = c.req.param('id');
        const options = {
            select: `
              userdetails.firstname || ' ' || userdetails.lastname AS empName,
              avatar,
              gender,
              ID,
              projectAsignment.*
        `,
            where: {
                fkModel: id,
                "users.usertype": "Admin",
            },
            join: {
                users: "users.count = projectAsignment.fkUser",
                userdetails: "users.count =  userdetails.fkUsercount",
            },
        };

        const { sql, values } = await MyModel.getRows("projectAsignment", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, "project Asignment  not found"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    getAsignedMaterials = async (c, next) => {
        const id = c.req.param('id');
        const options = {
            select: `
              userdetails.firstname || ' ' || userdetails.lastname AS empName,
              usertype,
              projectConsumables.*,
              consumables.itemCode,
              consumables.itemName,
              consumables.count as consumablesCount,
              projectModels.name,
              projectModels.location
        `,
            where: {
                fkProject: id,
            },
            join: {
                users: "users.count = projectConsumables.addedBy",
                userdetails: "users.count =  userdetails.fkUsercount",
                consumables: "consumables.count = projectConsumables.fkConsumables",
                projectModels: "projectModels.count = projectConsumables.fkProject",
            },
        };

        const { sql, values } = await MyModel.getRows("projectConsumables", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, "project Consumables not found"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    getProjectSpace = async (c, next) => {
        const id = c.req.param('id');
        const options = {
            select: `
           projectModelSpaces.*
        `,
            where: {
                spaceId: id,
            },
        };

        // const response = await MyModel.getRows("projectModelSpaces", options);

        const { sql, values } = await MyModel.getRows("projectModelSpaces", options);
        const response = await c.env.DB.prepare(sql).bind(...values).all();

        console.log("response", response);

        if (!response) {
            throw c.json(new HttpException(404, "project Models not found"));
        }

        const formatted = formatData(response.results);
        return c.json(formatted);
    };

    getProject = async (c, next) => {
        const id = c.req.param('id');
        const options = {
            select: `
              projectModels.*
        `,
            where: {
                modelId: id,
            },
        };

        const { sql, values } = await MyModel.getRows("projectModels", options);
        const response = await c.env.DB.prepare(sql).bind(...values).all();
        if (!response.success) {
            return c.json(new HttpException(404, "project Models not found"), 404);
        }

        const formatted = formatData(response.results);
        return c.json(formatted);
    };

    getAsignedStaff = async (c, next) => {
        const id = c.req.param('id');
        const options = {
            select: `userdetails.firstname || ' ' || userdetails.lastname AS empName,avatar,gender,ID,projectAsignment.*`,
            where: {
                fkModel: id,
                "users.usertype": "Staff",
            },
            join: {
                users: "users.count = projectAsignment.fkUser",
                userdetails: "users.count =  userdetails.fkUsercount",
            },
        };

        const { sql, values } = await MyModel.getRows("projectAsignment", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, "project Asignment  not found"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    getSingleAttendance = async (c, next) => {
        const id = c.req.param('id');
        const options = {
            select: `
            userdetails.firstname || ' ' || userdetails.lastname AS empName,
              avatar,
              attendance.*
        `,
            where: {
                "attendance.count": id,
            },
            join: {
                users: "users.count = attendance.fkUser",
                userdetails: "users.count =  userdetails.fkUsercount",
            },
        };

        const { sql, values } = await MyModel.getRows("attendance", options);
        const response = await c.env.DB.prepare(sql).bind(...values).all();
        if (!response.results.length === 0) {
            return c.json(new HttpException(404, "project attendance  not found"), 404);
        }

        const formatted = formatData(response.results);
        return c.json(formatted);
    };

    getComments = async (req, res, next) => {
        const { id } = req.params;
        const options = {
            select: `
        CONCAT(userdetails.firstname,' ', userdetails.lastname) empName,
        userdetails.avatar,
        commentConvo.*`,
            where: {
                refId: id,
                "commentConvo.status": "Active",
            },
            join: {
                users: "users.ID = commentConvo.addedBy",
                userdetails: "users.count =  userdetails.fkUsercount",
            },
            order: "count DESC",
        };

        const response = await MyModel.getRows("commentConvo", options);
        if (!response) {
            throw new HttpException(404, "Projects  not found");
        }

        const formatted = formatData(response);
        res.status(200).send(formatted);
    };

    getAllMaterials = async (c, next) => {
        let where = {
            "status!=": "Deleted",
        };

        const options = {
            select: `
        consumables.*
        `,
            where: where,
        };

        const { sql, values } = await MyModel.getRows("consumables", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, "consumables  not found"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    getAllManagers = async (c, next) => {
        let where = {
            "users.status": "Active",
            "users.usertype": "Admin",
        };

        const options = {
            select: `users.count,
                  ID,
                  avatar,
                  users.status,
                  birthdate,
                  address,
                  usertype,
                  userdetails.firstname || ' ' || userdetails.lastname AS empName
        `,
            where: where,
            join: {
                userdetails: "userdetails.fkUsercount = users.count",
            },
        };

        const { sql, values } = await MyModel.getRows("users", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, "Employees  not found"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    getAllStaffs = async (c, next) => {
        let where = {
            "users.status": "Active",
            "users.usertype": "Staff",
        };

        const options = {
            select: `users.count,
                  ID,
                  avatar,
                  users.status,
                  birthdate,
                  address,
                  usertype,
                  userdetails.firstname || ' ' || userdetails.lastname AS empName
        `,
            where: where,
            join: {
                userdetails: "userdetails.fkUsercount = users.count",
            },
        };

        const { sql, values } = await MyModel.getRows("users", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, "Employees  not found"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    sendComment = async (req, res, next) => {
        const { dateAdded, comment, addedBy, refId } = req.body;

        let insertData = {
            refId: refId,
            comment: comment,
            addedBy: addedBy,
            dateTime: new Date(),
            type: "comment",
        };

        const response = await MyModel.insert("commentConvo", insertData);
        if (response === 0) {
            throw new HttpException(
                500,
                "Something went wrong adding of model changes"
            );
        }

        const set = {
            readstatus: "false",
            readThread: response,
        };
        const where = {
            refId: refId,
        };
        await MyModel.update("commentsMembers", set, where);

        const formatted = formatData({
            message: "Model changes saved!",
            insertId: response,
        });
        res.status(200).send(formatted);
    };

    initComments = async (req, res, next) => {
        const { refId } = req.body;
        const checkExists = await MyModel.getRows("comments", {
            where: { refId: refId },
        });

        if (checkExists.length === 0) {
            let insertData = {
                refId: refId,
                status: JSON.stringify([]),
            };

            const response = await MyModel.insert("comments", insertData);
            if (response === 0) {
                throw new HttpException(
                    500,
                    "Something went wrong adding of initComments"
                );
            }

            const formatted = formatData({
                message: "initComments  saved!",
                insertId: response,
            });
            res.status(200).send(formatted);
        } else {
            const formatted = formatData({
                message: "initComments already existed!",
                insertId: 0,
            });
            res.status(200).send(formatted);
        }
    };

    updateAttendanceAvailability = async (c, next) => {
        const body = await c.req.json();

        const {
            availabilityStatus,
            count
        } = body

        const set = {
            availabilityStatus: availabilityStatus
        };
        const where = {
            count: count
        };

        const { sql, values } = await MyModel.update("attendance", set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();
        if (result && !result.success) {
            return c.json(new HttpException(400, 'Something went wrong'), 400);
        }

        const formatted = formatData({
            "message": "Data updated successfully",
            "info": `Rows matched: ${result.meta.rows_written}  Changed: ${result.meta.changes}`
        });

        return c.json(formatted);
    };

    updateSpaceStatus = async (c, next) => {
        const body = await c.req.json();

        const set = {
            status: body.status,
        };
        const where = {
            spaceId: body.spaceId,
        };

        // const result = await MyModel.update("projectModelSpaces", set, where);

        const { sql, values } = await MyModel.update("projectModelSpaces", set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();
        if (!result) {
            throw c.json(new HttpException(404, "Something went wrong"));
        }

        const { affectedRows, changedRows, info } = result;
        // const message = !affectedRows
        const message = "Data updated successfully";
        // ? "Data not found"
        // : affectedRows && changedRows
        //     ? "Data updated successfully"
        //     : affectedRows && !changedRows
        //         ? "Data was found but already up to date"
        //         : "Update failed!";

        const formatted = formatData({ message, info });
        // res.status(200).send(formatted);
        return c.json(formatted);
    };

    updateStatus = async (c, next) => {
        const tblprojectModels = this.tblprojectModels;
        const body = await c.req.json();

        const set = {
            status: body.status,
        };
        const where = {
            modelId: body.ModelId,
        };

        const { sql, values } = await MyModel.update(tblprojectModels, set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();

        let message = '';
        if (!result.success) {
            return c.json(new HttpException(404, "Something went wrong"), 404);
        }

        const formatted = formatData({ message: 'Data updated successfully' });
        return c.json(formatted);

        // const { affectedRows, changedRows, info } = result;
        // const message = !affectedRows
        //     ? "Data not found"
        //     : affectedRows && changedRows
        //         ? "Data updated successfully"
        //         : affectedRows && !changedRows
        //             ? "Data was found but already up to date"
        //             : "Update failed!";

        // const formatted = formatData({ message, info });
        // res.status(200).send(formatted);
    };

    submitAction = async (c, next) => {
        const body = await c.req.json();
        const {
            status,
            count,
            time,
            hourSpent,
            timeSpent
        } = body

        const set = {
            status: status,
        };

        if (status === "In") {
            set.timeIn = time;
        } else if (status === "Out") {
            set.timeOut = time;
            set.hourSpent = hourSpent;
        }

        const where = {
            count: count,
        };

        console.log("parseInt(count)", parseInt(count))

        const { sql, values } = await MyModel.update("attendance", set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();
        if (result && !result.success) {
            return c.json(new HttpException(400, 'Something went wrong'), 400);
        }

        const insertData = {
            fkAttendanceCount: count.toString(),
            statusAction: status === "In" ? "Time in" : "Time out",
            time: time,
            timeSpent: status === "In" ? 0 : timeSpent,
        };


        const { sql: insert_sql, values: insert_values } = await MyModel.insert("attendanceLogs", insertData);
        await c.env.DB.prepare(insert_sql).bind(...insert_values).run();

        const formatted = formatData({
            "message": "Data updated successfully",
            "info": `Rows matched: ${result.meta.rows_written}  Changed: ${result.meta.changes}`
        });
        return c.json(formatted);
    };

    submitBulkActions = async (req, res, next) => {
        const { data, availabilityStatus } = req.body;

        console.log(data);

        let result;
        for (let i = 0; i < data.length; i++) {
            const { status, count, time, hourSpent, timeSpent } = data[i];
            const set = {
                status: status,
                availabilityStatus: "Present",
            };
            if (status === "In") {
                set.timeIn = time;
            } else if (status === "Out") {
                set.timeOut = time;
                set.hourSpent = hourSpent;
            }

            result = await MyModel.update("attendance", set, { count: count });

            const insertData = {
                fkAttendanceCount: count,
                statusAction: status === "In" ? "Time in" : "Time out",
                time: time,
                timeSpent: status === "In" ? 0 : timeSpent,
            };

            await MyModel.insert("attendanceLogs", insertData);
        }

        console.log(result);

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    submitBulkActionsLeaveOrAbsent = async (req, res, next) => {
        const { data } = req.body;
        let result;
        for (let i = 0; i < data.length; i++) {
            const { status, count } = data[i];
            const set = {
                availabilityStatus: status,
            };
            result = await MyModel.update("attendance", set, { count: count });
        }

        const { affectedRows, changedRows, info } = result;

        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    updateAdeddConsumableStatus = async (req, res, next) => {
        const set = {
            status: req.body.status,
        };
        const where = {
            count: req.body.count,
        };

        const result = await MyModel.update("projectConsumables", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        console.log(result);
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    updateAsignmentStatus = async (c, next) => {
        const body = await c.req.json();
        const set = {
            status: body.status,
        };
        const where = {
            count: body.count,
        };

        const { sql, values } = await MyModel.update("projectAsignment", set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();

        let message = '';
        if (!result.success) {
            return c.json(new HttpException(404, "Something went wrong"), 404);
        } else {
            const { sql, values } = await MyModel.getRows("projectAsignment", {
                count: body.count,
                status: body.status,
            });
            const getData = await c.env.DB.prepare(sql).bind(...values).all();

            // return c.json(getData);
            if (getData.results.length >= 0) {
                message = 'Data was found but already up to date'
            } else {
                message = 'Data updated successfully'
            }
        }

        const formatted = formatData({ message });
        return c.json(formatted);

        // const { affectedRows, changedRows, info } = result.results;
        // console.log(result.results);
        // const message = !affectedRows
        //     ? "Data not found"
        //     : affectedRows && changedRows
        //         ? "Data updated successfully"
        //         : affectedRows && !changedRows
        //             ? "Data was found but already up to date"
        //             : "Update failed!";

    };

    sendStatus = async (req, res, next) => {
        const set = {
            status: JSON.stringify(req.body.objStatus),
        };
        const where = {
            refId: req.body.refId,
        };

        const result = await MyModel.update("comments", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    sendMembers = async (req, res, next) => {
        const { cardMembers, refId, type } = req.body;

        console.log(req.body);

        const where = {
            refId: refId,
            userID: cardMembers.ID,
        };

        const checkExists = await MyModel.getRows("commentsMembers", {
            where: where,
        });
        if (checkExists.length > 0) {
            const set = {
                status: type,
            };
            const response = await MyModel.update("commentsMembers", set, where);
            const { affectedRows, changedRows, info } = response;
            const message = !affectedRows
                ? "Data not found"
                : affectedRows && changedRows
                    ? "Data updated successfully"
                    : affectedRows && !changedRows
                        ? "Data was found but already up to date"
                        : "Update failed!";
            const formatted = formatData({ message, info });
            res.status(200).send(formatted);
        } else {
            const insertData = {
                refId: refId,
                status: type,
                readstatus: "false",
                readThread: "All",
                avatar: cardMembers.avatar || null,
                userID: cardMembers.ID,
                name: cardMembers.empName,
            };

            const response = await MyModel.insert("commentsMembers", insertData);
            const formatted = formatData({
                message: "commentsMembers  saved!",
                insertId: response,
            });
            res.status(200).send(formatted);
        }
    };

    getAttendance = async (c, next) => {
        const body = await c.req.json();
        const { date } = body;
        let where = {
            "attendance.date": date,
        };
        const options = {
            select: `
                  attendance.*,
                  userdetails.firstname || ' ' || userdetails.lastname AS empName
             `,
            where: where,
            join: {
                users: "attendance.fkUser = users.count",
                userdetails: "userdetails.fkUsercount = users.count",
            },
        };

        const { sql, values } = await MyModel.getRows("attendance", options);
        const response = await c.env.DB.prepare(sql).bind(...values).all();
        if (!response.success) {
            return c.json(new HttpException(404, "attendance  not found"), 404);
        }

        var i;
        for (i = 0; i < response.length; i++) {
            const { sql, values } = await MyModel.getRows("attendanceLogs", {
                select: "attendanceLogs.*",
                where: {
                    "attendanceLogs.fkAttendanceCount": response[i].count,
                },
            });
            const attendanceLogs = await c.env.DB.prepare(sql).bind(...values).all();
            response[i].attendanceLogs = attendanceLogs.results;
        }

        const formatted = formatData(response.results);
        return c.json(formatted);
    };

    getSingleAttendanceLogs = async (c, next) => {
        const id = c.req.param('id');
        const options = {
            select: `
              attendanceLogs.*
        `,
            where: {
                "attendanceLogs.fkAttendanceCount": id,
            },
        };

        const { sql, values } = await MyModel.getRows("attendanceLogs", options);
        const response = await c.env.DB.prepare(sql).bind(...values).all();
        if (!response.success) {
            return c.json(new HttpException(404, "project attendanceLogs  not found"), 404);
        }

        const formatted = formatData(response.results);
        return c.json(formatted);
    };

    getEmployeesAttendance = async (c, next) => {
        const body = await c.req.json();
        const { from, to } = body;

        let where = {
            "attendance.date >=": from,
            "attendance.date <=": to,
        };

        const options = {
            select: `
                  attendance.*,
                  userdetails.firstname || ' ' || userdetails.lastname AS empName,
                  projectModels.location,
                  ID,
                  (SELECT COUNT(count)
                FROM attendance a2
                WHERE a2.availabilityStatus = "Absent") absences
             `,
            where: where,
            join: {
                users: "attendance.fkUser = users.count",
                userdetails: "userdetails.fkUsercount = users.count",
                projectModels: "projectModels.modelId = attendance.projectModel",
            },
        };

        const { sql, values } = await MyModel.getRows("attendance", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result.success) {
            throw c.json(new HttpException(404, 'attendance  not found'), 404);

        }

        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    getEmployeeAttendance = async (c, next) => {
        const body = await c.req.json();
        const { from, to, fkUser } = body;

        let where = {
            "attendance.date >=": from,
            "attendance.date <=": to,
            "attendance.fkUser": fkUser,
        };

        const options = {
            select: `
                  attendance.*,
                  CONCAT(userdetails.firstname,' ', userdetails.lastname) empName,
                  projectModels.location,
                  ID
  
             `,
            where: where,
            join: {
                users: "attendance.fkUser = users.count",
                userdetails: "userdetails.fkUsercount = users.count",
                projectModels: "projectModels.modelId = attendance.projectModel",
            },
        };

        // const response = await MyModel.getRows("attendance", options);

        const { sql, values } = await MyModel.getRows("attendance", options);
        const response = await c.env.DB.prepare(sql).bind(...values).all();

        if (!response) {
            throw c.json(new HttpException(404, 'attendance  not found'));
        }

        const formatted = formatData(response);
        return c.json(formatted);
    };

    addTicket = async (req, res, next) => {
        const { name, modelId, category, description } = req.body;

        const ticketData = {
            name: name,
            modelId: modelId,
            status: "Open",
            description: description,
            category: category,
        };

        const result = await MyModel.insert("tickets", ticketData);
        if (result === 0) {
            throw new HttpException(500, "Something went wrong adding of projects");
        }
        const formatted = formatData({
            message: "Project was added!",
            insertId: result,
        });
        res.status(200).send(formatted);
    };

    addCardList = async (c, next) => {
        const body = await c.req.json();
        const { name, modelId, status, id, cardListSequence } = body;

        const ticketData = {
            name: name,
            modelId: modelId,
            status: status,
            id: id,
        };

        const { sql, values } = await MyModel.insert("cardLists", ticketData);
        const result = await c.env.DB.prepare(sql).bind(...values).run();

        if (!result.success) {
            return c.json(500, "Something went wrong adding of projects", 500);
        } else {
            const { sql, values } = await MyModel.getRows("cardListsequence", {
                select: "cardListSeq",
                where: {
                    modelId: modelId,
                },
            });
            const resultCardListsequence = await c.env.DB.prepare(sql).bind(...values).all();
            const cardListsequence = resultCardListsequence.results;

            // console.log("cardListsequence", JSON.stringify(cardListsequence, null, 2))

            if (cardListsequence.length === 0) {
                const { sql, values } = await MyModel.insert("cardListsequence", {
                    modelId: modelId,
                    cardListSeq: JSON.stringify([id]),
                });
                await c.env.DB.prepare(sql).bind(...values).run();

            } else {
                let jsonString = cardListsequence[0].cardListSeq;
                jsonString = jsonString.replace(/\\"/g, '"');
                let concat = JSON.parse(jsonString);
                concat.push(id);
                const { sql, values } = await MyModel.update("cardListsequence", {
                    cardListSeq: JSON.stringify(concat),
                }, {
                    modelId: modelId,
                });

                await c.env.DB.prepare(sql).bind(...values).run();
            }
        }

        if (result.success) {
            const cardSequenceData = {
                fkCardList: result.meta.last_row_id.toString(),
                sequence: JSON.stringify([]),
            };

            const { sql, values } = await MyModel.insert("cardSequence", cardSequenceData);
            await c.env.DB.prepare(sql).bind(...values).run();

            return c.json(cardSequenceData);
        }

        const formatted = formatData({
            message: "Project was added!",
            insertId: result.meta.last_row_id.toString(),
        });
        return c.json(formatted);
    };

    addCard = async (req, res, next) => {
        const { fkCardList, summary, addedBy, id, cardSequence, modelId } =
            req.body;

        const cardData = {
            fkCardList: fkCardList,
            summary: summary,
            addedBy: addedBy,
            status: JSON.stringify([]),
            dateAdded: new Date(),
            id: id,
        };

        const result = await MyModel.insert("cards", cardData);
        if (result === 0) {
            throw new HttpException(500, "Something went wrong adding of projects");
        }

        await MyModel.update(
            "cardSequence",
            {
                sequence: cardSequence,
            },
            {
                fkCardList: fkCardList,
            }
        );

        const formatted = formatData({
            message: "Project was added!",
            insertId: result,
        });
        res.status(200).send(formatted);
    };

    getCardLists = async (c, next) => {
        const id = c.req.param('id');
        const options = {
            select: `cardLists.*`,
            where: {
                "cardLists.modelId": id,
                "cardLists.status": "Active",
            },
        };

        const { sql, values } = await MyModel.getRows("cardLists", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        const response = result.results;

        var i;
        for (i = 0; i < response.length; i++) {
            const option2 = {
                select: `cards.*`,
                where: {
                    "cards.fkCardList": response[i].count,
                    "cards.archivedStatus !=": 1,
                },
            }

            const { sql, values } = await MyModel.getRows("cards", option2);
            const resultCards = await c.env.DB.prepare(sql).bind(...values).all();
            response[i].cardLists = resultCards.results;

            if (resultCards.success) {
                const option3 = {
                    select: `cardSequence.*`,
                    where: {
                        "cardSequence.fkCardList": response[i].count,
                    },
                }

                const { sql, values } = await MyModel.getRows("cardSequence", option3);
                const resultCardSequence = await c.env.DB.prepare(sql).bind(...values).all();
                response[i].cardSequence = resultCardSequence.results
            }
        }

        if (!response) {
            return c.json(new HttpException(404, "cardLists  not found"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    getSequence = async (c, next) => {
        const id = c.req.param('id');
        const options = {
            select: `cardListsequence.*`,
            where: {
                "cardListsequence.modelId": id,
            },
        };

        const { sql, values } = await MyModel.getRows("cardListsequence", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, "sequence  not found"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    archiveList = async (req, res, next) => {
        const { count, modelId, newCrdListSeq } = req.body;

        const set = {
            status: "Archived",
        };
        const where = {
            count: count,
        };

        const result = await MyModel.update("cardLists", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        await MyModel.update(
            "cardListsequence",
            {
                cardListSeq: JSON.stringify(newCrdListSeq),
            },
            {
                modelId: modelId,
            }
        );

        const { affectedRows, changedRows, info } = result;
        console.log(result);
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    archiveCard = async (req, res, next) => {
        const { count, fkCardList, filterNewSeq } = req.body;

        const set = {
            archivedStatus: 1,
        };
        const where = {
            count: count,
        };

        const result = await MyModel.update("cards", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        await MyModel.update(
            "cardSequence",
            {
                sequence: JSON.stringify(filterNewSeq),
            },
            {
                fkCardList: fkCardList,
            }
        );

        const { affectedRows, changedRows, info } = result;
        console.log(result);
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    updateCard = async (req, res, next) => {
        const set = {
            fkCardList: req.body.fkCardList,
        };
        const where = {
            id: req.body.id,
        };

        const result = await MyModel.update("cards", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        console.log(result);
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    updateCardInfo = async (req, res, next) => {
        console.log(req.body);

        const set = {
            summary: req.body.summary,
            description: req.body.description,
        };
        const where = {
            count: req.body.count,
        };

        const result = await MyModel.update("cards", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        console.log(result);
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    updateCardListSequence = async (req, res, next) => {
        const set = {
            cardListSeq: JSON.stringify(req.body.cardListSeq),
        };
        const where = {
            modelId: req.body.modelId,
        };

        const result = await MyModel.update("cardListsequence", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        console.log(result);
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    updateCardInListSequence = async (req, res, next) => {
        const set = {
            sequence: req.body.sequence,
        };
        const where = {
            fkCardList: req.body.fkCardList,
        };

        const result = await MyModel.update("cardSequence", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        console.log(result);
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    renameList = async (req, res, next) => {
        const set = {
            name: req.body.name,
        };
        const where = {
            count: req.body.count,
        };

        const result = await MyModel.update("cardLists", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        console.log(result);
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    sendTicketCardComment = async (req, res, next) => {
        const { fkCard, content, dateTime, addedBy } = req.body;

        let insertData = {
            fkCard: fkCard,
            content: content,
            dateTime: new Date(),
            addedBy: addedBy,
            type: "comment",
        };

        const response = await MyModel.insert("cardActivities", insertData);
        if (response === 0) {
            throw new HttpException(
                500,
                "Something went wrong adding of model changes"
            );
        }

        const formatted = formatData({
            message: "Model changes saved!",
            insertId: response,
        });
        res.status(200).send(formatted);
    };

    getCardActivities = async (req, res, next) => {
        const { id } = req.params;
        const options = {
            select: `
        CONCAT(userdetails.firstname,' ', userdetails.lastname) empName,
        userdetails.avatar,
        cardActivities.*`,
            where: {
                fkCard: id,
                "cardActivities.status": "Active",
            },
            join: {
                users: "users.ID = cardActivities.addedBy",
                userdetails: "users.count =  userdetails.fkUsercount",
            },
            order: "count DESC",
        };

        const response = await MyModel.getRows("cardActivities", options);
        if (!response) {
            throw new HttpException(404, "Projects  not found");
        }

        const formatted = formatData(response);
        res.status(200).send(formatted);
    };

    sendTicketCardStatus = async (req, res, next) => {
        const set = {
            status: JSON.stringify(req.body.objStatus),
        };
        const where = {
            count: req.body.count,
        };

        const result = await MyModel.update("cards", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    sendticketCardMembers = async (req, res, next) => {
        const { cardMembers, fkCardId, type } = req.body;

        const where = {
            fkCardId: fkCardId,
            userID: cardMembers.ID,
        };

        const checkExists = await MyModel.getRows("ticketCardMembers", {
            where: where,
        });

        if (checkExists.length > 0) {
            const set = {
                status: type,
            };
            const response = await MyModel.update("ticketCardMembers", set, where);
            const { affectedRows, changedRows, info } = response;
            const message = !affectedRows
                ? "Data not found"
                : affectedRows && changedRows
                    ? "Data updated successfully"
                    : affectedRows && !changedRows
                        ? "Data was found but already up to date"
                        : "Update failed!";
            const formatted = formatData({ message, info });
            res.status(200).send(formatted);
        } else {
            const insertData = {
                fkCardId: fkCardId,
                status: type,
                readstatus: "false",
                readThread: "All",
                avatar: cardMembers.avatar,
                userID: cardMembers.ID,
                name: cardMembers.empName,
            };

            const response = await MyModel.insert("ticketCardMembers", insertData);
            const formatted = formatData({
                message: "ticketCardMembers  saved!",
                insertId: response,
            });
            res.status(200).send(formatted);
        }
    };

    geticketCardMembers = async (req, res, next) => {
        const { id } = req.params;
        const options = {
            select: "*",
            where: {
                fkCardId: id,
                status: "Active",
            },
        };

        const response = await MyModel.getRows("ticketCardMembers", options);
        if (!response) {
            throw new HttpException(404, "Projects  not found");
        }

        const formatted = formatData(response);
        res.status(200).send(formatted);
    };

    addPO = async (c, next) => {
        const body = await c.req.json();
        const { Id, modelId, addedBy, Items } = body;

        const purchaseOrderData = {
            Id: Id,
            modelId: modelId,
            addedBy: addedBy,
            status: "For Approval",
            dateAdded: new Date().toDateString(),
        };

        if (Items.length === 0) {
            return c.json(new HttpException(404, "You haven't selected Items to order!"), 404);
        }

        var isOk = 0;
        var ii;
        for (ii = 0; ii < Items.length; ii++) {
            const options = {
                select: "availableQty	",
                where: {
                    count: Items[ii].count,
                },
            };

            const { sql, values } = await MyModel.getRows("consumables", options);
            const result = await c.env.DB.prepare(sql).bind(...values).all();

            const chekcQTY = result.results;

            if (
                parseFloat(chekcQTY[0].availableQty) > parseFloat(Items[ii].orderQty)
            ) {
                isOk++;
            }
        }

        if (isOk !== Items.length) {
            return c.json(new HttpException(404, "Please add appropriate qty!"), 404);
        }

        const { sql, values } = await MyModel.insert("purchaseOrder", purchaseOrderData);
        const result = await c.env.DB.prepare(sql).bind(...values).run();

        var i;
        for (i = 0; i < Items.length; i++) {
            const options2 = {
                select: "availableQty	",
                where: {
                    count: Items[i].count,
                },
            };
            let chekcQTYRres;

            if (result.success) {
                const { sql, values } = await MyModel.getRows("consumables", options2);
                chekcQTYRres = await c.env.DB.prepare(sql).bind(...values).all();
            }

            const chekcQTY = chekcQTYRres.results;
            const newQty =
                parseFloat(chekcQTY[0].availableQty) - parseFloat(Items[i].orderQty);

            const set = { availableQty: newQty };
            const where = { count: Items[i].count };

            const { sql, values } = await MyModel.update("consumables", set, where);
            const resultUpdateConsumables = await c.env.DB.prepare(sql).bind(...values).run();

            if (resultUpdateConsumables.success) {
                const itemData = {
                    fkPo: result.meta.last_row_id.toString(),
                    fkItemCount: Items[i].count,
                    orderQty: Items[i].orderQty,
                    status: "For Approval",
                };

                const { sql, values } = await MyModel.insert("orderDetails", itemData);
                await c.env.DB.prepare(sql).bind(...values).run();
            }
        }

        const logData = {
            ID: shortid.generate(),
            fkModel: modelId,
            refId: result.meta.last_row_id.toString(),
            description: "New Order added.",
            dateTime: new Date().toDateString(),
            addedBy: addedBy,
            type: "Add PO",
        };

        if (result.success) {
            const { sql, values } = await MyModel.insert("consumableLogs", logData);
            await c.env.DB.prepare(sql).bind(...values).run();
        }

        if (result.meta.last_row_id.toString() == 0) {
            return c.json(new HttpException(404, "Something went wrong adding of projects"), 404);
        }
        const formatted = formatData({
            message: "Project was added!",
            insertId: result.meta.last_row_id.toString(),
        });
        return c.json(formatted);
    };

    gePO = async (c, next) => {
        const body = await c.req.json();
        const { modelId, status } = body;

        let options = {
            select: `
          userdetails.firstname || ' ' || userdetails.lastname AS empName,
          purchaseOrder.*,
          projectModels.location
        `,
            where: {
                "purchaseOrder.modelId": modelId,
            },
            join: {
                projectModels: "projectModels.modelId = purchaseOrder.modelId",
                userdetails: "userdetails.fkUsercount = purchaseOrder.addedBy",
            },
        };

        if (status !== "All") {
            options.where = {
                "purchaseOrder.modelId": modelId,
                "purchaseOrder.status": status,
            };
        }

        const { sql, values } = await MyModel.getRows("purchaseOrder", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, "Projects  not found"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    };

    getPoDetails = async (c, next) => {
        const id = c.req.param('id');

        let options = {
            select: `
          orderDetails.*,
          consumables.itemName,
          consumables.qty as TotalQty,
          consumables.availableQty as available
  
        `,
            where: {
                "orderDetails.fkPo": id,
            },
            join: {
                consumables: "consumables.count = orderDetails.fkItemCount",
            },
        };

        const { sql, values } = await MyModel.getRows("orderDetails", options);
        const response = await c.env.DB.prepare(sql).bind(...values).all();
        if (!response) {
            throw c.json(new HttpException(404, "Projects  not found"));
        }

        const formatted = formatData(response.results);
        return c.json(formatted);
    };

    acknowledgeOrders = async (c, next) => {
        const body = await c.req.json();
        const { count, status, Items, ProjectCount, addedby, modelId } = body;

        const set = {
            status: status,
        };

        const where = {
            count: count,
        };

        // const result = await MyModel.update("purchaseOrder", set, where);

        const { sql, values } = await MyModel.update("purchaseOrder", set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();

        if (!result) {
            throw c.json(new HttpException(404, "Something went wrong"));
        }
        let message = '';

        var i;
        for (i = 0; i < Items.length; i++) {
            const setUpdateHeadItems = {
                qty: parseFloat(Items[i].TotalQty) - parseFloat(Items[i].orderQty),
            };
            const whereUpdateHeadItems = { count: Items[i].fkItemCount };

            const { sql, values } = await MyModel.update("consumables", setUpdateHeadItems, whereUpdateHeadItems);
            const updateConsumables = await c.env.DB.prepare(sql).bind(...values).run();

            if (updateConsumables.success) {

                const { sql, values } = await MyModel.getRows("projectConsumables", {
                    select: "qty",
                    where: { fkProject: ProjectCount, fkConsumables: Items[i].fkItemCount },
                });
                const checkExists = await c.env.DB.prepare(sql).bind(...values).all();

                if (checkExists.results.length > 0) {
                    message = 'Data was found but already up to date'
                } else {
                    message = 'Data updated successfully'
                }

                if (checkExists.success && checkExists.results.length > 0) {
                    const setUpdateProjecttems = {
                        qty: parseFloat(checkExists[0].qty) + parseFloat(Items[i].orderQty),
                    };
                    const whereUpdateProjecttems = {
                        fkConsumables: Items[i].fkItemCount,
                        fkProject: ProjectCount,
                    };

                    const { sql, values } = await MyModel.update("projectConsumables", setUpdateProjecttems, whereUpdateProjecttems);
                    const updateProjectConsumable = await c.env.DB.prepare(sql).bind(...values).run();
                }

            } else {
                const { sql, values } = await MyModel.insert("projectConsumables", {
                    fkProject: ProjectCount,
                    fkConsumables: Items[i].fkItemCount,
                    dateAdded: new Date().toDateString(),
                    status: "In-Stock",
                    addedBy: addedby,
                    qty: Items[i].orderQty,
                });
                const projectConsumableInsert = await c.env.DB.prepare(sql).bind(...values).run();

                return c.json(projectConsumableInsert);
            }
        }

        if (result.success) {
            const logData = {
                ID: shortid.generate(),
                fkModel: modelId,
                refId: count,
                description: "Acknowleged Order by user",
                dateTime: new Date().toDateString(),
                addedBy: addedby,
                type: "Acknowleged PO",
            };

            const { sql, values } = await MyModel.insert("consumableLogs", logData);
            await c.env.DB.prepare(sql).bind(...values).run();
        }

        const { affectedRows, changedRows, info } = result;
        // const message = !affectedRows
        //     ? "Data not found"
        //     : affectedRows && changedRows
        //         ? "Data updated successfully"
        //         : affectedRows && !changedRows
        //             ? "Data was found but already up to date"
        //             : "Update failed!";

        const formatted = formatData({ message });
        return c.json(formatted);
    };

    getSpaces = async (c, next) => {
        const body = await c.req.json();
        const { id, selectedStatus } = body;

        let options = {
            select: `*`,
            where: {
                fkModel: id,
            },
        };

        if (selectedStatus !== "All") {
            options.where.status = selectedStatus;
        }

        const { sql, values } = await MyModel.getRows("projectModelSpaces", options);

        const response = await c.env.DB.prepare(sql).bind(...values).all();
        if (!response.success) {
            return c.json(new HttpException(404, "Projects  not found"), 404);
        }

        const formatted = formatData(response.results);
        return c.json(formatted);
    };

    getProjectConsumableLogs = async (c, next) => {
        const id = c.req.param('id');

        let options = {
            select: `
          consumableLogs.*,
          CONCAT(userdetails.firstname,' ', userdetails.lastname) empName
        `,
            where: {
                fkModel: id,
            },
            join: {
                userdetails: "userdetails.fkUsercount  = consumableLogs.addedBy",
            },
        };

        const { sql, values } = await MyModel.getRows("consumableLogs", options);
        const response = await c.env.DB.prepare(sql).bind(...values).all();
        if (!response) {
            throw c.json(new HttpException(404, "Projects  not found"));
        }

        const formatted = formatData(response.results);
        return c.json(formatted);
    };

    deleteAttachment = async (req, res, next) => {
        const { count, fileName, fkCard, addedBy } = req.body;

        let insertData = {
            fkCard: fkCard,
            dateTime: new Date(),
            addedBy: addedBy,
            type: "delete",
            fileName: fileName,
            content: `deleted the  ${fileName} from this card`,
        };

        const response = await MyModel.insert("cardActivities", insertData);

        if (response === 0) {
            throw new HttpException(
                500,
                "Something went wrong adding of card activities!"
            );
        }

        const set = {
            status: "Deleted",
        };
        const where = {
            count: count,
        };
        await MyModel.update("cardActivities", set, where);

        const formatted = formatData({
            message: "Model changes saved!",
            insertId: response,
        });
        res.status(200).send(formatted);
    };

    updateComment = async (req, res, next) => {
        const { content, count } = req.body;

        const set = {
            content: content,
        };
        const where = {
            count: count,
        };

        const result = await MyModel.update("cardActivities", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    deleteComment = async (req, res, next) => {
        const { count } = req.body;

        const set = {
            status: "Deleted",
        };
        const where = {
            count: count,
        };

        const result = await MyModel.update("cardActivities", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    deleteTicketComment = async (req, res, next) => {
        const { count } = req.body;

        const set = {
            status: "Deleted",
        };
        const where = {
            count: count,
        };

        const result = await MyModel.update("commentConvo", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

    updateTicketComment = async (req, res, next) => {
        const { content, count } = req.body;

        const set = {
            comment: content,
        };
        const where = {
            count: count,
        };

        const result = await MyModel.update("commentConvo", set, where);
        if (!result) {
            throw new HttpException(404, "Something went wrong");
        }

        const { affectedRows, changedRows, info } = result;
        const message = !affectedRows
            ? "Data not found"
            : affectedRows && changedRows
                ? "Data updated successfully"
                : affectedRows && !changedRows
                    ? "Data was found but already up to date"
                    : "Update failed!";

        const formatted = formatData({ message, info });
        res.status(200).send(formatted);
    };

}


/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new Model();

