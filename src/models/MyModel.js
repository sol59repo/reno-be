const {
    multipleColumnInsert,
    multipleColumnSet,
    multipleColumnWhere,
    multipleColumnJoin,
    multipleColumnORWhere
} = require("../utils/common.utils");

class MyModel {
    getLastDataId = async (tableName) => {
        const getLatestId = `SELECT * FROM ${tableName} ORDER BY id DESC LIMIT 1`;
        return getLatestId;
    };

    getRows = async (tableName, options = {}) => {
        let values = [];
        let sql =
            options.select !== undefined &&
                options.select !== "" &&
                options.select !== null
                ? `select  ${options.select} `
                : `select  * `;
        sql += `from ${tableName}`;

        if (this.isObject(options.join)) {
            const { columnJoin } = multipleColumnJoin(options.join)

            console.log(columnJoin)
            sql += `  ${columnJoin} `;
        }

        if (this.isObject(options.where)) {
            const { columnWhereValues, columnWhere } = multipleColumnWhere(options.where);
            values = [...values, ...columnWhereValues];
            sql += ` WHERE ${columnWhere}`;
        }

        if (this.isObject(options.or_where)) {
            const { columnORSetValues, columnORSet } = multipleColumnORWhere(options.or_where);
            values = [...values, ...columnORSetValues];
            sql += ` ${columnORSet}`;
        }

        if (this.isObject(options.where_in)) {
            sql += ` WHERE ${options.where_in.col} IN (${options.where_in.value})`;
        }

        if (this.isObject(options.where_not_in)) {
            sql += ` WHERE ${options.where_not_in.col} NOT IN (${options.where_not_in.value})`;
        }

        if (options.group !== undefined && options.group !== "") {
            sql += ` GROUP BY ${options.group}`
        }

        if (options.order !== undefined && options.order !== "") {
            sql += ` ORDER BY ${options.order}`
        }

        if (options.limit !== undefined && options.limit !== "") {
            sql += ` LIMIT  ${options.limit}`
        }
        
        return {
            sql,
            values: values
        };
    };

    isObject = (data) => {
        if (typeof data !== 'object' && data === undefined) {
            return false;
        }

        if (Object.keys(data).length === 0) {
            return false;
        }
        return true;
    }

    insert = async (tableName, body) => {
        const { columnKeys, columnInsert, values } = multipleColumnInsert(body);

        const sql = `INSERT INTO ${tableName}  (${columnKeys}) VALUES (${columnInsert})`;

        return {
            sql,
            values: values
        };
    };

    update = async (tableName, set, where) => {
        const { columnSet, columnSetValues } = multipleColumnSet(set);
        const { columnWhere, columnWhereValues } = multipleColumnWhere(where);
        const sql = `UPDATE ${tableName} SET ${columnSet} WHERE ${columnWhere}`;

        return {
            sql,
            values: [...columnSetValues, ...columnWhereValues]
        };
    }

    getOne = async (tableName, where) => {
        const { columnWhere, columnWhereValues } = multipleColumnWhere(where);

        const sql = `SELECT * FROM ${tableName} WHERE ${columnWhere}`;

        return {
            sql,
            values: columnWhereValues
        };
    }

    delete = async (tableName, where) => {
        const { columnWhere, columnWhereValues } = multipleColumnWhere(where);
        const sql = `DELETE FROM ${tableName} WHERE ${columnWhere}`;
        return {
            sql,
            values: columnWhereValues
        };
    }
}

module.exports = new MyModel();
