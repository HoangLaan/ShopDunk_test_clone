const database = require('../../models');
const FunctionGroupClass = require('./functionGroup.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const API_CONST = require('../../common/const/api.const');
const cacheHelper = require('../../common/helpers/cache.helper');
const CACHE_CONST = require('../../common/const/cache.const');
const mssql = require('../../models/mssql');
const apiHelper = require('../../common/helpers/api.helper');
const ServiceResponse = require('../../common/responses/service.response');
const {list} = require('../function/function.class');

const getList = async (params = {}) => {
    try {
        const defaultParams = {
            keyword: null,
            is_active: API_CONST.ISACTIVE.ALL,
            is_system: API_CONST.ISSYSTEM.ALL,
            itemsPerPage: API_CONST.PAGINATION.LIMIT,
            page: API_CONST.PAGINATION.DEFAULT,
            created_date_from: '',
            created_date_to: '',
            created_user: '',
        };
        const parameters = Object.assign({}, defaultParams, params);
        //
        const dataList = await database.sequelize.query(
            `${PROCEDURE_NAME.SYS_FUNCTIONGROUP_GETLIST} 
    @KEYWORD = :keyword,
    @ISACTIVE = :is_active,
    @ISSYSTEM = :is_system,
    @PAGESIZE = :itemsPerPage,
    @PAGEINDEX = :page,
    @CREATEDDATEFROM = :created_date_from,
    @CREATEDDATETO = :created_date_to,
    @CREATEDUSER = :created_user`,
            {
                replacements: parameters,
                type: database.QueryTypes.SELECT,
            },
        );
        //
        return {
            list: FunctionGroupClass.list(dataList),
            total: dataList[0]['TOTALITEMS'],
        };
    } catch (error) {
        console.error('functionGroupService.getList', error);
        return [];
    }
};

const create = async (params = {}) => {
    try {
        await createOrUpdateHandler(null, params);
        return true;
    } catch (error) {
        console.error('functionGroupService.create', error);
        return false;
    }
};

const update = async (id, params = {}) => {
    try {
        await createOrUpdateHandler(id, params);
        return true;
    } catch (error) {
        console.error('functionGroupService.update', error);
        return false;
    }
};

const createOrUpdateHandler = async (id = null, params = {}) => {
    const defaultParams = {
        function_group_id: id,
        function_group_name: null,
        description: null,
        order_index: null,
        is_active: API_CONST.ISACTIVE.ACTIVE,
        is_system: API_CONST.ISSYSTEM.NOT_SYSTEM,
        created_user: null,
        functions: [],
    };
    const parameters = Object.assign({}, defaultParams, params, {
        created_user: params.created_user || params.updated_user || null,
        functions: params.functions.join('|'),
    });

    const query = `${PROCEDURE_NAME.SYS_FUNCTIONGROUP_CREATEORUPDATE} 
  @FUNCTIONGROUPID = :function_group_id,
  @FUNCTIONGROUPNAME = :function_group_name,
  @DESCRIPTION = :description,
  @ORDERINDEX = :order_index,
  @ISACTIVE = :is_active,
  @ISSYSTEM = :is_system,
  @FUNCTIONID = :functions,
  @CREATEDUSER = :created_user`;

    removeCacheOptions();

    // Call procedure
    return await database.sequelize.query(query, {
        replacements: parameters,
        type: database.QueryTypes.INSERT,
    });
};

const detail = async id => {
    try {
        const pool = await mssql.pool;
        const functionGroup = await pool
            .request()
            .input('FUNCTIONGROUPID', id)
            .execute(PROCEDURE_NAME.SYS_FUNCTIONGROUP_GETBYID);
        //let position = data.recordset;
        console.log(functionGroup.recordsets[1]);
        return {
            ...FunctionGroupClass.detail(functionGroup.recordset[0]),
            functions_list: list(functionGroup.recordsets[1]),
        };
    } catch (error) {
        console.log(error);
        return null;
    }
};

const remove = async bodyParams => {
    try {
        const pool = await mssql.pool;

        let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);
        console.log(list_id);
        const data = await pool
            .request()
            .input('LISTID', list_id)
            .input('NAMEID', 'FUNCTIONGROUPID')
            .input('TABLENAME', 'SYS_FUNCTIONGROUP')
            .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
            .execute('CBO_COMMON_SOFTDELETE');

        console.log(data);
        removeCacheOptions();
        return new ServiceResponse(true);
    } catch (e) {
        console.log(e);
        logger.error(e, {function: 'ManufacturerService.deleteManufacturer'});
        return new ServiceResponse(false, e.message);
    }
};

const updateStatus = async (id, params = {}) => {
    try {
        await database.sequelize.query(
            `${PROCEDURE_NAME.SYS_FUNCTIONGROUP_UPDATESTATUS} @FUNCTIONGROUPID=:FUNCTIONGROUPID, @ISACTIVE = :ISACTIVE, @UPDATEDUSER=:UPDATEDUSER`,
            {
                replacements: {
                    FUNCTIONGROUPID: id,
                    ISACTIVE: params.is_active || API_CONST.ISACTIVE.INACTIVE,
                    UPDATEDUSER: params.updated_user || null,
                },
                type: database.QueryTypes.UPDATE,
            },
        );

        removeCacheOptions();

        return true;
    } catch (error) {
        return true;
    }
};
const checkName = async (function_group_name, function_group_id = null) => {
    try {
        const query = `${PROCEDURE_NAME.SYS_FUNCTIONGROUP_CHECKNAME} 
      @FUNCTIONGROUPID=:FUNCTIONGROUPID,
      @FUNCTIONGROUPNAME=:FUNCTIONGROUPNAME`;
        const check = await database.sequelize.query(query, {
            replacements: {
                FUNCTIONGROUPID: function_group_id,
                FUNCTIONGROUPNAME: function_group_name,
            },
            type: database.QueryTypes.SELECT,
        });

        const isCheck = check[0] && check[0]['RESULT'];
        return isCheck ? true : false;
    } catch (error) {
        console.error('functionGroupService.checkName', error);
        return false;
    }
};

const removeCacheOptions = () => {
    return cacheHelper.removeByKey(CACHE_CONST.SYS_FUNCTIONGROUP_OPTIONS);
};

module.exports = {
    getList,
    create,
    detail,
    update,
    remove,
    updateStatus,
    checkName,
};
