const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const API_CONST = require('../../common/const/api.const');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const RelationshipClass = require('./relationship.class');
const logger = require('../../common/classes/logger.class');
const ServiceResponse = require('../../common/responses/service.response');
const { log } = require('handlebars');

const getListRelationship = async (params = {}) => {
    try {
        const pool = await mssql.pool;
        const relationships = await pool
            .request()
            .input('KEYWORD', apiHelper.getValueFromObject(params, 'search', null))
            .input('ISSYSTEM', apiHelper.getValueFromObject(params, 'is_system', null))
            .input('CREATEDDATEFROM', apiHelper.getValueFromObject(params, 'created_date_from', null))
            .input('CREATEDDATETO', apiHelper.getValueFromObject(params, 'created_date_to', null))
            .input('PAGESIZE', apiHelper.getValueFromObject(params, 'itemsPerPage', null))
            .input('PAGEINDEX', apiHelper.getValueFromObject(params, 'page', null))
            .execute(PROCEDURE_NAME.MD_RELATIONSHIP_GETLIST_ADMINWEB);
        return {
            list: RelationshipClass.list(relationships.recordsets[0]),
            total: relationships.recordsets[0][0]['TOTALITEMS'],
        };
    } catch (error) {
        console.error('RelationshipService.getList', error);
        return [];
    }
};

const createOrUpdateHandler = async (bodyParams = {}) => {
    try {
        const pool = await mssql.pool;
        const idUpdate = apiHelper.getValueFromObject(bodyParams, 'relationshipmember_id', null);
        const relationship = await pool
            .request()
            .input('RELATIONSHIPMEMBERID', idUpdate)
            .input('RELATIONSHIPNAME', apiHelper.getValueFromObject(bodyParams, 'relationship_name', null))
            .input('DECRIPTION', apiHelper.getValueFromObject(bodyParams, 'decription', null))
            .input('ISSYSTEM', apiHelper.getValueFromObject(bodyParams, 'is_system', API_CONST.ISSYSTEM.ALL))
            .input(
                'CREATEDUSER',
                idUpdate
                    ? apiHelper.getValueFromObject(bodyParams, 'updated_user', '')
                    : apiHelper.getValueFromObject(bodyParams, 'created_user', ''),
            )
            .execute(PROCEDURE_NAME.MD_RELATIONSHIP_CREATEORUPDATE_ADMINWEB);
        const relationshipmemberId = relationship.recordset[0].RESULT;
        console.log(relationshipmemberId);

        if (!relationshipmemberId || relationshipmemberId <= 0) {
            throw new Error('Create or update failed!');
        }
        return new ServiceResponse(true, 'Create or update successfully', relationshipmemberId);
    } catch (error) {
        logger.error(error, { function: 'RelationshipService.createOrUpdateHandler' });
        return new ServiceResponse(false, error.message);
    }
};

const getById = async (relationshipmemberId) => {
    try {
        const pool = await mssql.pool;
        const data = await pool
            .request()
            .input('RELATIONSHIPMEMBERID', relationshipmemberId)
            .execute(PROCEDURE_NAME.MD_RELATIONSHIP_GETBYID);

        if (!data.recordsets[0]) {
            return new ServiceResponse(false, 'Không tìm thấy loại quan hệ');
        }
        const result = RelationshipClass.detail(data.recordsets[0][0]);

        return new ServiceResponse(true, '', result);
    } catch (error) {
        logger.error(error, { function: 'RelationshipService.getById' });
        return new ServiceResponse(false, error.message);
    }
};

const deleteRelationship = async (relationshipmemberId, bodyParams) => {
    try {
        const pool = await mssql.pool;
        console.log(apiHelper.getValueFromObject(bodyParams, 'deleted_user', null));
        await pool
            .request()
            .input('RELATIONSHIPMEMBERID', relationshipmemberId)
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'deleted_user', null))
            .execute(PROCEDURE_NAME.MD_RELATIONSHIP_DELETE_ADMINWEB);
        return new ServiceResponse(true, 'delete relationship successfully!');
    } catch (e) {
        logger.error(e, { function: 'RelationshipService.deleteRelationship' });
        return new ServiceResponse(false, e.message);
    }
};

module.exports = {
    getListRelationship,
    createOrUpdateHandler,
    getById,
    deleteRelationship,
};
