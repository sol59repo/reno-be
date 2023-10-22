const MyModel = require('../../../models/MyModel');
const HttpException = require('../../../utils/HttpException.utils');
const { formatData } = require("../../../utils/settings");
const { formatDate } = require("../../../utils/helper")
const shortid = require('shortid');

class Consumables {
    tblconsumables = 'consumables';

    createItems = async (c, next) => {
        const tblconsumables = this.tblconsumables;
        const body = await c.req.json();

        const {
            itemName,
            qty,
            addedBy,
            itemCode
        } = body

        // this.checkValidation(req);

        const compIniitial = "01-"

        let itemData = {
            itemCode: `${compIniitial}${itemCode}`,
            status: "In-Stock",
            itemName: itemName,
            description: itemName,
            keyword: itemName,
            qty: qty,
            addedBy: addedBy,
            dateAdded: formatDate(new Date()),
            availableQty: qty
        }

        const { sql, values } = await MyModel.insert(tblconsumables, itemData);

        const result = await c.env.DB.prepare(sql).bind(...values).run();
        if (result && result.meta.last_row_id == 0) {
            return c.json(new HttpException(400, 'Something went wrong adding consumables'), 400);
        }

        const formatted = formatData({ message: 'consumable was created!', insertId: result.meta.last_row_id });
        return c.json(formatted);
    }


    getConsumables = async (c, next) => {
        const tblconsumables = this.tblconsumables;
        const body = await c.req.json();
        const { status } = body
        let where = { "consumables.status !=": "Deleted" }

        if (status !== "All") {
            where = {
                "consumables.status": status
            }
        }

        const options = {
            select: '*',
            where: where,
        }

        const { sql, values } = await MyModel.getRows(tblconsumables, options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();
        if (!result) {
            return c.json(new HttpException(404, "Employees  not found!"), 404);
        }
        const formatted = formatData(result.results);
        return c.json(formatted);
    }

    updateInfo = async (c, next) => {
        const tblconsumables = this.tblconsumables;
        const body = await c.req.json();
        const { count, itemName, qty } = body;

        const set = {
            qty: qty,
            itemName: itemName
        };
        const where = {
            count: count
        };

        const { sql, values } = await MyModel.update(tblconsumables, set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();

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
        const tblconsumables = this.tblconsumables;
        const body = await c.req.json();
        const { itemCode, status } = body;

        const set = {
            status: status,
        };
        const where = {
            itemCode: itemCode
        };

        const { sql, values } = await MyModel.update(tblconsumables, set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();

        if (result && !result.success) {
            return c.json(new HttpException(400, 'Something went wrong'), 400);
        }

        const formatted = formatData({
            "message": "Data updated successfully",
            "info": `Rows matched: ${result.meta.rows_written}  Changed: ${result.meta.changes}`
        });

        return c.json(formatted);
    }

    updatePoStatus = async (c, next) => {
        const body = await c.req.json();
        const { count, status, modelId, addedBy } = body;

        const set = {
            status: status,
        };

        const where = {
            count: count
        };

        const { sql, values } = await MyModel.update("purchaseOrder", set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();

        if (result && !result.success) {
            return c.json(new HttpException(400, 'Something went wrong'), 400);
        }

        const logData = {
            ID: shortid.generate(),
            fkModel: modelId,
            refId: count,
            description: "Approved Order",
            dateTime: formatDate(new Date()),
            addedBy: addedBy,
            type: "Approved PO",
        }

        const { sql: insert_log, values: values_log } = await MyModel.insert("consumableLogs", logData);
        await c.env.DB.prepare(insert_log).bind(...values_log).run();

        const formatted = formatData({
            "message": "Data updated successfully",
            "info": `Rows matched: ${result.meta.rows_written}  Changed: ${result.meta.changes}`
        });

        return c.json(formatted);
    }


    declinePo = async (c, next) => {
        const body = await c.req.json();
        const {
            count,
            status,
            Items,
            modelId,
            addedBy
        } = body;

        const set = {
            status: status,
        };
        const where = {
            count: count
        };

        const { sql, values } = await MyModel.update("purchaseOrder", set, where);
        const result = await c.env.DB.prepare(sql).bind(...values).run();


        if (result && !result.success) {
            return c.json(new HttpException(400, 'Something went wrong'), 400);
        }

        var i;
        for (i = 0; i < Items.length; i++) {
            const { sql: sql1, values: values2 } = await MyModel.getRows('consumables', {
                "select": "availableQty	",
                "where": {
                    "count": Items[i].fkItemCount
                }
            });

            const chekcQTY = await c.env.DB.prepare(sql1).bind(...values2).all();
            const newQty = parseFloat(chekcQTY.results[0].availableQty) + parseFloat(Items[i].orderQty);

            const set = { availableQty: newQty }
            const where = { count: Items[i].fkItemCount }
            const { sql: sql_set, values: values_set } = await MyModel.update('consumables', set, where);
            await c.env.DB.prepare(sql_set).bind(...values_set).run();
        }

        const logData = {
            ID: shortid.generate(),
            fkModel: modelId,
            refId: count,
            description: "Declined Order",
            dateTime: formatDate(new Date()),
            addedBy: addedBy,
            type: "Declined PO",
        }

        const { sql: sql_log, values: values_log } = await MyModel.insert("consumableLogs", logData);
        await c.env.DB.prepare(sql_log).bind(...values_log).run();

        const formatted = formatData({
            "message": "Data updated successfully",
            "info": `Rows matched: ${result.meta.rows_written}  Changed: ${result.meta.changes}`
        });

        return c.json(formatted);
    }

    // checkValidation = (req) => {
    //     // const errors = validationResult(req)
    //     // if (!errors.isEmpty()) {
    //     //     throw new HttpException(400, 'Validation faild', errors);
    //     // }
    // }


    getAllPO = async (c, next) => {
        const body = await c.req.json();
        const { status } = body

        let options = {
            "select": `
            userdetails.firstname || ' ' || userdetails.lastname AS empName,
            purchaseOrder.*,
            projectModels.location
          `,
            "join": {
                "projectModels": "projectModels.modelId = purchaseOrder.modelId",
                "userdetails": "userdetails.fkUsercount = purchaseOrder.addedBy",
            }
        }

        if (status !== "All") {
            options.where = {
                "purchaseOrder.status": status,
            }
        }

        const { sql, values } = await MyModel.getRows("purchaseOrder", options);
        const result = await c.env.DB.prepare(sql).bind(...values).all();

        if (!result) {
            return c.json(new HttpException(404, 'Projects  not found'), 404);
        }

        const formatted = formatData(result.results);
        return c.json(formatted);
    }

    initItems = async (c, next) => {
        const body = await c.req.json();
        const { items, addedBy } = body;
        var i;
        for (i = 0; i < items.length; i++) {
            let itemData = {
                itemCode: items[i].itemCode,
                keyword: items[i].keyword,
                itemName: items[i].itemName,
                description: items[i].description,
                qty: items[i].qty,
                status: items[i].qty > 0 ? "In-Stock" : "Out-of-Stock",
                availableQty: items[i].qty,
                dateAdded: new Date(),
                addedBy: addedBy
            }

            const { sql: sql2, values: values2 } = await MyModel.insert("consumables", itemData);
            await c.env.DB.prepare(sql2).bind(...values2).run();
        }
    }
}

module.exports = new Consumables;
