const Transform = require("../../common/helpers/transform.helper");
const config = require("../../../config/config");
const template = {
  //-------------File-------------------------
  file_id: "{{#? FILEID}}",
  directory_id: "{{#? DIRECTORYID}}",
  file_format: "{{#? FILEFORMAT}}",
  file_height: "{{#? FILEHEIGHT}}",
  file_width: "{{#? FILEWIDTH}}",
  file_hash: "{{#? FILEHASH}}",
  file_ext: "{{#? FILEEXT}}",
  file_mime: "{{#? FILEMIME}}",
  is_high_light: "{{ISHIGHLIGHT ? 1 : 0}}",
  is_active: "{{ISACTIVE ? 1 : 0}}",
  is_show_product_gift: "{{ISSHOWPRODUCTGIFT ? 1 : 0}}",
  // file_url: "{{#? FILEURL}}",
  file_url: [
    {
    //   "{{#if FILEURL}}": `${config.domain_cdn}{{FILEURL}}`,
    "{{#if FILEURL}}": `{{FILEURL}}`,
    },
    {
      "{{#else}}": null,
    },
  ],


  file_url_app: [
    {
      "{{#if FILEURL}}": `${config.domain_cdn}{{FILEURL}}`,
    // "{{#if FILEURL}}": `{{FILEURL}}`,
    },
    {
      "{{#else}}": null,
    },
  ],

  avatar: [
    {
      "{{#if DEFAULTPICTUREURL}}": `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
    },
    {
      "{{#else}}": null,
    },
  ],
  created_date: "{{#? CREATEDDATEVIEW}}",
  permission: "{{#? PERMISSION}}",
  // -----------------DIRECTIORY--------------------

  directory_id: "{{#? DIRECTORYID}}",
  directory_name: "{{#? DIRECTORYNAME}}",
  parent_id: "{{#? PARENTID}}",
  directory_owner: "{{#? DIRECTORYOWNER}}",
  file_hash: "{{#? FILEHASH}}",
  file_ext: "{{#? FILEEXT}}",
  file_mime: "{{#? FILEMIME}}",
  is_high_light: "{{ISHIGHLIGHT ? 1 : 0}}",
  is_active: "{{ISACTIVE ? 1 : 0}}",
  is_share_all: "{{ISSHARETOALL ? 1 : 0}}",
  is_file : "{{ISFILE ? 1 : 0}}",
  is_directory : "{{ISDIRECTORY ? 1 : 0}}",
  is_delete : "{{ISDELETE ? 1 : 0}}",
  is_add : "{{ISADD ? 1 : 0}}",
  is_edit : "{{ISEDIT ? 1 : 0}}",
  is_view : "{{ISVIEW ? 1 : 0}}",
  file_name : "{{#? FILENAME}}",
  is_tag : "{{ISTAG ? 1 : 0}}",
  is_read : "{{ISREAD ? 1 : 0}}",
  is_write : "{{ISWRITE ? 1 : 0}}",
  is_write : "{{ISWRITE ? 1 : 0}}",
  is_owner : "{{ISOWNER ? 1 : 0}}",
  created_user : "{{#? CREATEDUSER}}",



//--------------------------------------------------------
 document_type_id : "{{#? DOCUMENTTYPEID}}",
 document_type_name : "{{#? DOCUMENTTYPENAME}}",
 company_name : "{{#? COMPANYNAME}}",
//------------------------------------------------------
  file_tage_name : "{{#? FILETAGNAME}}",
  
  user_name : "{{#? USERNAME}}",
  color :  "{{#? COLOR}}",
  icon_url :  "{{#? ICONURL}}",
  updated_date :  "{{#? UPDATEDDATE}}",
  updated_user :  "{{#? UPDATEDUSER}}",
  file_size : "{{#? FILESIZE}}" ,
  file_owner : "{{#? FILEOWNER}}",
  full_name : "{{#? FULLNAME}}",
  company_id : "{{#? COMPANYID}}",


  file_tag_id :  "{{#? FILETAGID}}",
  department_name :  "{{#? DEPARTMENTNAME}}",
  department_id :  "{{#? DEPARTMENTID}}"

//   created_date: "{{#? CREATEDDATEVIEW}}",








};

let transform = new Transform(template);

const detail = (data) => {
  return transform.transform(data, [
    "reply_comment_id",
    "comment_id",
    "comment_content",
    "author",
    "like_count",
    "avatar",
    "username",
    "created_user",
    "created_date",
  ]);
};


const ListPathDirectory = (data = []) => {
    return transform.transform(data, [
      // "directory_id",
      // "directory_name",
      // "parent_id",
      // "directory_owner",
      // "is_share_all",
      // "created_date",
      // "permission",
      "directory_id",
      "directory_name",
      "parent_id",
      "document_type_id"
    ]);
  };

const detailInside = (data) => {
  return transform.transform(data, [
    "news_id",
    "news_title",
    "news_date",
    "short_description",
    "description",
    "content",
    "news_category_name",
    "avatar",
    "full_name",
  ]);
};

const listFile = (data = []) => {
  return transform.transform(data, [
    "file_id",
    "directory_id",
    "file_format",
    "file_height",
    "file_width",
    "file_hash",
    "file_ext",
    "file_mime",
    "file_url",
    "created_date",
    "permission",
  ]);
};


const listPermissionDir = (data = []) => {
    return transform.transform(data, [
      "directory_id",
      "user_name",
      "full_name",
      "is_read",
      "is_write",
      "is_delete",
      // "is_owner",
      "department_name",
      "department_id",
      "avatar",
    ]);
  };


  const listPermissionFile = (data = []) => {
    return transform.transform(data, [
      "file_id",
      "user_name",
      "is_read",
      "is_write",
      "is_delete",
      // "is_owner",
      "department_name",
      "department_id",
      "avatar",
      "full_name"
    ]);
  };

const ListDirectory = (data = []) => {
  return transform.transform(data, [
    // "directory_id",
    // "directory_name",
    // "parent_id",
    // "directory_owner",
    // "is_share_all",
    // "created_date",
    // "permission",
    "directory_id",
    "created_date",
    "directory_id",
    "directory_name",
    "parent_id",
    "directory_owner",
    "is_share_all",
    "is_directory",
    "is_delete",
    "is_add",
    "is_edit",
    "is_view",
    "is_owner",
    "document_type_id"
  ]);
};

const detailFile = (data = []) => {
    return transform.transform(data, [
      "file_id",
      "file_mime",
      "file_url",
      "file_hash",
      "file_ext",
      "file_size",
      "file_name", 
      "file_tage_name",
      "color",
      "icon_url",
      "created_date" ,
      "created_user",
      "updated_user",
      "updated_date",
      "is_delete",
      "is_edit",
      "is_tag",
      "file_tag_id",
      "avatar"
    ]);
  };

  const detailDirectory = (data = []) => {
    return transform.transform(data, [
      "directory_id",
      "directory_name",
      "document_type_id",
    //   "file_url",
    //   "file_hash",
    //   "file_ext",
    //   "file_size",
    //   "file_name", 
      "file_tage_name",
      "color",
      "icon_url",
      "created_date" ,
      "created_user",
      "updated_user",
      "updated_date",
      "is_delete",
      "is_edit",
      "is_tag",
      "file_tag_id",
      "avatar"
    ]);
  };



  const detailFileForApp = (data = []) => {
    return transform.transform(data, [
      "file_id",
      "file_mime",
      "file_url_app",
      "file_hash",
      "file_ext",
      "file_size",
      "file_name", 
      "file_tage_name",
      "color",
      "icon_url",
      "created_date" ,
      "created_user",
      "updated_user",
      "updated_date",
      "is_delete",
      "is_edit",
      "is_tag",
      "file_tag_id"
    ]);
  };


  const listTaglType = (data = []) => {
    return transform.transform(data, [
      "file_id",
      "file_tag_id",
      "file_tage_name",
      "color",
      "icon_url",
    ]);
  };


const ListDocumentType = (data = []) => {
    return transform.transform(data, [
      "document_type_id",
      "document_type_name",
      "company_name",
      "company_id"
    ]);
  };



const listAll = (data = []) => {
    return transform.transform(data, [
      "file_id",
      "directory_id",
      "file_format",
      "file_height",
      "file_width",
      "file_hash",
      "file_ext",
      "file_mime",
      "file_url",
      "created_date",
      "directory_id",
      "directory_name",
      "parent_id",
      "directory_owner",
      "is_share_all",
      "permission",
      "is_file",
      "is_directory",
      "is_delete",
      "is_add",
      "is_edit",
      "is_view",
      "is_owner",
      "file_name",
      "document_type_id",
      "file_tage_name",
      "color",
      "icon_url",
      "is_tag",
      "file_tag_id",
      "file_size",
      "file_owner",
      "full_name"

    ]);
  };



const CommentNearest = (data = []) => {
  return transform.transform(data, ["reply_comment_id"]);
};

const listInside = (data = []) => {
  return transform.transform(data, [
    "news_id",
    "news_title",
    "news_category_name",
    "news_date",
    "image_url",
    "avatar",
    "full_name",
  ]);
};




const related = (data = []) => {
  return transform.transform(data, [
    "parent_id",
    "news_id",
    "news_title",
    "news_category_name",
    "created_date",
  ]);
};

const permissionParentFolder = (data = []) => {
    return transform.transform(data, [
      "is_view",
      "is_add",
      "is_edit",
      "is_delete",
      "is_owner",
      "directory_name",
    ]);
  };
  

module.exports = {
  listFile,
  detail,
  related,
  listInside,
  detailInside,
  CommentNearest,
  ListDirectory,
  listAll,
  ListDocumentType,
  detailFile,
  listTaglType,
  listPermissionDir,
  listPermissionFile,
  permissionParentFolder,
  detailFileForApp,
  ListPathDirectory,
  detailDirectory
};
