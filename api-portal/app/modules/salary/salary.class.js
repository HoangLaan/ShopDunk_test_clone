const Transform = require("../../common/helpers/transform.helper");
const config = require("../../../config/config");

const template = {
  salary_id: "{{#? salaryID}}",
  salary_name: "{{#? salaryNAME}}",
  description: "{{#? DESCRIPTION}}",
  created_user: "{{#? CREATEDUSER}}",
  created_date: "{{#? CREATEDDATE}}",
  is_active: "{{ISACTIVE ? 1 : 0}}",
  is_system: "{{ISSYSTEM ? 1 : 0}}",
  is_delete: "{{ISDELETED ? 1 : 0}}",
  id: "{{#? ID}}",
  name: "{{#? NAME}}",
  salary_from: "{{#? SALARYFROM}}",
  salary_to: "{{#? SALARYTO}}",
};

let transform = new Transform(template);

const list = (salarys = []) => {
  return transform.transform(salarys, [
    "salary_id",
    "salary_name",
    "description",
    "created_user",
    "created_date",
    "is_active",
    "is_system"
  ]);
};
const detail = (salary) => {
  return transform.transform(salary, [
    "salary_id",
    "salary_name",
    "description",
    "created_user",
    "created_date",
    "is_active",
    "is_system",
    'salary_from',
    'salary_to'
  ]);
};

const options = (skillgroup = []) => {
  return transform.transform(skillgroup, [
      'id', 'name',
  ]);
};

module.exports = {
  list,detail, options
};
