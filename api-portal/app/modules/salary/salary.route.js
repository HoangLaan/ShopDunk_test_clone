const express = require("express");
const salaryController = require("./salary.controller");
const routes = express.Router();
const prefix = "/salary";
const rules = require("./salary.rule");
const validate = require("express-validation");

// List salary
routes.route("").get(salaryController.getListSalary);
// Create new a salary
routes.route("").post(validate(rules.createSalary), salaryController.createSalary);
// Update new a salary
routes.route("/:salaryId(\\d+)").put(validate(rules.UpdateSalary), salaryController.UpdateSalary);
// Detail a salary
routes.route("/:salaryId(\\d+)").get(salaryController.detailSalary);
// Delete a salary
routes.route("/:salaryId(\\d+)").delete(salaryController.deleteSalary);
// Options salary
routes.route("/get-options").get(salaryController.getOptions);

module.exports = {
  prefix,
  routes,
};
