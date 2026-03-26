const express = require("express");
const router = express.Router();
const {authProtector, authorizeRoles} = require("../middlewares/authMiddleware");
const {createPlot, getAllPlots, getPlotById, updatePlots, deletePlot} = require("../controllers/plotController");

router.route("/").post(authProtector, authorizeRoles("Farmer"), createPlot);
router.route("/").get(getAllPlots);
router.route("/:id").get(getPlotById).put(authProtector, authorizeRoles("Farmer"), updatePlots).delete(authProtector, authorizeRoles("Farmer"), deletePlot);

module.exports = router;