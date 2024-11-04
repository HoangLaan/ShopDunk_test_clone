const express = require("express");
const router = express.Router();
const barcodeController = require("../controllers/barcode.controller");

let routes = (app) => {
  router.post("/print/barcode", barcodeController.print);
  app.use(router);
};

module.exports = routes;