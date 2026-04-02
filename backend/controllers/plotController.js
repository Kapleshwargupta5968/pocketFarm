const Plot = require("../models/plot");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const createPlot = async (req, res) => {
    try {
        const {
            plotNumber,
            size,
            price,
            currentCrop,
            sowingDate,
            expectedHarvestDate,
            latitude,
            longitude
        } = req.body;

        // Validation
        if (!plotNumber || !size || !price) {
            return res.status(400).json({
                success: false,
                message: "Plot number, size, and price are required"
            });
        }

        if (size <= 0) {
            return res.status(400).json({
                success: false,
                message: "Size must be greater than 0"
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });
        }

        // Validate location
        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                success: false,
                message: "Latitude and longitude are required"
            });
        }

        if (latitude < -90 || latitude > 90) {
            return res.status(400).json({
                success: false,
                message: "Latitude must be between -90 and 90"
            });
        }

        if (longitude < -180 || longitude > 180) {
            return res.status(400).json({
                success: false,
                message: "Longitude must be between -180 and 180"
            });
        }

        // Validate dates
        if (sowingDate && expectedHarvestDate) {
            const sowing = new Date(sowingDate);
            const harvest = new Date(expectedHarvestDate);
            if (sowing >= harvest) {
                return res.status(400).json({
                    success: false,
                    message: "Harvest date must be after sowing date"
                });
            }
        }

        // Check if plot already exists
        const existingPlot = await Plot.findOne({ plotNumber });
        if (existingPlot) {
            return res.status(409).json({
                success: false,
                message: "Plot with this number already exists"
            });
        }

        let imageUrls = [];
        if(req.files && req.files.length > 0){
            for(const file of req.files){
                const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
                const result = await cloudinary.uploader.upload(base64, {
                    folder: "pocketfarm/plots"
                });
                imageUrls.push(result.secure_url);
            }
        }

        // Create plot
        const plot = await Plot.create({
            plotNumber: plotNumber.trim(),
            size,
            price,
            currentCrop: currentCrop || null,
            sowingDate: sowingDate || null,
            expectedHarvestDate: expectedHarvestDate || null,
            farmer: req.user._id,
            location: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
            images: imageUrls,
            status: "Available"
        });

        return res.status(201).json({
            success: true,
            message: "Plot created successfully",
            plot: {
                id: plot._id,
                plotNumber: plot.plotNumber,
                size: plot.size,
                price: plot.price,
                status: plot.status,
                location: plot.location,
                images: plot.images,
                currentCrop: plot.currentCrop,
                sowingDate: plot.sowingDate,
                expectedHarvestDate: plot.expectedHarvestDate,
            }
        });

    } catch (error) {
        console.error("Create plot error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const getAllPlots = async (req, res) => {
    try {
        const { status, farmer } = req.query;
        const filters = {};

        if (status) {
            filters.status = status;
        }

        if (farmer) {
            if (!mongoose.Types.ObjectId.isValid(farmer)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid farmer ID format"
                });
            }
            filters.farmer = farmer;
        }

        const plots = await Plot.find(filters)
            .populate("farmer", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: plots.length,
            plots
        });

    } catch (error) {
        console.error("Get all plots error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const getMyPlots = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated"
            });
        }

        const plots = await Plot.find({ farmer: req.user._id })
            .sort({ createdAt: -1 });

        const stats = {
            total: plots.length,
            available: plots.filter(p => p.status === "Available").length,
            subscribed: plots.filter(p => p.status === "Subscribed").length,
            harvesting: plots.filter(p => p.status === "Harvesting").length,
            inactive: plots.filter(p => p.status === "Inactive").length
        };

        return res.status(200).json({
            success: true,
            stats,
            plots
        });

    } catch (error) {
        console.error("Get my plots error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const getPlotById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plot ID format"
            });
        }

        const plot = await Plot.findById(id)
            .populate("farmer", "name email role");

        if (!plot) {
            return res.status(404).json({
                success: false,
                message: "Plot not found"
            });
        }

        return res.status(200).json({
            success: true,
            plot
        });

    } catch (error) {
        console.error("Get plot by ID error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const updatePlot = async (req, res) => {
    try {
        const { id } = req.params;
        const { currentCrop, sowingDate, expectedHarvestDate, status, price } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plot ID format"
            });
        }

        const plot = await Plot.findById(id);
        if (!plot) {
            return res.status(404).json({
                success: false,
                message: "Plot not found"
            });
        }

        // Check authorization
        if (plot.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only update your own plots"
            });
        }

        // Validate status
        const validStatuses = ["Available", "Subscribed", "Harvesting", "Inactive"];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        // Validate dates
        if (sowingDate && expectedHarvestDate) {
            const sowing = new Date(sowingDate);
            const harvest = new Date(expectedHarvestDate);
            if (sowing >= harvest) {
                return res.status(400).json({
                    success: false,
                    message: "Harvest date must be after sowing date"
                });
            }
        }

        // Validate price
        if (price !== undefined && price <= 0) {
            return res.status(400).json({
                success: false,
                message: "Price must be greater than 0"
            });
        }

        // Update plot
        if (currentCrop) plot.currentCrop = currentCrop;
        if (sowingDate) plot.sowingDate = sowingDate;
        if (expectedHarvestDate) plot.expectedHarvestDate = expectedHarvestDate;
        if (status) plot.status = status;
        if (price) plot.price = price;

        await plot.save();

        return res.status(200).json({
            success: true,
            message: "Plot updated successfully",
            plot
        });

    } catch (error) {
        console.error("Update plot error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const deletePlot = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plot ID format"
            });
        }

        const plot = await Plot.findById(id);
        if (!plot) {
            return res.status(404).json({
                success: false,
                message: "Plot not found"
            });
        }

        // Check authorization
        if (plot.farmer.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized: You can only delete your own plots"
            });
        }

        // Prevent deletion if subscribed
        if (plot.status === "Subscribed") {
            return res.status(400).json({
                success: false,
                message: "Cannot delete a subscribed plot. Cancel subscriptions first"
            });
        }

        await Plot.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Plot deleted successfully"
        });

    } catch (error) {
        console.error("Delete plot error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

const searchPlots = async (req, res) => {
    try {
        const { keyword, latitude, longitude, radius } = req.query;
        const filters = {};

        if (keyword) {
            filters.$or = [
                { plotNumber: { $regex: keyword, $options: "i" } },
                { currentCrop: { $regex: keyword, $options: "i" } }
            ];
        }

        let plots;

        if (latitude && longitude && radius) {
            // Geospatial search
            plots = await Plot.find({
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [parseFloat(longitude), parseFloat(latitude)]
                        },
                        $maxDistance: parseFloat(radius) * 1000  // Convert km to meters
                    }
                },
                ...filters
            }).populate("farmer", "name email");
        } else {
            plots = await Plot.find(filters)
                .populate("farmer", "name email");
        }

        return res.status(200).json({
            success: true,
            count: plots.length,
            plots
        });

    } catch (error) {
        console.error("Search plots error:", error);
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error.message}`
        });
    }
};

module.exports = {
    createPlot,
    getAllPlots,
    getMyPlots,
    getPlotById,
    updatePlot,
    deletePlot,
    searchPlots
};