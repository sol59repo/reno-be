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
            ID: Math.floor(Math.random() * 90000) + 10000,
            password: data.password,
            usertype: 'Admin',
            status: 'Active'
        }

        const val = createAccountSchema.safeParse(data);

        if (!val.success) return c.text("Validation faild", 400);

        const insertUser = await MyModel.insert(`${this.tableName}`, usersData);

        const resulInsertedUser = await c.env.DB.prepare(insertUser).bind(usersData.ID, data.password, usersData.usertype, usersData.status).run();

        if (Math.trunc(resulInsertedUser.meta.last_row_id) == 0) {
            console.log('Something went wrong');
            throw new HttpException(500, 'Something went wrong adding users');
        } else {
            let usersDetailsData = {
                fkUsercount: Math.trunc(resulInsertedUser.meta.last_row_id),
                firstname: data.first_name,
                lastname: data.last_name,
                email: data.email,
                Address: 'test',
                gender: 'male',
                birthdate: Date.now(),
                dateAdded: Date.now(),
            }

            const insertUserDetails = await MyModel.insert(`${this.tbluserdetails}`, usersDetailsData);
            const resulInsertedUserDetails = await c.env.DB.prepare(insertUserDetails).bind(usersDetailsData.fkUsercount, data.first_name, data.last_name, data.email, usersDetailsData.Address, usersDetailsData.gender, usersDetailsData.gender, Date.now()).run();

            if (resulInsertedUserDetails.meta.last_row_id == 0) {
                console.log('Something went wrong');
                throw new HttpException(500, 'Something went wrong adding tbluserdetails');
            }

            return c.text("Account Created");
        }
    }

    updateUser = async (c, next) => {
        const id = c.req.param();
        const data = await c.req.json();

        const val = updateAccountSchema.safeParse(data);
        if (!val.success) return c.text("Validation faild", 400);

        const tableName = this.tbluserdetails;
        const set = {
            firstname: data.first_name,
            lastname: data.last_name,
        };
        const where = {
            fkUsercount: id.id,
        };

        //get data to validate if user and users detail exist
        const getData = await MyModel.getOne(tableName, where);
        const getDataResult = await c.env.DB.prepare(getData).bind(id.id).run();

        if (Array.isArray(getDataResult.results) && getDataResult.results.length > 0) {
            const result = await MyModel.update(tableName, set, where);
            const resultData = await c.env.DB.prepare(result).bind(set.firstname, set.lastname, id.id,).run();

            if (!resultData) {
                return c.text("Data not found!", 404);
            }
            return c.text("Account Updated");
        } else {
            return c.text("Data not found");
        }

    }

    deleteUser = async (c, next) => {
        const id = c.req.param();

        const tableName = this.tbluserdetails;
        const where = {
            fkUsercount: id.id,
        };

        //get data to validate if user and users detail exist
        const getData = await MyModel.getOne(tableName, where);
        const getDataResult = await c.env.DB.prepare(getData).bind(id.id).run();

        console.log(getDataResult.results);

        if (Array.isArray(getDataResult.results) && getDataResult.results.length > 0) {
            const result = await MyModel.delete(tableName, where);
            const resultDelete = await c.env.DB.prepare(result).bind(id.id).run();

            if (!resultDelete) {
                return c.text("Data not found!", 404);
            }

            const tableNameUser = this.tableName;
            const whereUser = {
                count: id.id,
            };

            const resultUser = await MyModel.delete(tableNameUser, whereUser);
            const resultDeleteUser = await c.env.DB.prepare(resultUser).bind(id.id).run();

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

        const getAccountId = await MyModel.getRows(tableName, options);
        const result = await c.env.DB.prepare(getAccountId).all();

        if (!result) {
            return c.text("Data not found!", 404);
        }
        return c.json(result.results);
    }

    getUser = async (c, next) => {
        const tableName = this.tableName;
        const id = c.req.param();
        const options = {
            select: 'users.count,email,firstname,lastname',
            where: { "users.count": id },
            //  where_in   : {
            //         "col"   : 'user_detail_id',
            //         "value" : [12,19]
            //  },
            //   where_not_in   : {
            //         "col"   : 'user_detail_id',
            //         "value" : [12,19,20]
            //  },
            // or_where : {
            //     first_name :"first",
            //     last_name  :"last"
            // },
            // order    : ' user_id DESC ', // PUT  COMMA SEPARTOR INSIDE STRING IF 2 COLUMNS
            // group       : 'first_name,last_name', // PUT  COMMA SEPARTOR INSIDE STRING IF 2 COLUMNS
            // limit       : '5,35',  
            join: { "userdetails": "userdetails.fkUsercount = users.count" }
        }

        const getAccountId = await MyModel.getRows(tableName, options);
        const result = await c.env.DB.prepare(getAccountId).bind(id.id).all();

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