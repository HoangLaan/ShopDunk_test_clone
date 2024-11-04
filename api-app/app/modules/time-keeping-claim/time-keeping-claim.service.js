const timeKeepingClaimClass = require('./time-keeping-claim.class');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');
const logger = require('../../common/classes/logger.class');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const sql = require('mssql');
const _ = require('lodash');
const timeKeepingClaimTypeService = require('../time-keeping-claim-type/time-keeping-claim-type.service');
const config = require('../../../config/config');
const fileHelper = require('../../common/helpers/file.helper');

const detailTimeKeepingClaim = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
        .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(body, 'time_keeping_claim_id'))
        .execute(`HR_TIMEKEEPINGCLAIM_GetById_App`);

        const [timeKeepingClaimData, reviewLevelData] = data.recordsets;
        if(timeKeepingClaimData.length === 0) return new ServiceResponse(false, 'Không thấy giải trình', {});

        return new ServiceResponse(true, '', {
            ...timeKeepingClaimClass.detail(timeKeepingClaimData[0]),
            review_levels_of_time_keeping_claim: timeKeepingClaimClass.reviewLevel(reviewLevelData)
        });
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimService.detailTimeKeepingClaim' });
        return new ServiceResponse(false, e.message);
    }
};

const checkValidExplain = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
        .input('USERNAME', apiHelper.getValueFromObject(body, 'user_name'))
        .input('SCHEDULEID', apiHelper.getValueFromObject(body, 'schedule_id'))
        .execute(`HR_TIMEKEEPINGCLAIM_CheckIsValidExplain_App`);
        const isValid = data.recordset[0]?.ISVALID;

        const message = {
            0: 'Ca làm việc của bạn hiện tại không cần giải trình',
            '-1': 'Không tìm thấy ca làm việc này',
            // '-2': 'Bạn đã giải trình ca làm việc này rồi',
        }
        if(message[isValid]) return new ServiceResponse(false, message[isValid])

        return new ServiceResponse(true, '')
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimService.detailTimeKeepingClaim' });
        return new ServiceResponse(false, e.message);
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

const createOrUpdateTimeKeepingClaim = async (bodyParams = {}) => {
    const pool = await mssql.pool;
    const transaction = await new sql.Transaction(pool);
    try {
        const user_name = apiHelper.getValueFromObject(bodyParams, 'auth_name')
        const schedule_id = apiHelper.getValueFromObject(bodyParams, 'schedule_id')
        const validRes = await checkValidExplain({user_name, schedule_id});
        if(validRes.isFailed()){
            return new ServiceResponse(false, validRes.getMessage())
        }

        await transaction.begin();
        const time_keeping_claim_id = apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_id');
        const time_keeping_claim_type_id = apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_type_id');
        const claimTypeRequest = new sql.Request(transaction);
        const data = await claimTypeRequest
            .input('TIMEKEEPINGCLAIMID', time_keeping_claim_id)
            .input('USERNAME', user_name)
            .input('SCHEDULEID', schedule_id )
            .input('CLAIMREASON', apiHelper.getValueFromObject(bodyParams, 'claim_reason'))
            .input('TIMEKEEPINGCLAIMTYPEID', time_keeping_claim_type_id)
            .input('CLAIMEVIDENCE', apiHelper.getValueFromObject(bodyParams, 'claim_evidence'))
            .input('ISACTIVE', apiHelper.getValueFromObject(bodyParams, 'is_active', 1)) 
            .input('ISLATE', apiHelper.getValueFromObject(bodyParams, 'is_late')) 
            // .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', 0))
            .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute(`HR_TIMEKEEPINGCLAIM_CreateOrUpdate_App`);
        const timeKeepingClaimId = data.recordset[0].id;

        // Logic cũ app
        // const timeKeepingClaimTypeRes = await timeKeepingClaimTypeService.detailTimeKeepingClaimType({time_keeping_claim_type_id});
        // if(timeKeepingClaimTypeRes.isFailed()){
        //     await transaction.rollback();
        //     return new ServiceResponse(true, timeKeepingClaimTypeRes.getMessage() ?? 'Tạo mới giải trình thất bại');
        // }

        bodyParams.time_keeping_claim_id = timeKeepingClaimId;
        const requestReviewLevel = new sql.Request(transaction);
        const review_levels = apiHelper.getValueFromObject(bodyParams, 'review_levels');
        for (const { review_level_id, is_reviewed, note, reviewed_username, time_keeping_claim_review_level_id} of review_levels) {
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


        const requestImages = new sql.Request(transaction);
        const images = apiHelper.getValueFromObject(bodyParams, 'images', []);
        if(images.length > 0){
            for (const image of images) {
                let picture_url;
                    if (!image.picture_url) {
                        if (fileHelper.isBase64(image)) {
                            picture_url = await fileHelper.saveBase64(null, image);
                        }
                    }
                picture_url = picture_url || image.picture_url?.replace(config.domain_cdn, '');
                bodyParams.image_url = picture_url
                const resImages = await createOrUpdateTKCImages(bodyParams, requestImages);
                if (resImages.isFailed()) {
                    await transaction.rollback();
                    return new ServiceResponse(true, resImages.getMessage());
                }
            }
        }

        // Nếu là tạo mới và user_name nằm trong list gửi đến QC thì tiến hành gửi mail
        if(!time_keeping_claim_id){
            const detailRes = await detailTimeKeepingClaim({time_keeping_claim_id: timeKeepingClaimId});
            if(detailRes.isFailed()){
                await transaction.rollback();
                return new ServiceResponse(false, detailRes.getMessage() ?? 'Gửi mail cho QC thất bại')
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
                time_keeping_date
            } = detailRes.getData();
            const timeKeepingClaimTypeRes = await timeKeepingClaimTypeService.detailTimeKeepingClaimType({time_keeping_claim_type_id});
            if(timeKeepingClaimTypeRes.isFailed()){
                await transaction.rollback();
                return new ServiceResponse(false, timeKeepingClaimTypeRes.getMessage() ?? 'Gửi mail cho QC thất bại')
            }

            const {
                is_inform_qc,
                users_qc
            } = timeKeepingClaimTypeRes.getData();

            if(!is_inform_qc) {
                await transaction.commit();
                return new ServiceResponse(true, 'Tạo mới giải trình thành công', {});
            }

            const bodyMail = {
                is_send_to_all:0,
                parent_id:0,
                list_user: users_qc.map(item => item.user_name),
                mail_subject: `${time_keeping_claim_type_name} - ${user_name} - ${full_name}`,
                mail_content: `<h3>Kính gửi anh/chị,</h3>\n<p>Tôi tên là ${full_name}, mã nhân viên ${user_name}, vị trí Nhân viên QC gửi đơn giải trình ${time_keeping_claim_type_name}.</p>\n<p>Ngày công giải trình: ${shift_name} ${time_keeping_start} - ${time_keeping_end} ${time_keeping_date}</p>\n<p>Với lý do như sau, ${claim_reason}</p>\n<p>Chi tiết xem tại: <a target="_blank" href=\"${config.domain_cdn}portal/time-keeping-claim/detail/${time_keeping_claim_id}\">[Link dẫn đến view chi tiết giải trình]</a></p>\n<p>Kính mong anh/chị ghi nhận và xét duyệt.</p>\n<p>Trân trọng,</p>`,
            }
            bodyParams = {
                send_to_qc: is_inform_qc, 
                ...bodyParams,
                ...bodyMail,
            }
        }

        await transaction.commit();
        removeCacheOptions();
        return new ServiceResponse(true, 'Tạo mới giải trình thành công', bodyParams);
    } catch (e) {
        await transaction.rollback();
        logger.error(e, { function: 'timeKeepingClaimService.createOrUpdateTimeKeepingClaim' });
        return new ServiceResponse(false, e.message);
    }
};

const createOrUpdateTKCReviewLevel = async (bodyParams = {}, reqTrans) => {
    try {
        // Logic cũ app
        // const resCreateOrUpdate = await reqTrans
        //     .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_id'))
        //     .input('TIMEKEEPINGREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'review_level_id'))
        //     .input('ISREVIEWED', apiHelper.getValueFromObject(bodyParams, 'is_reviewed'))
        //     .input('NOTE', apiHelper.getValueFromObject(bodyParams, 'note'))
        //     .input('CREATEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
        //     .execute('HR_TIMEKEEPINGCLAIM_REVIEWLEVEL_CreateOrUpdate_AdminWeb');

        const resCreateOrUpdate = await reqTrans
            .input('TIMEKEEPINGCLAIMID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_id'))
            .input('TIMEKEEPINGCLAIMREVIEWLEVELID', apiHelper.getValueFromObject(bodyParams, 'time_keeping_claim_review_level_id'))
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

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.MD_AREA_OPTIONS);
};

const getDetailTimeKeepingClaimByScheduleId = async (body = {}) => {
    try {
        const pool = await mssql.pool;
        const data = await pool.request()
        .input('SCHEDULEID', apiHelper.getValueFromObject(body, 'schedule_id'))
        .execute(`HR_TIMEKEEPINGCLAIM_GetByScheduleId_App`);

        const [timeKeepingClaimData, reviewLevelData, imagesData] = data.recordsets;
        if(timeKeepingClaimData.length === 0) return new ServiceResponse(true, 'Không thấy giải trình', {});

        let dataDetail = timeKeepingClaimClass.detailByScheduleId(timeKeepingClaimData);
        let imagesDetail = timeKeepingClaimClass.imagesExplain(imagesData);
        const isLate = Number(apiHelper.getValueFromObject(body, 'is_late'));

        // Nếu là giải trình đi muộn, về sớm thường chỉ giải trình tối đa 2 lần trên 1 schedule 
        const is_enough_explain = dataDetail.length === 2;
        if(isLate === 1 || isLate === 0) {
            dataDetail = [dataDetail.find(item => parseInt(item.is_late) === (isLate)) ?? {}]
            imagesDetail = imagesDetail.filter(item => parseInt(item.time_keeping_claim_id) === dataDetail[0].time_keeping_claim_id)
        } 

        return new ServiceResponse(true, 'Lấy chi tiết giải trình theo ca làm việc thành công', {
            ...dataDetail[0],
            images: imagesDetail,
            is_enough_explain,
            review_levels: timeKeepingClaimClass.reviewLevel(reviewLevelData)
        }
        );
    } catch (e) {
        logger.error(e, { function: 'timeKeepingClaimService.getDetailTimeKeepingClaimByScheduleId' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    createOrUpdateTimeKeepingClaim,
    getDetailTimeKeepingClaimByScheduleId,
};
