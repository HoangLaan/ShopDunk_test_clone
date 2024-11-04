// const {Job} = require('node-schedule');
// const mssql = require('../../models/mssql');
// const logger = require('../../common/classes/logger.class');

const renewCommission = async () => {
    // try {
    //     const pool = await mssql.pool;
    //     const data = await pool.request().execute('SL_COMMISSION_getListExpired_AdminWeb');
    //     const commissionExpired = data.recordset
    //     for (let i = 0; i < commissionExpired.length; i++) {
    //         const commission = commissionExpired[i];
    //         const renewDateInMonth = commission.RENEWDAYINMONTH;
    //         const currentDate = new Date();
    //         if (renewDateInMonth >= 1 && renewDateInMonth <= 28) {}

            
    //     }
    // } catch (e) {
    //     logger.error(e, {
    //         function: 'CommissionCron.renewCommission',
    //     });
    // }

    // const job = new Job('job', async () => {
    //     try {
    //         const pool = await mssql.pool;
    //         const data = await pool.request().execute('SL_COMMISSION_getListToRenew_AdminWeb');
    //         const commissionExpired = data.recordset
    //         for (let i = 0; i < commissionExpired.length; i++) {
    //             const commission = commissionExpired[i];
    //         }
    //     } catch (e) {
    //         logger.error(e, {
    //             function: 'CommissionCron.renewCommission',
    //         });
    //     }
    // });
    // job.schedule('*/30 * * * * *');
};

module.exports = {
    renewCommission,
};
