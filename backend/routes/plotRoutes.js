const express = require("express");
const router = express.Router();
const {authProtector, authorizedRoles} = require("../middlewares/authMiddleware");
const {createPlot, getAllPlots, getPlotById, updatePlots, deletePlot} = require("../controllers/plotController");

router.route("/").post(authProtector, authorizedRoles("Farmer"), createPlot);
router.route("/").get(getAllPlots);
router.route("/:id").get(getPlotById).put(authProtector, authorizedRoles("Farmer"), updatePlots).delete(authProtector, authorizedRoles("Farmer"), deletePlot);

module.exports = router;