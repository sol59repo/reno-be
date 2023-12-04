import { sign } from 'hono/jwt'
const MyModel = require('../../../models/MyModel');
const HttpException = require('../../../utils/HttpException.utils');
// const { validationResult } = require('express-validator');
const { logInScehma, } = require("../validators/login.validator");
const { sendEmail } = require('../../../utils/common.utils');
const { formatData } = require("../../../utils/settings");
const bcrypt = require('bcryptjs');

/******************************************************************************
 *                              User Controller
 ******************************************************************************/
class Login {
    tblUser = 'users';
    tblUserDetails = '';
    tbleEmployee = '';
    tbleEmployeeDetails = "";


    login = async (c, next) => {
        // this.checkValidation(req);
        const body = await c.req.json();
        const { ID, password: pass } = body;

        const val = logInScehma.safeParse(body);

        if (!val.success) return c.json(new HttpException(400, [val.error.issues[0].message] ?? 'Validation error'), 400);

        const tableName = this.tblUser;
        const options = {
            select: 'users.count,ID,password,usertype,status,firstname,lastname,email,avatar',
            where: { "ID": ID },
            join: {
                "userdetails": "userdetails.fkUsercount=users.count"
            }
        }

        const { sql, values } = await MyModel.getRows(tableName, options);
        const userLogin = await c.env.DB.prepare(sql).bind(...values).all();


        if (userLogin.results.length === 0) {
            return c.json(new HttpException(404, ['Incorrect ID!']), 404);
        }


        const account = userLogin.results[0];
        if (account.status !== "Active") {
            throw new HttpException(401, ['Your account has been deactivated!']);
        }

        const isMatch = await bcrypt.compare(pass, account.password);
        if (!isMatch) {
            console.log('!isMatch');
            throw new HttpException(401, ['Incorrect password!']);
        }

        const secretKey = "reno#@!@2022";
        const token = await sign({
            user_id: account.count.toString(),
            exp: "24h"
        }, secretKey)
        const { password, ...userWithoutPassword } = account;
        const response = formatData({ ...userWithoutPassword, token: token })
        return c.json(response);
    };

    // create = async (req, res, next) => {
    //     this.checkValidation(req);
    //     await this.hashPassword(req);
    //     //   const { confirm_password, ...restOfUpdates } = req.body;
    //     let usersData = {
    //         password: req.body.password,
    //         email: req.body.email,
    //         status: 1,
    //         account_type: 'Basic'
    //     }

    //     const resultUser = await MyModel.insert(`${this.tableName}`, usersData);
    //     if (resultUser == 0) {
    //         console.log('Something went wrong');
    //         throw new HttpException(500, 'Something went wrong adding users');
    //     } else {
    //         let usersDetails = {
    //             first_name: req.body.first_name,
    //             last_name: req.body.last_name,
    //             user_id: resultUser
    //         }

    //         const resulUdetails = await MyModel.insert(`${this.tbluserdetails}`, usersDetails);
    //         if (resulUdetails == 0) {
    //             console.log('Something went wrong');
    //             throw new HttpException(500, 'Something went wrong adding tbluserdetails');
    //         }
    //     }

    //     res.status(201).send({ message: 'User was created!', insertId: resultUser });
    // }

    // updateUser = async (req, res, next) => {
    //     this.checkValidation(req);

    //     const tableName = this.tbluserdetails;
    //     const set = {
    //         first_name: req.body.first_name,
    //         last_name: req.body.last_name
    //     };
    //     const where = {
    //         user_id: req.params.id
    //     };

    //     const result = await MyModel.update(tableName, set, where);
    //     if (!result) {
    //         throw new HttpException(404, 'Something went wrong');
    //     }

    //     const { affectedRows, changedRows, info } = result;

    //     const message = !affectedRows ? 'Data not found' :
    //         affectedRows && changedRows ? 'Data updated successfully' :
    //             affectedRows && !changedRows ? 'Data was found but already up to date' : "Update failed!";
    //     res.status(200).send({ message, info });
    // }

    // deleteUser = async (req, res, next) => {
    //     const tableName = this.tbluserdetails;
    //     const where = {
    //         user_detail_id: req.body.user_detail_id,
    //         user_id: req.params.id
    //     };


    //     const result = await MyModel.delete(tableName, where);
    //     if (!result) {
    //         throw new HttpException(404, 'Data not found');
    //     }
    //     res.status(200).send({ message: 'Data has been deleted' });
    // }

    // getUser = async (req, res, next) => {
    //     const tableName = this.tableName;
    //     const where = {
    //         user_id: req.params.id
    //     };
    //     // console.log(where);
    //     const options = {
    //         select: 'users.user_id,email,first_name,last_name',
    //         // where    : {"email" : 'test@gmmail.com'},
    //         //  where_in   : {
    //         //         "col"   : 'user_detail_id',
    //         //         "value" : [12,19]
    //         //  },
    //         //   where_not_in   : {
    //         //         "col"   : 'user_detail_id',
    //         //         "value" : [12,19,20]
    //         //  },
    //         // or_where : {
    //         //     first_name :"first",
    //         //     last_name  :"last"
    //         // },
    //         // order    : ' user_id DESC ', // PUT  COMMA SEPARTOR INSIDE STRING IF 2 COLUMNS
    //         // group       : 'first_name,last_name', // PUT  COMMA SEPARTOR INSIDE STRING IF 2 COLUMNS
    //         // limit       : '5,35',
    //         join: { "user_details": "user_details.user_id = users.user_id" }
    //     }

    //     const user = await MyModel.getRows(tableName, options);
    //     if (!user) {
    //         throw new HttpException(404, 'User not found');
    //     }

    //     const users = JSON.parse(JSON.stringify(user));
    //     res.status(200).send({ data: users });

    // }

    // checkValidation = (req) => {
    //     const errors = validationResult(req)
    //     if (!errors.isEmpty()) {
    //         throw new HttpException(400, 'Validation faild', errors);
    //     }
    // }

    // // hash password if it exists
    // hashPassword = async (req) => {
    //     if (req.body.password) {
    //         req.body.password = await bcrypt.hash(req.body.password, 8);
    //     }
    // }


    // //  USED FOR  FORGOT PASS   BOT ADMIN AND  MOBILE APP
    // verifyEmail = async (req, res, next) => {
    //     this.checkValidation(req);
    //     const tableName = 'users';
    //     const options = {
    //         select: 'email,user_id',
    //         where: { "email": req.body.email },
    //     }
    //     const user = await MyModel.getRows(tableName, options);
    //     if (user.length == 0) {
    //         throw new HttpException(404, 'Email not found', { errors: [{ msg: 'Email not found' }] });
    //     }
    //     const _users = JSON.parse(JSON.stringify(user));
    //     const _users_ = _users[0];
    //     let code = await this.forgotpasscode();
    //     const result = await MyModel.update(tableName, { forgotpasscode: code }, { user_id: _users[0].user_id });
    //     let params = {
    //         title: "Password Recovery",
    //         content: `Your recovery code is: <b> ${code}</b> `,
    //         to: req.body.email,
    //         subject: "Forgot Password",
    //         isTXT: false
    //     }
    //     sendEmail(params);

    //     if (!result) {
    //         throw new HttpException(404, 'Something went wrong');
    //     }
    //     const { affectedRows, changedRows, info } = result;
    //     const message = !affectedRows ? 'Data not found' :
    //         affectedRows && changedRows ? 'Data updated successfully' :
    //             affectedRows && !changedRows ? 'Data was found but already up to date' : "Update failed!";
    //     res.status(200).send({ message, info, _users_ });
    // }


    // updatePass = async (req, res, next) => {
    //     this.checkValidation(req);
    //     await this.hashPassword(req);
    //     const tableName = 'users';

    //     const options = {
    //         select: 'forgotpasscode,user_id',
    //         where: { 'user_id': req.body.user_id, 'forgotpasscode': req.body.forgotpasscode },
    //     }
    //     const user = await MyModel.getRows(tableName, options);
    //     if (user.length == 0) {
    //         throw new HttpException(404, 'Invalid Code', { errors: [{ msg: 'Verification Code already expired/used, If you forgot new password, redo the process' }] });
    //     }

    //     const result = await MyModel.update(tableName, { password: req.body.password }, { user_id: req.body.user_id });
    //     if (!result) {
    //         throw new HttpException(404, 'Something went wrong');
    //     }
    //     await MyModel.update(tableName, { forgotpasscode: null }, { user_id: req.body.user_id });
    //     const { affectedRows, changedRows, info } = result;
    //     const message = !affectedRows ? 'Data not found' :
    //         affectedRows && changedRows ? 'Data updated successfully' :
    //             affectedRows && !changedRows ? 'Data was found but already up to date' : "Update failed!";
    //     res.status(200).send({ message, info });
    // }

    // verifyCode = async (req, res, next) => {
    //     this.checkValidation(req);
    //     const tableName = 'users';
    //     const options = {
    //         select: 'forgotpasscode,user_id',
    //         where: { "email": req.body.email, 'user_id': req.body.user_id, 'forgotpasscode': req.body.code },
    //     }
    //     const user = await MyModel.getRows(tableName, options);
    //     if (user.length == 0) {
    //         throw new HttpException(404, 'Invalid Code', { errors: [{ msg: 'Invalid Code' }] });
    //     }
    //     const _users = JSON.parse(JSON.stringify(user));
    //     const _users_ = _users[0];
    //     res.status(200).send({ _users_ });
    // }


    // forgotpasscode = async () => {
    //     let code = new Date().getTime().toString().slice(-6);
    //     let shuffle = [...code];
    //     // Defining function returning random value from i to N
    //     const getRandomValue = (i, N) => Math.floor(Math.random() * (N - i) + i);
    //     // Shuffle a pair of two elements at random position j (Fisher-Yates)
    //     shuffle.forEach((elem, i, arr, j = getRandomValue(i, arr.length)) => [arr[i], arr[j]] = [arr[j], arr[i]]);
    //     // Transforming array to string
    //     shuffle = shuffle.join('');
    //     return shuffle;
    // }
}


/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new Login;
