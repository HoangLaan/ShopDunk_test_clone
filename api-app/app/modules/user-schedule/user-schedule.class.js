const Transform = require("../../common/helpers/transform.helper");
const config = require("../../../config/config");
const template = {
  user_id: "{{#? USERID}}",
  user_name: "{{#? USERNAME}}",
  user_fullname: "{{#? FULLNAME}}",
  user_picture_url: [
    {
      "{{#if DEFAULTPICTUREURL}}": `${config.domain_cdn}{{DEFAULTPICTUREURL}}`,
    },
    {
      "{{#else}}": null,
    },
  ],
  shift_id: "{{#? SHIFTID}}",
  shift_name: "{{#? SHIFTNAME}}",
  store_id: "{{#? STOREID}}",
  store_name: "{{#? STORENAME}}",
  address: "{{#? ADDRESS}}",
  schedule_id: "{{#? SCHEDULEID}}",
  shift_date: "{{#? SHIFTDATE}}",
  user_confirm: "{{#? USERCONFIRM}}",
  time_start: "{{#? TIMESTART}}",
  time_end: "{{#? TIMEEND}}",
  time_keeping_id: "{{#? TIMEKEEPINGID}}",
  is_time_keeping: "{{#? ISTIMEKEEPING}}",
  department_id: "{{#? DEPARTMENTID}}",
  department_name: "{{#? DEPARTMENTNAME}}",
  business_id: "{{#? BUSINESSID}}",
  business_name: "{{#? BUSINESSNAME}}",
  fullName: "{{#? USERFULLNAME}}",
  department_name: "{{#? DEPARTMENTNAME}}",
  total_time: "{{#? TOTALTIME}}",
  department_name: "{{#? DEPARTMENTNAME}}",
  company_id: "{{#? COMPANYID}}",
  company_name: "{{#? COMPANYNAME}}",
  Monday: '{{#? ISAPPLYMONDAY}}',
  Tuesday: '{{#? ISAPPLYTUESDAY}}',
  Wednesday: '{{#? ISAPPLYWEDNESDAY}}',
  Thursday: '{{#? ISAPPLYTHURSDAY}}',
  Friday: '{{#? ISAPPLYFRIDAY}}',
  Saturday: '{{#? ISAPPLYSATURDAY}}',
  Sunday: '{{#? ISAPPLYSUNDAY}}',
  date_create:'{{ CREATEDDATE}}',
  min_date:'{{#? MINDATE}}',
  max_date:'{{#? MAXDATE}}',
};
let transform = new Transform(template);

const listUser = (data = []) => {
  return transform.transform(data, ["user_id", "user_name", "user_fullname", "user_picture_url", "department_name"]);
};
const listShift = (data = []) => {
  return transform.transform(data, ["shift_id", "shift_name", "time_start", "time_end", 'address']);
};
const listStore = (data = []) => {
  return transform.transform(data, ["store_id", "store_name"]);
};
const listCompany = (data = []) => {
  return transform.transform(data, ["company_id", "company_name"]);
};
const listDepartment = (data = []) => {
  return transform.transform(data, ["department_id", "department_name"]);
};
const listBusiness = (data = []) => {
  return transform.transform(data, ["business_id", "business_name"]);
};
const listSchedule = (data = []) => {
  return transform.transform(data, [
    "store_id",
    "shift_id",
    "shift_date",
    "schedule_id",
    "user_fullname",
    "user_name",
    "store_name",
    "shift_name",
    "is_time_keeping",
    'time_start',
    "time_end",
    'date_create',
  ]);
};
const timekeepingDetail = (data = []) => {
  return transform.transform(data, [
    "time_end",
    "time_start",
    "user_confirm",
    "time_keeping_id",
    "fullName",
    "total_time",
  ]);
};

const timeWordInWeek = (data = []) => {
  return transform.transform(data, [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);
};
const minMaxTime = (data = []) => {
  return transform.transform(data, [
    "min_date",
    "max_date",
  ]);
};

module.exports = {
  listUser,
  listStore,
  listSchedule,
  listShift,
  timekeepingDetail,
  listDepartment,
  listBusiness,
  listCompany,
  timeWordInWeek,
  minMaxTime,
};
