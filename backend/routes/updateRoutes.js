const express = require("express");
const router = express.Router();
const {uploadUpdate, getPlotUpdate} = require("../controllers/updateController");
const {authProtector} = require("../middlewares/authMiddleware");

router.post("/", authProtector, uploadUpdate);
router.get("/:id", authProtector, getPlotUpdate);

module.exports = router;