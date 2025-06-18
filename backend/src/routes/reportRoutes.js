const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

router.get("/revenue", reportController.getRevenue); // ✅

module.exports = router;
