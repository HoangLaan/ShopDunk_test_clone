const timeKeepingClaimClass = require('./time-keeping-claim.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const RESPONSE_MSG = require('../../common/const/responseMsg.const');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const sql = require('mssql');
const _ = require('lodash');
const ErrorResponse = require('../../common/responses/error.response');
const mailBoxService = require('../mailbox/mailbox.service');
const timeKeepingClaimTypeService = require('../time-keeping-claim-type/time-keeping-claim-type.service');
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');
let xl = require('excel4node');
const moment = require('moment');

const getListTimeKeepingClaim = async (queryParams = {}) => {
    try {
        const currentPage = apiHelper.getCurrentPage(queryParams);
        const itemsPerPage = apiHelper.getItemsPerPage(queryParams);

        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('PageSize', itemsPerPage)
            .input('PageIndex', currentPage)
            .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(queryParams, 'time_keeping_claim_type_id'))
            .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
            .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
            .input('ISREVIEWED', apiHelper.getValueFromObject(queryParams, 'is_reviewed'))
            .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
            .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
            .execute('HR_TIMEKEEPINGCLAIM_GetList_AdminWeb');
        const dataRecord = data.recordset;
        return new ServiceResponse(true, 'Lấy danh sách giải trình thành công', {
            data: timeKeepingClaimClass.list(dataRecord),
            page: currentPage,
            limit: itemsPerPage,
            total: apiHelper.getTotalData(dataRecord),
        });
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimService.getListTimeKeepingClaim' });
        return new ServiceResponse(true, '', {});
    }
};

/* 
Lấy danh sách của mức duyệt theo từng đơn giải trình. 
*/
const detailTimeKeepingClaim = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(body, 'time_keeping_claim_id'))
            .execute('HR_TIMEKEEPINGCLAIM_GetById_AdminWeb');
        const [timeKeepingClaimData, reviewLevelData, imagesData] = data.recordsets;
        if (timeKeepingClaimData.length === 0) return new ServiceResponse(false, 'Không thấy giải trình', {});
        return new ServiceResponse(true, '', {
            ...timeKeepingClaimClass.detail(timeKeepingClaimData[0]),
            images: timeKeepingClaimClass.imagesExplain(imagesData),
            review_levels_of_time_keeping_claim: timeKeepingClaimClass.reviewLevel(reviewLevelData),
        });
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimService.detailTimeKeepingClaim' });
        return new ServiceResponse(false, e.message);
    }
};
// thêm mới phiếu giải trình trong file trong công.
const createOrUpdateTimeKeepingClaim = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        await transaction.begin();
        const time_keeping_claim_id = apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_id');
        const claimTypeRequest = new sql.Request(transaction);
        const data = await claimTypeRequest
            .input('TIMEKEEPINGCLAIMID', time_keeping_claim_id)
            .input('USERNAME', apiHelper.getValueFromObject(bodyParams, 'user_name'))
            .input('SCHEDULEID', apiHelper.getValueFromObject(bodyParams, 'schedule_id'))
            .input('CLAIMREASON', apiHelper.getValueFromObject(bodyParams, 'claim_reason'))
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_type_id'))
            .input('CLAIMEVIDENCE', apiHelper.getValueFromObject(bodyParams, 'claim_evidence'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1))
            .input('ISLATE', apiHelper.getValueFromObject(bodyParams, 'is_late'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(`HR_TIMEKEEPINGCLAIM_CreateOrUpdate_AdminWeb`);
        const timeKeepingClaimId = data.recordset[0].id;
        bodyParams.time_keeping_claim_id = timeKeepingClaimId;
        // Nếu là update thì xóa các table map
        if (time_keeping_claim_id) {
            const requestReviewLevelDel = new sql.Request(transaction);
            const resReviewLevelDel = await deleteTKCReviewLevel(bodyParams, requestReviewLevelDel);
            if (resReviewLevelDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resReviewLevelDel.getMessage());
            }

            // Xóa hình ảnh giải trình
            const requestImagesDel = new sql.Request(transaction);
            const resImagesDel = await deleteTKCImages(bodyParams, requestImagesDel);
            if (resImagesDel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, resImagesDel.getMessage());
            }
        }
        //update lại mức duyệt
        const requestReviewLevel = new sql.Request(transaction);
        const review_levels = apiHelper.getValueFromObject(bodyParams, 'review_levels');
        for (const {
            review_level_id,
            is_reviewed,
            note,
            reviewed_username,
            time_keeping_claim_review_level_id,
        } of review_levels) {
            bodyParams.review_level_id = review_level_id;
            bodyParams.is_reviewed = is_reviewed ?? 2;
            bodyParams.note = note;
            bodyParams.reviewed_username = reviewed_username;
            bodyParams.time_keeping_claim_review_level_id = time_keeping_claim_review_level_id;
            const resReviewLevel = await createOrUpdateTKCReviewLevel(bodyParams, requestReviewLevel);
            if (resReviewLevel.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(true, resReviewLevel.getMessage());
            }
        }
        // update or thêm mới hình ảnh minh chứng.
        const requestImages = new sql.Request(transaction);
        const images = apiHelper.getValueFromObject(bodyParams, 'images', []);
        for (const image of images) {
            let picture_url;
            if (!image.picture_url) {
                if (fileHelper.isBase64(image)) {
                    picture_url = await fileHelper.saveBase64(null, image);
                }
            }
            picture_url = picture_url || image.picture_url?.replace(config.domain_cdn, '');
            bodyParams.image_url = picture_url;
            const resImages = await createOrUpdateTKCImages(bodyParams, requestImages);
            if (resImages.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(true, resImages.getMessage());
            }
        }
        // Nếu là tạo mới và user_name nằm trong list gửi đến QC thì tiến hành gửi mail
        if (!time_keeping_claim_id) {
            const detailRes = await detailTimeKeepingClaim({ time_keeping_claim_id: timeKeepingClaimId });
            if (detailRes.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Gửi mail cho QC thất bại');
            }
            const {
                time_keeping_claim_type_id,
                time_keeping_claim_type_name,
                user_name,
                full_name,
                shift_name,
                claim_reason,
                time_keeping_start,
                time_keeping_end,
                time_keeping_claim_id,
                time_keeping_date,
            } = detailRes.getData();
            const timeKeepingClaimTypeRes = await timeKeepingClaimTypeService.detailTimeKeepingClaimType({
                time_keeping_claim_type_id,
            });
            if (timeKeepingClaimTypeRes.isFailed()) {
                await transaction.rollback();
                return new ServiceResponse(false, 'Gửi mail cho QC thất bại');
            }

            const { is_inform_qc, users_qc } = timeKeepingClaimTypeRes.getData();

            if (!is_inform_qc) {
                await transaction.commit();
                return new ServiceResponse(true, '');
            }

            const auth = apiHelper.getValueFromObject(bodyParams, 'auth');
            const bodyMail = {
                is_send_to_all: 0,
                parent_id: 0,
                recipient_email: users_qc.map((item) => ({
                    value: `USER-${item.user_name}`,
                    label: `${item.user_name} - ${item.full_name}`,
                })),
                mail_subject: `${time_keeping_claim_type_name} - ${user_name} - ${full_name}`,
                mail_content: `<h3>Kính gửi anh/chị,</h3>\n<p>Tôi tên là ${full_name}, mã nhân viên ${user_name}, vị trí Nhân viên QC gửi đơn giải trình ${time_keeping_claim_type_name}.</p>\n<p>Ngày công giải trình: ${shift_name} ${time_keeping_start} - ${time_keeping_end} ${time_keeping_date}</p>\n<p>Với lý do như sau, ${claim_reason}</p>\n<p>Chi tiết xem tại: <a target="_blank" href=\"${config.domain_cdn}portal/time-keeping-claim/detail/${time_keeping_claim_id}\">[Link dẫn đến view chi tiết giải trình]</a></p>\n<p>Kính mong anh/chị ghi nhận và xét duyệt.</p>\n<p>Trân trọng,</p>`,
            };
            await mailBoxService.sendNewMail(JSON.parse(JSON.stringify(bodyMail)), null, auth, null);
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, '');
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'timeKeepingClaimService.createOrUpdateTimeKeepingClaim' });
        return new ServiceResponse(false, e.message);
    }
};

const deleteTKCReviewLevel = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGCLAIM_REVIEWLEVEL_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimService.deleteTKCReviewLevel' });
        return new ServiceResponse(false, error.message);
    }
};

// thêm mới mức duyệt.
const createOrUpdateTKCReviewLevel = async (bodyParams = {}, reqTrans) => {
    try {
        const resCreateOrUpdate = await reqTrans
            .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_id'))
            .input(
                'TIMEKEEPINGCLAIMREVIEWLEVELID',
                apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_review_level_id'),
            )
            .input('TIMEKEEPINGREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'review_level_id'))
            .input('ISREVIEWED', apiHelper.getValueFromObject(bodyParams, 'is_reviewed'))
            .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .input('REVIEWUSERNAME', apiHelper.getValueFromObject(bodyParams, 'reviewed_username'))
            .execute('HR_TIMEKEEPINGCLAIM_REVIEWLEVEL_CreateOrUpdate_AdminWeb');
        const templateId = resCreateOrUpdate.recordset[0].id;
        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }
        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimService.createOrUpdateTKCReviewLevel' });

        return new ServiceResponse(false, error.message);
    }
};

const deleteTKCImages = async (bodyParams = {}, reqTrans) => {
    try {
        const resDelete = await reqTrans
            .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_id'))
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGCLAIMIMAGES_Delete_AdminWeb');

        return new ServiceResponse(true, 'Xóa thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimService.deleteTKCImages' });
        return new ServiceResponse(false, error.message);
    }
};

const createOrUpdateTKCImages = async (bodyParams = {}, reqTrans) => {
    try {
        const resCreateOrUpdate = await reqTrans
            .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_id'))
            .input('IMAGEURL', apiHelper.getValueFromObject(bodyParams, 'image_url'))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('HR_TIMEKEEPINGCLAIMIMAGES_CreateOrUpdate_AdminWeb');

        const templateId = resCreateOrUpdate.recordset[0].id;

        if (!templateId || templateId <= 0) {
            return new ServiceResponse(false, 'Tạo thất bại');
        }

        return new ServiceResponse(true, 'Tạo thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimService.createOrUpdateTKCImages' });

        return new ServiceResponse(false, error.message);
    }
};

const deleteTimeKeepingClaim = async (bodyParams) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('LISTID', apiHelper.getValueFromObject(bodyParams, 'list_id'))
            .input('NAMEID', 'TIMEKEEPINGCLAIMID')
            .input('TABLENAME', 'HR_TIMEKEEPINGCLAIM')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimService.deleteTimeKeepingClaim' });
        return new ServiceResponse(false, e.message);
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_AREA_OPTIONS);
};

const updateReview = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        await pool
            .request()
            .input('TIMEKEEPINGCLAIMREVIEWLEVELID', apiHelper.getValueFromObject(body, 'time_keeping_claim_review_level_id'))
            .input('ISREVIEWED', apiHelper.getValueFromObject(body, 'is_reviewed'))
            .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(body, 'time_keeping_claim_id'))
            .input('NOTE', apiHelper.getValueFromObject(body, 'note'))
            .input('UPDATEDUSER', apiHelper.getValueFromObject(body, 'auth_name'))
            .execute(`HR_TIMEKEEPINGCLAIM_REVIEWLEVEL_UpdateReview_AdminWeb`);
        return new ServiceResponse(true, 'Cập nhật duyệt thành công');
    } catch (error) {
        logger.error(error, { function: 'timeKeepingClaimService.updateReview' });
    }
};

const getDetailTimeKeepingClaimByScheduleId = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('SCHEDULEID', apiHelper.getValueFromObject(body, 'schedule_id'))
            .execute(`HR_TIMEKEEPINGCLAIM_GetByScheduleId_AdminWeb`);

        const [timeKeepingClaimData, reviewLevelData, imagesData] = data.recordsets;
        if (timeKeepingClaimData.length === 0) return new ServiceResponse(true, 'Không thấy giải trình', {});

        let dataDetail = timeKeepingClaimClass.detail(timeKeepingClaimData);
        let imagesDetail = timeKeepingClaimClass.imagesExplain(imagesData);
        const isLate = Number(apiHelper.getValueFromObject(body, 'is_late'));

        // Nếu là giải trình đi muộn, về sớm thường chỉ giải trình tối đa 2 lần trên 1 schedule
        const is_enough_explain = dataDetail.length === 2;
        if (isLate === 1 || isLate === 0) {
            dataDetail = [dataDetail.find((item) => parseInt(item.is_late) === isLate) ?? {}];
            imagesDetail = imagesDetail.filter(
                (item) => parseInt(item.time_keeping_claim_id) === dataDetail[0].time_keeping_claim_id,
            );
        }

        return new ServiceResponse(true, '', {
            ...dataDetail[0],
            images: imagesDetail,
            is_enough_explain,
            review_levels_of_time_keeping_claim: timeKeepingClaimClass.reviewLevel(reviewLevelData),
        });
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimService.getDetailTimeKeepingClaimByScheduleId' });
        return new ServiceResponse(false, e.message);
    }
};

const countTimesExplained = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
            .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(body, 'time_keeping_claim_type_id'))
            .execute(`HR_TIMEKEEPINGCLAIM_CountTimesExplain_AdminWeb`);

        return new ServiceResponse(true, '', data.recordset[0]?.TOTALEXPLAIN);
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimService.countTimesExplained' });
        return new ServiceResponse(false, e.message);
    }
};

const getDataExportTimeKeepingClaim = async (queryParams = {}) => {
    const pool = await mssql.pool;
    const res = await pool
        .request()
        .input('KEYWORD', apiHelper.getValueFromObject(queryParams, 'search'))
        .input('TIMEKEEPINGCLAIMTYPEID', apiHelper.getValueFromObject(queryParams, 'time_keeping_claim_type_id'))
        .input('SHIFTID', apiHelper.getValueFromObject(queryParams, 'shift_id'))
        .input('ISACTIVE', apiHelper.getValueFromObject(queryParams, 'is_active'))
        .input('ISREVIEWED', apiHelper.getValueFromObject(queryParams, 'is_reviewed'))
        .input('USERNAME', apiHelper.getValueFromObject(queryParams, 'auth_name'))
        .input('CREATEDDATEFROM', apiHelper.getValueFromObject(queryParams, 'date_from'))
        .input('CREATEDDATETO', apiHelper.getValueFromObject(queryParams, 'date_to'))
        .input('STOREID', apiHelper.getValueFromObject(queryParams, 'store_id'))
        .execute('HR_TIMEKEEPINGCLAIM_GetList_Export_AdminWeb');

    return new ServiceResponse(true, '', res.recordsets);
};

const ExportExcelTimeKeepingClaim = async (queryParams = {}) => {
    try {
        const dataRes = await getDataExportTimeKeepingClaim(queryParams);
        //logic get data export
        if (dataRes.isFailed()) return new ServiceResponse(false, dataRes.getErrors());
        const data_response = dataRes.getData();
        const styles = {
            bold_center: {
                alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
                font: { bold: true, color: 'white' },
                border: {
                    top: {
                        style: 'thin',
                    },
                    left: {
                        style: 'thin',
                    },
                    right: {
                        style: 'thin',
                    },
                },
                fill: {
                    type: 'pattern', // the only one implemented so far.
                    patternType: 'solid', // most common.
                    fgColor: '#0e99cd',
                },
            },
            text_center: {
                alignment: { horizontal: 'center', vertical: 'center' }
            },
        };

        let work_book = new xl.Workbook({
            defaultFont: {
                name: 'Times New Roman',
            },
        });

        let work_sheet = null;
        work_sheet = work_book.addWorksheet('Danh sách giải trình');

        work_sheet.row(1).setHeight(20);
        // work_sheet.column(1).freeze();
        work_sheet.column(1).setWidth(15);
        const obj_short = [2, 3, 4, 5, 6, 7, 8, 9];
        obj_short.map((item, index) => work_sheet.column(item).setWidth(20));

        work_sheet.cell(1, 1, 1, 1, true).string('Mã ERP').style(styles.bold_center);
        work_sheet.cell(1, 2, 1, 2, true).string('Mã nhân viên').style(styles.bold_center);
        work_sheet.cell(1, 3, 1, 3, true).string('Họ tên nhân viên').style(styles.bold_center);
        work_sheet.cell(1, 4, 1, 4, true).string('Ngày làm').style(styles.bold_center);
        work_sheet.cell(1, 5, 1, 5, true).string('Ca làm').style(styles.bold_center);
        work_sheet.cell(1, 6, 1, 6, true).string('Lý do giải trình').style(styles.bold_center);
        work_sheet.cell(1, 7, 1, 7, true).string('Loại giải trình').style(styles.bold_center);
        work_sheet.cell(1, 8, 1, 8, true).string('Đi sớm/về muộn').style(styles.bold_center);
        work_sheet.cell(1, 9, 1, 9, true).string('Trạng thái duyệt').style(styles.bold_center);
        
        //BODY excel
        const data_body = data_response[0];
        let row_position = 2;
        for (let i = 0; i < data_body.length; i++) {
            work_sheet.cell(row_position, 1).string(`${data_body[i]?.MAERP || ''}`).style(styles.text_center);
            work_sheet.cell(row_position, 2).string(`${data_body[i]?.MANHANVIEN || ''}`).style(styles.text_center);
            work_sheet.cell(row_position, 3).string(`${data_body[i]?.FULLNAME || ''}`);
            work_sheet.cell(row_position, 4).string(`${moment(data_body[i]?.NGAYLAM, 'DD/MM/YYYY').format('DD/MM/YYYY') || ''}`).style(styles.text_center);
            work_sheet.cell(row_position, 5).string(`${data_body[i]?.SHIFTNAME || ''}`);
            work_sheet.cell(row_position, 6).string(`${data_body[i]?.LYDO || ''}`);
            work_sheet.cell(row_position, 7).string(`${data_body[i]?.LOAIGIAITRINH || ''}`);
            work_sheet.cell(row_position, 8).string(`${data_body[i]?.DISOMVEMUON || ''}`);
            work_sheet.cell(row_position, 9).string(`${data_body[i]?.DUYET || ''}`);
            row_position += 1;
        }

        return new ServiceResponse(true, '', work_book);
    } catch (error) {
        logger.error(error, { function: 'order.service.getDataExport' });
        return new ServiceResponse(false, error.message, null);
    }
};

module.exports = {
    deleteTimeKeepingClaim,
    createOrUpdateTimeKeepingClaim,
    getListTimeKeepingClaim,
    updateReview,
    detailTimeKeepingClaim,
    getDetailTimeKeepingClaimByScheduleId,
    countTimesExplained,
    ExportExcelTimeKeepingClaim
};
