const Transform = require("../../common/helpers/transform.helper");
const config = require("../../../config/config");

const template = {
  work_type_id: "{{#? WORKTYPEID}}",
  work_type_name: "{{#? WORKTYPENAME}}",
  description: "{{#? DESCRIPTION}}",
  created_user: "{{#? CREATEDUSER}}",
  created_date: "{{#? CREATEDDATE}}",
  is_active: "{{ISACTIVE ? 1 : 0}}",
  is_system: "{{ISSYSTEM ? 1 : 0}}",
  is_delete: "{{ISDELETED ? 1 : 0}}",
  order_index: "{{#? ORDERINDEX}}",
};

let transform = new Transform(template);

const list = (WorkTypes = []) => {
  return transform.transform(WorkTypes, [
    "work_type_id",
    "work_type_name",
    "description",
    "created_user",
    "created_date",
    "is_active",
    "is_delete",
    "is_system"
  ]);
};
const detail = (WorkType) => {
  return transform.transform(WorkType, [
    "work_type_id",
    "work_type_name",
    "description",
    "created_user",
    "created_date",
    "is_active",
    "is_system",
    "is_delete",
    'order_index'
  ]);
};
module.exports = {
  list,detail
};
