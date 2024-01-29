const HttpException = require("../../../utils/HttpException.utils");
const { createAccountSchema, deleteAccountSchema, updateAccountSchema } = require("../validators/account.validator");
const bcrypt = require('bcryptjs');

import * as MyModel from '../../../models/MyModel'

/******************************************************************************
 *                              Account Controller
 ******************************************************************************/
class Account {
    tableName = 'users';
    tbluserdetails = 'userdetails';

    create = async (c, next) => {
        const data = await c.req.json();
        // this.checkValidation(req);
        await this.hashPassword(data);
        // const { confirm_password, ...restOfUpdates } = data;
        console.log(data);
        let usersData = {
            ID: data.ID,
            password: data.password,
            usertype: 'Admin',
            status: 'Active'
        }

        const val = createAccountSchema.safeParse(data);

        if (!val.success) return c.json(new HttpException(400, [val.error.issues[0].message] ?? 'Validation error'), 400);

        const { sql, values } = await MyModel.insert(`${this.tableName}`, usersData);

        const resulInsertedUser = await c.env.DB.prepare(sql).bind(...values).run();

        if (Math.trunc(resulInsertedUser.meta.last_row_id) == 0) {
            console.log('Something went wrong');
            throw new HttpException(500, 'Something went wrong adding users');
        } else {
            let usersDetailsData = {
                fkUsercount: Math.trunc(resulInsertedUser.meta.last_row_id.toString()),
                firstname: data.first_name,
                lastname: data.last_name,
                email: data.email,
                Address: 'test',
                gender: 'male',
                birthdate: Date.now(),
                dateAdded: Date.now(),
            }

            const  { sql, values } = await MyModel.insert(`${this.tbluserdetails}`, usersDetailsData);
            const resulInsertedUserDetails = await c.env.DB.prepare(sql).bind(...values).run();

            if (resulInsertedUserDetails.meta.last_row_id == 0) {
                console.log('Something went wrong');
                throw new HttpException(500, 'Something went wrong adding tbluserdetails');
            }

            return c.text("Account Created");
        }
    }

    updateUser = async (c, next) => {
        const id = c.req.param('id');
        const data = await c.req.json();

        const val = updateAccountSchema.safeParse(data);
        if (!val.success) return c.json(new HttpException(400, [val.error.issues[0].message] ?? 'Validation error'), 400);

        const tableName = this.tbluserdetails;
        const set = {
            firstname: data.first_name,
            lastname: data.last_name,
        };
        const where = {
            fkUsercount: id,
        };

        //get data to validate if user and users detail exist
        const { sql, values } = await MyModel.getOne(tableName, where);
        const getDataResult = await c.env.DB.prepare(sql).bind(...values).run();

        if (Array.isArray(getDataResult.results) && getDataResult.results.length > 0) {
            const { sql, values } = await MyModel.update(tableName, set, where);
            const resultData = await c.env.DB.prepare(sql).bind(...values).run();

            if (!resultData) {
                return c.text("Data not found!", 404);
            }
            return c.text("Account Updated");
        } else {
            return c.text("Data not found");
        }

    }

    deleteUser = async (c, next) => {
        const id = c.req.param('id');

        const tableName = this.tbluserdetails;
        const where = {
            fkUsercount: id,
        };

        //get data to validate if user and users detail exist
        const getData = await MyModel.getOne(tableName, where);
        const getDataResult = await c.env.DB.prepare(getData).bind(id).run();

        console.log(getDataResult.results);

        if (Array.isArray(getDataResult.results) && getDataResult.results.length > 0) {
            const result = await MyModel.delete(tableName, where);
            const resultDelete = await c.env.DB.prepare(result).bind(id).run();

            if (!resultDelete) {
                return c.text("Data not found!", 404);
            }

            const tableNameUser = this.tableName;
            const whereUser = {
                count: id,
            };

            const resultUser = await MyModel.delete(tableNameUser, whereUser);
            const resultDeleteUser = await c.env.DB.prepare(resultUser).bind(id).run();

            return c.text("Account deleted!");

        } else {
            return c.text("Data not found");
        }
    }

    userList = async (c, next) => {
        const tableName = this.tableName;
        const id = c.req.param();
        const options = {
            select: 'users.count,email,firstname,lastname',
            join: { "userdetails": "userdetails.fkUsercount = users.count" }
        }

        const { sql, values } = await MyModel.getRows(tableName, options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.text("Data not found!", 404);
        }
        return c.json(result.results);
    }

    getUser = async (c, next) => {
        const tableName = this.tableName;
        const id = c.req.param('id');
        const options = {
            select: 'users.count,email,firstname,lastname',
            where: { "users.count": id },
            join: { "userdetails": "userdetails.fkUsercount = users.count" }
        }

        const { sql, values } = await MyModel.getRows(tableName, options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            throw new HttpException(404, "Entities  not found");
        }
        return c.json(result.results);
    }

    // hash password if it exists
    hashPassword = async (data) => {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 8);
        }
    }
}



/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new Account;