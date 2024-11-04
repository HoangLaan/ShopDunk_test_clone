const database = require('../../models');
const MenuClass = require('../menu/menu.class');
const PROCEDURE_NAME = require('../../common/const/procedureName.const');
const apiHelper = require('../../common/helpers/api.helper');
const mssql = require('../../models/mssql');
const ServiceResponse = require('../../common/responses/service.response');

const getListMenu = async (req) => {
  try {
    const page = apiHelper.getPage(req);
    const limit = apiHelper.getLimit(req);
    const query = `${PROCEDURE_NAME.SYS_MENU_GETLIST} 
      @PAGESIZE=:PAGESIZE,
      @PAGEINDEX=:PAGEINDEX,
      @KEYWORD=:KEYWORD,
      @ORDERBYDES=:ORDERBYDES,
      @MODULEID=:MODULEID,
      @FUNCTIONID=:FUNCTIONID,
      @CREATEDDATEFROM=:CREATEDDATEFROM,
      @CREATEDDATETO=:CREATEDDATETO,
      @ISACTIVE=:ISACTIVE,
      @ISBUSINESS=:ISBUSINESS,
      @ISSYSTEM=:ISSYSTEM,
      @PARENTID=:PARENTID`


    const menus = await database.sequelize.query(query, {
      replacements: {
        'PAGESIZE': limit,
        'PAGEINDEX': page,
        'KEYWORD': apiHelper.getQueryParam(req, 'search'),
        'ORDERBYDES': apiHelper.getQueryParam(req, 'sortorder'),
        'MODULEID': apiHelper.getQueryParam(req, 'module_id'),
        'FUNCTIONID': apiHelper.getQueryParam(req, 'function_id'),
        'CREATEDDATEFROM': apiHelper.getQueryParam(req, 'from_date'),
        'CREATEDDATETO': apiHelper.getQueryParam(req, 'to_date'),
        'ISACTIVE': apiHelper.getQueryParam(req, 'is_active'),
        'ISBUSINESS': apiHelper.getQueryParam(req, 'is_business'),
        'ISSYSTEM': apiHelper.getQueryParam(req, 'is_system'),
        'PARENTID': apiHelper.getQueryParam(req, 'parent_id'),
      },
      type: database.QueryTypes.SELECT,
    });

    return {
      'data': MenuClass.list(menus),
      'page': page,
      'limit': limit,
      'total': apiHelper.getTotalData(menus),
    };
  } catch (error) {
    console.error('menuService.getListMenu', error);
    return [];
  }
};
const getListMenuByUser = async (req) => {
  try {
    const user_groups=req.auth.user_groups;
    const isAdministrator =req.auth.isAdministrator;
    const query = `${PROCEDURE_NAME.SYS_MENU_GETBYUSERGROUP} 
      @USERGROUPID=:USERGROUPID,
      @IsAdministrator=:IsAdministrator`;
    const menus = await database.sequelize.query(query, {
      replacements: {
        'USERGROUPID': user_groups? user_groups.join('|'):'',
        'IsAdministrator':isAdministrator,
      },
      type: database.QueryTypes.SELECT,
    });
    return {
      'data': MenuClass.list(menus),
    };
  } catch (error) {
    console.error('menuService.getListMenuByUser', error);
    return [];
  }
};

const createMenu = async (req) => {
  try {
    req.body.menu_id = null;

    const result = await createOrUpdateMenu(req);
    return result[0][0]?.MENUID;
  } catch (error) {
    console.error('menuService.createMenu', error);
    return false;
  }
};

const updateMenu = async (req) => {
  try {
    req.body.menu_id = req.params.menuId;

    await createOrUpdateMenu(req);
    return true;
  } catch (error) {
    console.error('menuService.updateMenu', error);
    return false;
  }
};

const createOrUpdateMenu = async (req) => {
  let data = {
    'MENUID': req.body.menu_id,
    'FUNCTIONID': req.body.function_id ?? "",
    'MENUNAME': req.body.menu_name,
    'MODULEID': req.body.module_id || null,
    'LINKMENU': req.body.link_menu || null,
    'DESCRIPTION': req.body.description ?? '',
    'PARENTID': req.body.parent_id ?? "",
    'ORDERINDEX': req.body.order_index ?? 0,
    //'ISCANOPENMULTIWINDOWS': req.body.is_can_open_multi_windows,
    'ICONPATH': req.body.icon_path ?? '',
    'ISACTIVE': req.body.is_active,
    'ISSYSTEM': req.body.is_system,
    'CREATEDUSER': apiHelper.getAuthId(req),
  };

  let query = `${PROCEDURE_NAME.SYS_MENU_CREATEORUPDATE} 
        @MENUID=:MENUID,
        @FUNCTIONID=:FUNCTIONID,
        @MENUNAME=:MENUNAME,
        @MODULEID=:MODULEID,
        @LINKMENU=:LINKMENU,
        @DESCRIPTION=:DESCRIPTION,
        @PARENTID=:PARENTID,
        @ORDERINDEX=:ORDERINDEX,
        @ICONPATH=:ICONPATH,
        @ISACTIVE=:ISACTIVE,
        @ISSYSTEM=:ISSYSTEM,
        @CREATEDUSER=:CREATEDUSER`;

  // Call procedure
  return  await database.sequelize.query(query, {
    replacements: data,
    type: database.QueryTypes.INSERT,
  });

  
};

const detailMenu = async (menuId) => {
  try {
    const func = await database.sequelize.query(`${PROCEDURE_NAME.SYS_MENU_GETBYID} @MENUID=:MENUID`, {
      replacements: {
        'MENUID': menuId,
      },
      type: database.QueryTypes.SELECT,
    });

    if (func.length) {
      return MenuClass.detail(func[0]);
    }

    return null;
  } catch (error) {
    console.error('menuService.detailMenu', error);
    return null;
  }
};

const deleteMenu = async (menuId, req) => {
  try {
    await database.sequelize.query(`${PROCEDURE_NAME.SYS_MENU_DELETE} @MENUID=:MENUID,@UPDATEDUSER=:UPDATEDUSER`, {
      replacements: {
        'MENUID': menuId,
        'UPDATEDUSER': apiHelper.getAuthId(req),
      },
      type: database.QueryTypes.UPDATE,
    });

    return true;
  } catch (error) {
    console.error('menuService.deleteMenu', error);
    return true;
  }
};

const changeStatusMenu = async (menuId, req) => {
  try {
    const query = `${PROCEDURE_NAME.SYS_MENU_UPDATESTATUS} 
      @MENUID=:MENUID,
      @UPDATEDUSER=:UPDATEDUSER,
      @ISACTIVE=:ISACTIVE`;
    await database.sequelize.query(query, {
      replacements: {
        'MENUID': menuId,
        'ISACTIVE': req.body.is_active,
        'UPDATEDUSER': apiHelper.getAuthId(req),
      },
      type: database.QueryTypes.UPDATE,
    });

    return true;
  } catch (error) {
    console.error('menuService.changeStatusMenu', error);
    return true;
  }
};

const deleteListMenu = async bodyParams => {
  try {
      let list_id = apiHelper.getValueFromObject(bodyParams, 'list_id', []);

      const pool = await mssql.pool;
      const data = await pool
          .request()
          .input('LISTID', list_id)
          .input('NAMEID', 'MENUID')
          .input('TABLENAME', 'SYS_MENU')
          .input('DELETEDUSER', apiHelper.getValueFromObject(bodyParams, 'auth_name'))
          .execute('CBO_COMMON_SOFTDELETE');
      return new ServiceResponse(true, '', true);
  } catch (e) {
      console.log(e)
      logger.error(e, {function: 'menuService.deleteListMenu'});
      return new ServiceResponse(false, 'Lỗi xoá nhóm menu');
  }
};


module.exports = {
  getListMenu,
  getListMenuByUser,
  createMenu,
  detailMenu,
  updateMenu,
  deleteMenu,
  changeStatusMenu,
  deleteListMenu
};
