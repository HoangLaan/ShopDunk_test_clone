const logger = require('../classes/logger.class');
const mssql = require('../../models/mssql');
const sql = require('mssql');

const transaction = async (callback) => {
    const pool = await mssql.pool;
    const trans = await new sql.Transaction(pool);
    let data = null;
    try {
        await trans.begin();
        const reqTrans = new sql.Request(trans);
        data = await callback(reqTrans, trans);
        await trans.commit();
    } catch (error) {
        await trans.rollback();
        logger.error(error, { Task: 'db.helper.transaction' });
    }

    return data;
};

const execStoreProcedure = async (procedureName, data) => {
    const totalFields = Object.keys(data);
    const pool = await mssql.pool;
    const req = await pool.request();
    for (const field of totalFields) {
        req.input(field, data[field]);
    }

    return await req.execute(procedureName);
};

module.exports = {
    transaction,
    execStoreProcedure,
};
