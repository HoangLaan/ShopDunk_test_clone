const express = require("express");
const workTypeController = require("./work-type.controller");
const routes = express.Router();
const prefix = "/work-type";
const rules = require("./work-type.rule");
const validate = require("express-validation");

// List work type
routes.route("").get(workTypeController.getListWorkType);
// Create new a work type
routes.route("").post(validate(rules.createWorkType), workTypeController.createWorkType);
// Update new a work type
routes.route("/:workTypeId(\\d+)").put(validate(rules.updateWorkType), workTypeController.updateWorkType);
// Detail a work type
routes.route("/:workTypeId(\\d+)").get(workTypeController.detailWorkType);
// Delete a work type
routes.route("/:workTypeId(\\d+)").delete(workTypeController.deleteWorkType);
module.exports = {
  prefix,
  routes,
};
