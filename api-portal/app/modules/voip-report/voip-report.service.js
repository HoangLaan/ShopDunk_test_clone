const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const { authorizationVoip, formatDate } = require('./utils/helpers');
const axios = require('axios');
const config = require('../../../config/config');
const qs = require('qs');
const xl = require('excel4node');
const moment = require('moment');
const { addSheetGetList } = require('../../common/helpers/excel.helper');
const e = require('express');


const getListVoipReport = async (queryParams) => {
    try {

        const getToken = await authorizationVoip();
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);
        if (getToken?.token) {
            const type_report = apiHelper.getValueFromObject(queryParams, "type_report")
            queryParams.start_time = formatDate(queryParams.start_date, 'start');
            queryParams.end_time = formatDate(queryParams.end_date, 'end');
            let _query = qs.stringify({
                ...queryParams,
                limit: queryParams?.itemsPerPage,
                offset: (queryParams?.page - 1) * queryParams?.itemsPerPage,
            });
            let configRequest = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${config.void.domain}${queryParams.type_report}?${_query}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${getToken?.token}`,
                },
            };
            const reponseList = await axios.request(configRequest);
            const { data } = reponseList?.data;
            let dataSort;
            if (type_report === '/v3/report/call/agent/detail') {
                // Sắp xếp theo thời gian nếu type_report là '/v3/report/call/agent/detail'
                dataSort = data.sort(function (a, b) {
                    const timeA = new Date(a.time);
                    const timeB = new Date(b.time);
                    // Sắp xếp theo thời gian trước, nếu thời gian giống nhau thì sắp xếp theo extension
                    if (timeA - timeB === 0) {
                        return a.extension - b.extension;
                    }
                    return timeA - timeB;
                });
            } else {
                // Sắp xếp theo extension nếu type_report không phải '/v3/report/call/agent/detail'
                dataSort = data.sort(function (a, b) {
                    return a.extension - b.extension;
                });
            }
            let total = dataSort?.length || dataSort?.data?.length;
            return new ServiceResponse(true, '', {
                data: dataSort,
                page: currentPage,
                limit: itemsPerPage,
                total: total,
            });
        }
        return new ServiceResponse(false, '', {});
    } catch (error) {
        logger.error(error, { function: 'voipReportService.getListVoipReport' });
        return new ServiceResponse(false, '', {});
    }
};

const FormatDateJson = (date) => {
    if (date) {
        return date.toString('yyyyMMddHHmmss').replace(/T/, ' ').replace(/Z/, '');
    } else return null;
};

const convertSecondsToHMS = (seconds) => {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;

    // Định dạng thời gian thành chuỗi HH:mm:ss
    let formattedTime =
        (hours < 10 ? '0' : '') + hours + ':' +
        (minutes < 10 ? '0' : '') + minutes + ':' +
        (remainingSeconds < 10 ? '0' : '') + remainingSeconds;

    return formattedTime;
}

const exportExcel = async (queryParams = {}, bodyParams = {}) => {
    try {
        queryParams = {
            offset: 0,
            limit: 5,
            itemsPerPage: 0,
            start_date: queryParams.start_date,
            end_date: queryParams.end_date,
            type_report: queryParams.type_report,
        };

        const type_report = apiHelper.getValueFromObject(queryParams, "type_report")
        const res = await getListVoipReport(queryParams);
        const serviceResult = res?.data?.data
        const wb = new xl.Workbook();
        let dataExport;

        if (type_report === "/v3/report/call/user") {
            dataExport = serviceResult.map((e, i) => {
                return {
                    ...e,
                    total_duration: convertSecondsToHMS(e?.total_duration),
                    total_billsec: convertSecondsToHMS(e?.total_billsec),
                    total_answered: e.total_answered.toString(),
                    total_no_answered: e.total_no_answered.toString(),
                    total_busy_line: e.total_busy_line.toString(),
                    total_busy: e.total_busy.toString(),
                    total_not_available: e.total_not_available.toString(),
                    total_failed: e.total_failed.toString(),
                    total_ivr: e.total_ivr.toString(),
                    total_cancel: e.total_cancel.toString(),
                    total_voicemail: e.total_voicemail.toString(),
                    total_invalid_number: e.total_invalid_number.toString(),
                    total_phone_block: e.total_phone_block.toString(),
                    total_congestion: e.total_congestion.toString(),
                    total_inbound: e.total_inbound.toString(),
                    total_outbound: e.total_outbound.toString(),
                    total_local: e.total_local.toString(),
                    total_call: e.total_call.toString(),
                };
            })
            addSheetGetList({
                workbook: wb,
                sheetName: 'Reports',
                header: {
                    first_name: 'Tên',
                    username: 'Tên tài khoản',
                    extension: 'Line',
                    email: 'Email',
                    total_duration: 'Khoảng thời gian',
                    total_billsec: 'Đàm thoại',
                    total_answered: 'Đã trả lời',
                    total_no_answered: 'Không trả lời',
                    total_busy_line: 'Đường dây bận',
                    total_busy: 'Bận',
                    total_not_available: 'Không có sẵn',
                    total_failed: 'Thất bại',
                    total_ivr: 'Phản hồi bằng giọng nói',
                    total_cancel: 'Huỷ bỏ',
                    total_voicemail: 'Thư thoại',
                    total_invalid_number: 'Số không hợp lệ',
                    total_phone_block: 'Chặn cuộc gọi',
                    total_congestion: 'Tắt nghẽn',
                    total_inbound: 'Gọi vào',
                    total_outbound: 'Gọi ra',
                    total_local: 'Nội bộ',
                    total_call: 'Tổng cộng',
                },
                data: dataExport,
            });
        } else if (type_report === "/v3/report/call/extension") {
            dataExport = serviceResult.map((e, i) => {
                return {
                    ...e,
                    total_answered: e.total_answered.toString(),
                    total_no_answered: e.total_no_answered.toString(),
                    total_busy_line: e.total_busy_line.toString(),
                    total_busy: e.total_busy.toString(),
                    total_not_available: e.total_not_available.toString(),
                    total_failed: e.total_failed.toString(),
                    total_ivr: e.total_ivr.toString(),
                    total_cancel: e.total_cancel.toString(),
                    total_voicemail: e.total_voicemail.toString(),
                    total_invalid_number: e.total_invalid_number.toString(),
                    total_phone_block: e.total_phone_block.toString(),
                    total_congestion: e.total_congestion.toString(),
                    total_inbound: e.total_inbound.toString(),
                    total_outbound: e.total_outbound.toString(),
                    total_local: e.total_local.toString(),
                    total_call: e.total_call.toString(),
                };
            })
            addSheetGetList({
                workbook: wb,
                sheetName: 'Reports',
                header: {
                    first_name: 'Tên',
                    username: 'Tên tài khoản',
                    extension: 'Line',
                    total_answered: 'Đã trả lời',
                    total_no_answered: 'Không trả lời',
                    total_busy_line: 'Đường dây bận',
                    total_busy: 'Bận',
                    total_not_available: 'Không có sẵn',
                    total_failed: 'Thất bại',
                    total_ivr: 'Phản hồi bằng giọng nói',
                    total_cancel: 'Huỷ bỏ',
                    total_voicemail: 'Thư thoại',
                    total_invalid_number: 'Số không hợp lệ',
                    total_phone_block: 'Chặn cuộc gọi',
                    total_congestion: 'Tắt nghẽn',
                    total_inbound: 'Gọi vào',
                    total_outbound: 'Gọi ra',
                    total_local: 'Nội bộ',
                    total_call: 'Tổng cộng',
                },
                data: dataExport,
            });
        } else if (type_report === "/v3/report/call/extension/summary") {
            dataExport = serviceResult.map((e, i) => {
                return {
                    ...e,
                    total_call: e.total_call.toString(),
                    total_answered: e.total_answered.toString(),
                    total_no_answered: e.total_no_answered.toString(),
                    total_busy_line: e.total_busy_line.toString(),
                    total_busy: e.total_busy.toString(),
                    total_not_available: e.total_not_available.toString(),
                    total_failed: e.total_failed.toString(),
                    total_ivr: e.total_ivr.toString(),
                    total_cancel: e.total_cancel.toString(),
                    total_voicemail: e.total_voicemail.toString(),
                    total_invalid_number: e.total_invalid_number.toString(),
                    total_phone_block: e.total_phone_block.toString(),
                    total_congestion: e.total_congestion.toString(),
                    total_inbound: e.total_inbound.toString(),
                    total_outbound: e.total_outbound.toString(),
                    total_local: e.total_local.toString(),
                    group_name: Array.isArray(e?.groups) ? e?.groups[0]?.group_name : null,
                };
            })
            addSheetGetList({
                workbook: wb,
                sheetName: 'Reports',
                header: {
                    first_name: 'Tên',
                    username: 'Tên tài khoản',
                    extension: 'Line',
                    total_call: 'Tổng cộng',
                    total_answered: 'Đã trả lời',
                    total_no_answered: 'Không trả lời',
                    total_busy_line: 'Đường dây bận',
                    total_busy: 'Bận',
                    total_not_available: 'Không có sẵn',
                    total_failed: 'Thất bại',
                    total_ivr: 'Phản hồi bằng giọng nói',
                    total_cancel: 'Huỷ bỏ',
                    total_voicemail: 'Thư thoại',
                    total_invalid_number: 'Số không hợp lệ',
                    total_phone_block: 'Chặn cuộc gọi',
                    total_congestion: 'Tắt nghẽn',
                    total_inbound: 'Gọi vào',
                    total_outbound: 'Gọi ra',
                    total_local: 'Nội bộ',
                    departments: 'Phòng ban',
                    group_name: 'Tên nhóm',
                    leaders: 'Bộ phận trưởng',
                    managers: 'Quản lý',
                },
                data: dataExport,
            });
        } else if (type_report === "/v3/report/call/extension/summary/day") {
            dataExport = serviceResult.map((e, i) => {
                const newData = {
                    ...e,
                    add_date: moment(e?.add_date)?.format('DD/MM/YYYY HH:mm'),
                    total_answered: e.total_answered.toString(),
                    total_no_answered: e.total_no_answered.toString(),
                    total_busy_line: e.total_busy_line.toString(),
                    total_busy: e.total_busy.toString(),
                    total_not_available: e.total_not_available.toString(),
                    total_failed: e.total_failed.toString(),
                    total_ivr: e.total_ivr.toString(),
                    total_cancel: e.total_cancel.toString(),
                    total_voicemail: e.total_voicemail.toString(),
                    total_invalid_number: e.total_invalid_number.toString(),
                    total_phone_block: e.total_phone_block.toString(),
                    total_congestion: e.total_congestion.toString(),
                    total_inbound: e.total_inbound.toString(),
                    total_outbound: e.total_outbound.toString(),
                    total_local: e.total_local.toString(),
                    total_call: e.total_call.toString(),
                    group_name: Array.isArray(e?.groups) ? e?.groups[0]?.group_name : null,
                };

                // Thêm cột mới từ reports
                e.reports.forEach((report) => {
                    const columnName = new Date(report.time).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
                    newData[columnName] = report.total_call.toString();
                });

                return newData;
            });

            // Thêm cột mới vào danh sách header
            const headers = {
                first_name: 'Tên',
                username: 'Tên tài khoản',
                extension: 'Line',
                add_date: 'Thời gian tạo',
                total_calls: 'Tổng số cuộc gọi',
                departments: 'Phòng ban',
                group_name: 'Tên nhóm',
                leaders: 'Trưởng bộ phận',
                managers: 'Quản lý',
                total_answered: 'Đã trả lời',
                total_no_answered: 'Không trả lời',
                total_busy_line: 'Đường dây bận',
                total_busy: 'Bận',
                total_not_available: 'Không có sẵn',
                total_failed: 'Thất bại',
                total_ivr: 'Phản hồi bằng giọng nói',
                total_cancel: 'Huỷ bỏ',
                total_voicemail: 'Thư thoại',
                total_invalid_number: 'Số không hợp lệ',
                total_phone_block: 'Chặn cuộc gọi',
                total_congestion: 'Tắt nghẽn',
                total_inbound: 'Gọi vào',
                total_outbound: 'Gọi ra',
                total_local: 'Nội bộ',
                total_call: 'Tổng cộng',
            };

            serviceResult[0].reports.forEach((report) => {
                const columnName = new Date(report.time).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
                headers[columnName] = columnName;
            });

            addSheetGetList({
                workbook: wb,
                sheetName: 'Reports',
                header: headers,
                data: dataExport,
            });
        } else if (type_report === "/v3/report/call/agent/detail") {
            dataExport = serviceResult.map((e, i) => {
                const checkDate = (last_call) => {
                    if (last_call && last_call.startsWith('0001-01-01T')) {
                        return null;
                    } else {
                        return moment(last_call)?.format('DD/MM/YYYY HH:mm');
                    }
                }
                return {
                    ...e,
                    time: moment(e.time)?.format('DD/MM/YYYY HH:mm'),
                    total_billsec: convertSecondsToHMS(e?.total_billsec),
                    first_call: checkDate(e.first_call),
                    last_call: checkDate(e.last_call),
                    total_call: e.total_call.toString(),
                    total_answered: e.total_answered.toString(),
                    ratio_connected: (+e?.ratio_connected || 0).toFixed(2) + ' %',
                };
            })
            addSheetGetList({
                workbook: wb,
                sheetName: 'Reports',
                header: {
                    time: 'Thời gian',
                    first_name: 'Tên',
                    username: 'Tên tài khoản',
                    first_call: 'Cuộc gọi đầu tiên',
                    last_call: 'Cuộc gọi cuối cùng',
                    total_billsec: 'Billsec',
                    total_call: 'Tổng cộng',
                    total_answered: 'Đã trả lời',
                    ratio_connected: 'Kết nối khách hàng',
                },
                data: dataExport,
            });
        } else if (type_report === "/v3/report/call/agent/time") {
        } else if (type_report === "/v3/report/campaign-type/autodialer") {
        } else if (type_report === "/v3/report/call/agent/performance-with-customer") {
            dataExport = serviceResult.map((e, i) => {
                return {
                    ...e,
                    total_customer_called: e.total_customer_called.toString(),
                    total_call: e.total_call.toString(),
                    total_call_connected: e.total_call_connected.toString(),
                    total_call_answered: e.total_call_answered.toString(),
                    ratio_total_call_connected: Math.round(+e?.total_call_connected / e?.total_call * 100 || 0) + '  %',
                    ratio_total_no_answered: Math.round(+e?.total_call_answered / e?.total_customer_called * 100 || 0) + '  %',
                    total_billsec: convertSecondsToHMS(e?.total_billsec),
                    total_waitsec: convertSecondsToHMS(e?.total_waitsec),
                };
            })
            addSheetGetList({
                workbook: wb,
                sheetName: 'Reports',
                header: {
                    group_name: 'Tên nhóm',
                    first_name: 'Tên',
                    total_customer_called: 'Tổng KH đã gọi',
                    total_call: 'Tổng số cuộc gọi',
                    total_call_connected: 'Tổng số cuộc gọi kết nối',
                    ratio_total_call_connected: '% kết nối',
                    total_call_answered: 'Tổng số cuộc gọi kết nối trên khách hàng',
                    ratio_total_no_answered: '% Số cuộc gọi kết nối trên KH',
                    total_billsec: 'Thời gian đàm thoại',
                    total_waitsec: 'Thời Gian Đổ Chuông',
                },
                data: dataExport,
            });
        } else if (type_report === "/v3/report/call/tracking-time/agent") {
        }
        return new ServiceResponse(true, '', wb);
    } catch (error) {
        logger.error(error, { function: 'voipService.exportExcel' });
        return new ServiceResponse(true, '', {});
    }
};

module.exports = {
    getListVoipReport,
    exportExcel
};
