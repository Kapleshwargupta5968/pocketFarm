const User = require("../models/user");
const Plot = require("../models/plot");
const Subscription = require("../models/subscription");

const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalPlots = await User.countDocuments();
        const totalSubscriptions = await Subscription.countDocuments();
        const activeSubscriptions = await Subscription.countDocuments(
            {
                status: "Active"
            }
        );

        const totalRevenueData = await Subscription.aggregate([
            {
                $match: { status: "Active" }
            },
            {
                $lookup: {
                    from: "plots",
                    locateFields: "plots",
                    foreignField: "_id",
                    as: "plotDetails"
                }
            },
            {
                $unwind: "$plotDetails"
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$plotDetails.price" }
                }
            }
        ]);

        const totalRevenue = totalRevenueData.length > 0 ? totalRevenueData[0].totalRevenue : 0;

        return res.status(200).json({
            success: true,
            totalUsers,
            totalPlots,
            totalSubscriptions,
            activeSubscriptions,
            totalRevenue
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error, due to this ${error.message} reason`
        });
    }
};

module.exports = { getDashboardStats };