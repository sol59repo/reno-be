import * as MyModel from '../../../models/MyModel'
import { HTTPException } from 'hono/http-exception'
const HttpException = require('../../../utils/HttpException.utils');
const bcrypt = require('bcryptjs');
const { formatData } = require("../../../utils/settings")
const { formatDate } = require("../../../utils/helper")
const { employeeScema, employeeUpdateInfoScema} = require("../validators/employee.validator");


/******************************************************************************
 *                              Employee Controller
 ******************************************************************************/
class Employee {
    tblemployees = 'users';
    tblemployeeDetails = 'userdetails';
    tbldepartment = 'department';
    tblRoles = 'Roles';
    tblemployeeType = 'employeeType';

    getEmployees = async (c, next) => {
        const tblemployees = this.tblemployees;
        const { req } = c
        const data = await req.json();
        const { status } = data

        let where = { "users.status !=": "Deleted" }

        if (status !== "All") {
            where = {
                "users.status": status
            }
        }

        const options = {
            select: 'users.count,ID,users.status,firstname,lastname,birthdate,address,usertype',
            where: where,
            join: {
                "userdetails": "userdetails.fkUsercount = users.count",
            }
        }

        const { sql, values } = await MyModel.getRows(tblemployees, options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();
        if (!result) {
            return c.json(new HttpException(404, "Employees  not found!"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    }

    createEmloyee = async (c, next) => {
        const tblemployees = this.tblemployees;
        const tblemployeeDetails = this.tblemployeeDetails;
        const body = await c.req.json();
        await this.hashPassword(c);
        const {
            lastname,
            firstname,
            birthdate,
            address,
            gender,
            ID,
            password,
            email,
            usertype
        } = body

        const val = employeeScema.safeParse(body);

        if (!val.success) return c.json(new HttpException(400, [val.error.issues[0].message] ?? 'Validation error'), 400);

        // this.checkValidation(req);

        let usersData = {
            ID: ID,
            password: password,
            status: "Active",
            usertype: usertype
        }

        const { sql, values } = await MyModel.insert(tblemployees, usersData);
        const result = await c.env.DB.prepare(sql).bind(...values).run();

        if (result.meta.last_row_id == 0) {
            console.log('Something went wrong');
            return c.json(new HttpException(400, 'Something went wrong adding users'), 400);
        }

        let empDetails = {
            fkUsercount: result.meta.last_row_id,
            firstname: firstname.toUpperCase(),
            lastname: lastname.toUpperCase(),
            birthdate: birthdate,
            address: address,
            gender: gender,
            email: email,
            dateAdded: formatDate(new Date())
        }

        const { sql: sql2, values: values2 } = await MyModel.insert(`${tblemployeeDetails}`, empDetails);
        const resulempDetails = await c.env.DB.prepare(sql2).bind(...values2).run();
        if (resulempDetails.meta.last_row_id == 0) {
            return c.json(new HttpException(400, 'Something went wrong adding users'), 400);
        }

        const formatted = formatData({ message: 'User was created!', insertId: result.meta.last_row_id });
        return c.json(formatted);
    }


    updateInfo = async (c, next) => {
        // this.checkValidation(req);

        const tableName = this.tblemployeeDetails;
        const body = await c.req.json();

        const {
            Email,
            Address,
            Birthdate,
            Firstname,
            Lastname,
            fkUsercount,
            zoomLink
        } = body

        const val = employeeUpdateInfoScema.safeParse(body);

        if (!val.success) return c.json(new HttpException(400, [val.error.issues[0].message] ?? 'Validation error'), 400);

        const set = {
            Email: Email,
            Address: Address,
            Birthdate: Birthdate,
            Firstname: Firstname,
            Lastname: Lastname,
            zoomLink: zoomLink,

        };

        const where = {
            fkUsercount: fkUsercount
        };

        const { sql, values } = await MyModel.update(tableName, set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();
        console.log(JSON.stringify(result, null, 2));

        if (result && !result.success) {
            return c.json(new HttpException(400, 'Something went wrong'), 400);
        }

        const formatted = formatData({
            "message": "Data updated successfully",
            "info": `Rows matched: ${result.meta.rows_written}  Changed: ${result.meta.changes}`
        });

        return c.json(formatted);
    }

    updateStatus = async (c, next) => {
        const body = await c.req.json();
        const { count, status } = body;
        const tblemployees = this.tblemployees;

        const set = {
            status: status,
        };
        const where = {
            count: count
        };

        const { sql, values } = await MyModel.update(tblemployees, set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();
        console.log(JSON.stringify(result, null, 2));

        if (result && !result.success) {
            return c.json(new HttpException(400, 'Something went wrong'), 400);
        }

        const formatted = formatData({
            "message": "Data updated successfully",
            "info": `Rows matched: ${result.meta.rows_written}  Changed: ${result.meta.changes}`
        });

        return c.json(formatted);
    }

    getEmployee = async (c, next) => {
        const tblemployees = this.tblemployees;
        const id = c.req.param('id')

        console.log("id=====>>>>>>>>>>", id)

        const options = {
            select: `
            userdetails.*,
            userdetails.firstname || ' ' || userdetails.lastname AS empName,
            users.ID,
            users.usertype
            `,
            where: {
                ID: id
            },
            join: {
                "userdetails": "userdetails.fkUsercount = users.count",
            }
        }

        const { sql, values } = await MyModel.getRows(tblemployees, options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, 'Employees  not found'), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    }


    hashPassword = async (c) => {
        const body = await c.req.json();
        if (body.password) {
            body.password = await bcrypt.hash(body.password, 8);
        }
    }

}


/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new Employee;

