const HttpException = require("../../../utils/HttpException.utils");

import * as MyModel from '../../../models/MyModel'

class Users {
    getList = async (c, next) => {
        const getAccountId = await MyModel.getRows("entity");
        const result = await c.env.DB.prepare(getAccountId).all();

        if (!result) {
            throw new HttpException(404, "Entities  not found");
        }
        return c.json(result.results);
    };
}

/******************************************************************************
 *                               Export
 ******************************************************************************/
module.exports = new Entities();
