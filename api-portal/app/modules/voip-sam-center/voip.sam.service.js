const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const axios = require('axios');
const config = require('../../../config/config');
const voipClass = require('./voip.sam.class');
const qs = require('qs');
const { MISSED_CALL_FILTER } = require('./utils/constants');
const { authorizationVoipSamCenter } = require('./utils/helpers');
const API_CONST = require('../../common/const/api.const');
const { addSheetGetList } = require('../../common/helpers/excel.helper');
const xl = require('excel4node');

// hard chua lưu token vào redis
const syncExtension = async (bodyParams) => {
    try {
        const getToken = await authorizationVoipSamCenter();
        if (getToken?.token) {
            let data = JSON.stringify({
                extension: bodyParams?.user_name,
                password: 'SamCenter@@2023!!', // hard code sau gắn env
                enabled: true,
            });

            const pool = await mssql.pool;
            const request = await pool
                .request()
                .input('USERNAME', bodyParams?.user_name)
                .execute('SYS_USER_SyncVoip_AdminWeb');

            let configRequest = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${config.void.domain}/v3/extension`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken?.token}`,
                },
                data: data,
            };
            await axios.request(configRequest);
        }

        return new ServiceResponse(true, '', getToken);
    } catch (error) {
        logger.error(error, { function: 'voipService.syncExtension' });
        return new ServiceResponse(true, '', {});
    }
};

const getListCdrs = async (bodyParams) => {
    try {
        const getToken = await authorizationVoipSamCenter();
        if (getToken?.token) {
            bodyParams.start_date = formatDate(bodyParams.start_date, 'start');
            bodyParams.end_date = formatDate(bodyParams.end_date, 'end');
            if (!bodyParams.status) {
                if (bodyParams.is_missed == MISSED_CALL_FILTER.YES.value) {
                    bodyParams.status = MISSED_CALL_FILTER.YES.filter;
                } else if (bodyParams.is_missed == MISSED_CALL_FILTER.NO.value) {
                    bodyParams.status = MISSED_CALL_FILTER.NO.filter;
                } else {
                    bodyParams.status = MISSED_CALL_FILTER.ALL.filter;
                }
            }
            let callRate = bodyParams?.rare?.map((item) => +item.value);
            let extension = bodyParams?.extension?.map((item) => +item.value);
            let _query = qs.stringify({
                ...bodyParams,
                limit: bodyParams?.itemsPerPage,
                offset: bodyParams?.offset === 0 ? 0 : (bodyParams?.page - 1) * bodyParams?.itemsPerPage,
                phone: bodyParams?.phone,
                call_rate: callRate,
                extension: extension,
            });
            _query = _query.replace(/%5B\d+%5D/g, '')
            let configRequest = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${config.void.domain}/v3/cdr?${_query}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken?.token}`,
                },
            };
            const reponseList = await axios.request(configRequest);
            const { data, limit, offset, total } = reponseList?.data;
            const page = offset >= bodyParams?.itemsPerPage ? offset / bodyParams?.itemsPerPage + 1 : 1;
            const sip_call_ids = (data || []).map((item) => item.sip_call_id).join('|');
            const pool = await mssql.pool;
            const res = await pool
                .request()
                .input('SIPCALLIDS', sip_call_ids)
                .execute('SYS_USER_GetUserToVoIP_AdminWeb');

            const userList = voipClass.listUser(res.recordsets[0]) || [];

            const reqUserListRes = await pool.request().query(`
              SELECT VOIPEXT, USERNAME user_name, FULLNAME full_name
              FROM SYS_USER
              WHERE VOIPEXT IS NOT NULL
            `)
            const reqUserListData = reqUserListRes.recordset || []
            const dataWithUser = await Promise.all(
                (data || []).map(async (item) => {
                const user = userList.find((i) => i.sip_id == item?.sip_call_id);
                const userExt = reqUserListData.find((i) => i.VOIPEXT === +item?.extension);
                let customer_full_name = ''
                if(item.direction === 'outbound'){
                    const res = await pool
                    .request()
                    .input('PHONENUMBER', item.to_number)
                    .execute('SYS_USER_GetNameUserVoip_AdminWeb');
                    
                    customer_full_name = res.recordset[0]?.FULLNAME
                } else {
                    const res = await pool
                    .request()
                    .input('PHONENUMBER', item.from_number)
                    .execute('SYS_USER_GetNameUserVoip_AdminWeb');
                    
                    customer_full_name = res.recordset[0]?.FULLNAME
                }

                return {
                    ...item,
                    user: user?.user_fullname ? `${user?.user_name} - ${user?.user_fullname}` : '',
                    is_recall: user?.is_recall,
                    user_ext: userExt?.user_name ? `${userExt?.user_name} - ${userExt?.full_name}` : '',
                    customer_full_name
                };
            }));
            let missed_counts;
            missed_counts = dataWithUser.filter((i) => i.status == 'busy-line').length;
            return new ServiceResponse(true, '', {
                data: { data: dataWithUser, missed_counts: missed_counts },
                page: page,
                limit: limit,
                total: total,
            });
        }
        return new ServiceResponse(false, '', {});
    } catch (error) {
        logger.error(error, { function: 'voipService.getListCdrs' });
        return new ServiceResponse(false, '', {});
    }
};

const syncDataCdrToTask = async (bodyParams) => {
    try {
        const getToken = await authorizationVoipSamCenter();
        if (getToken?.token) {
            let configRequest = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${config.void.domain}/v3/cdr/${bodyParams?.sip_id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken?.token}`,
                },
            };

            axios.request(configRequest).then(async (response) => {
                const pool = await mssql.pool;
                await pool
                    .request()
                    .input('DURATION', apiHelper.getValueFromObject(response.data, 'duration'))
                    .input('SIPID', apiHelper.getValueFromObject(bodyParams, 'sip_id'))
                    .input('FILERECORD', apiHelper.getValueFromObject(response.data, 'recording_url'))
                    .input('CAUSEVOIP', apiHelper.getValueFromObject(response.data, 'cause'))
                    .input('TIMESTARTED', apiHelper.getValueFromObject(response.data, 'time_started'))
                    .input('TIMEANSWERED', apiHelper.getValueFromObject(response.data, 'time_answered'))
                    .input('TIMEENDED', apiHelper.getValueFromObject(response.data, 'time_ended'))
                    .input('TIMERINGGING', apiHelper.getValueFromObject(response.data, 'time_ringging'))
                    .input('STATUS', apiHelper.getValueFromObject(response.data, 'status'))
                    .input('BILLSEC', apiHelper.getValueFromObject(response.data, 'billsec'))
                    .input('APP', apiHelper.getValueFromObject(response.data, 'app'))
                    .input('RATE', apiHelper.getValueFromObject(response.data, 'rate'))
                    .execute('CRM_TASKDETAILCALL_SyncVoip_AdminWeb');
            });
        }
        return new ServiceResponse(true, '', {});
    } catch (error) {
        logger.error(error, { function: 'voipService.getListCdrs' });
        return new ServiceResponse(false, '', {});
    }
};

const createTaskForRecall = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('SIPID', apiHelper.getValueFromObject(bodyParams, 'sip_call_id'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name', ''))
            .execute('CRM_TASKDETAILCALL_UpdateVoip_AdminWeb');

        return new ServiceResponse(true, '', {});
    } catch (error) {
        logger.error(error, { function: 'voipService.createTaskForRecall' });
        return new ServiceResponse(false, '', {});
    }
};

const formatDate = (inputDate, type = '') => {
    if (inputDate) {
        if (type == 'start') {
            const parts = inputDate.split('/');
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
            return `${year}-${month}-${day} 00:00:00`;
        } else {
            const parts = inputDate.split('/');
            const day = parts[0];
            const month = parts[1];
            const year = parts[2];
            return `${year}-${month}-${day} 23:59:59`;
        }
    } else {
        return '';
    }
};

const FormatDateJson = (date) => {
    if (date) {
        return date.toString("yyyyMMddHHmmss").replace(/T/, ' ').replace(/Z/, '')
    }
    else return null
}

const exportExcel = async (queryParams = {}, bodyParams = {}) => {
    try {
        queryParams = {
            offset: 0,
            limit: 5,
            itemsPerPage: 0,
            start_date: queryParams.start_date,
            end_date: queryParams.end_date,
        }
        const serviceRes = await getListCdrs(queryParams);
        const dataExport = serviceRes?.data?.data?.data?.map((item, index) => {
            let [user_id, user_fullName] = item?.user_ext ? item.user_ext.split(' - ') : ['', ''];
            let direction, sip_hangup_disposition, from_number, to_number = ''

            if (item.direction === 'inbound') {
                direction = 'Gọi vào';
                from_number = item.from_number;
                to_number = item.to_number;
            } else if (item.direction === 'outbound') {
                direction = 'Gọi ra';
                from_number = item.to_number;
                to_number = item.from_number;
            } else if (item.direction === 'local') {
                direction = 'local';
                from_number = item.to_number;
                to_number = item.from_number;
            }

            if (item.direction == "outbound") {
                switch (item.sip_hangup_disposition) {
                    case "send_bye":
                        if (item.app == "dial") {
                            sip_hangup_disposition = 'MOBILE';
                            break;
                        } else {
                            sip_hangup_disposition = 'Agent';
                            break;
                        }
                    case "send_refuse":
                        if (item.app == "dial") {
                            sip_hangup_disposition = 'MOBILE';
                            break;
                        } else {
                            sip_hangup_disposition = 'Agent';
                            break;
                        }
                    case "recv_cancel":
                        if (item.app == "dial") {
                            sip_hangup_disposition = 'Agent';
                            break;
                        } else {
                            sip_hangup_disposition = 'MOBILE';
                            break;
                        }
                    case "recv_bye":
                        if (item.app == "autocall" || item.app == "autodialer") {
                            sip_hangup_disposition = 'MOBILE';
                        } else {
                            sip_hangup_disposition = 'Agent';
                        }
                        break;
                    default:
                        sip_hangup_disposition = 'MOBILE';
                        break;
                }
            } else if (item.direction == "local") {
                if (item.status == "answered") {
                    switch (item.sip_hangup_disposition) {
                        case "send_bye":
                            sip_hangup_disposition = "Phía B";
                            break;
                        default:
                            sip_hangup_disposition = "Phía A";
                            break;
                    }
                } else {
                    switch (item.sip_hangup_disposition) {
                        case "recv_bye":
                            sip_hangup_disposition = "Phía B";
                            break;
                        default:
                            sip_hangup_disposition = "Phía A";
                            break;
                    }
                }
            } else {
                if (item.status == "answered") {
                    switch (item.sip_hangup_disposition) {
                        case "send_bye":
                            sip_hangup_disposition = 'Agent';
                            break;
                        default:
                            sip_hangup_disposition = 'MOBILE';
                            break;
                    }
                } else {
                    switch (item.sip_hangup_disposition) {
                        case "recv_bye":
                            sip_hangup_disposition = 'MOBILE';
                            break;
                        default:
                            sip_hangup_disposition = 'Agent';
                            break;
                    }
                }
            }

            return {
                ...item,
                time_started: FormatDateJson(item.time_started),
                time_answered: FormatDateJson(item.time_answered),
                time_ended: FormatDateJson(item.time_ended),
                user_id: user_id,
                user_full_name: user_fullName,
                direction: direction,
                status: item.status.toUpperCase(),
                duration: item.duration.toString(),
                billsec: item.billsec.toString(),
                time_presskey: item.time_presskey.toString(),
                presskey_delay: item.presskey_delay.toString(),
                press_key: item.press_key.toString(),
                rate: item.rate.toString(),
                sip_hangup_disposition: sip_hangup_disposition,
            };
        });

        const wb = new xl.Workbook();
        addSheetGetList({
            workbook: wb,
            sheetName: 'Lịch sử cuộc gọi SamCenter',
            header: {
                time_started: 'Thời gian bắt đầu cuộc gọi',
                time_answered: 'Thời gian nhấc máy',
                time_ended: 'Thời gian kết thúc',
                app: 'app',
                user_id: 'User Id',
                user_full_name: 'User FullName',
                direction: 'Chiều',
                from_number: 'Số điện thoại',
                to_number: 'Đầu số',
                status: 'Trạng thái',
                sip_hangup_disposition: 'Ngắt máy',
                duration: 'Thời lượng',
                billsec: 'Đàm thoại',
                none: 'Chiến dịch', // Chưa biết nhập trường nào 
                recording_url: 'Đường dẫn file ghi âm',
                press_key: 'Phím bấm',
                note: 'Ghi chú',
                id: 'Call ID',
                time_presskey: 'Thời gian bấm phím',
                presskey_delay: 'Độ trễ bấm phím',
                none: 'Mã kết thúc',// Chưa biết nhập trường nào 
                none: 'Số lần đã gọi',// Chưa biết nhập trường nào 
                none: 'Tags',// Chưa biết nhập trường nào 
                none: 'Nhà mạng',// Chưa biết nhập trường nào 
                rate: 'Đánh giá cuộc gọi',
            },
            data: dataExport,
            ndexHeaderMustBeNumber: [0, 8, 9, 12, 13, 16, 19, 20, 21],
        });
        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'voipService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    syncExtension,
    getListCdrs,
    syncDataCdrToTask,
    createTaskForRecall,
    exportExcel
    // transferCall
};
