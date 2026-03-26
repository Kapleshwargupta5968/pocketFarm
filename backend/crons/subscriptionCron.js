const cron = require("node-cron");
const Subscription = require("../models/subscription");
const { createNotification } = require("../services/notificationServices");

const subscriptionCron = cron.schedule("0 0 * * *", async () => {
    try {
        console.log("Running subscription expiry job...");

        const expiredSubscriptions = await Subscription.find({
            endDate: { $lt: new Date() },
            status: "Active"
        }).populate("plot");
        if (!expiredSubscriptions.length) {
            console.log("No expired subscriptions found");
            return;
        }

        for (const sub of expiredSubscriptions) {
            try {
                sub.status = "Completed";
                await sub.save();

                const plot = sub.plot;
                if (plot) {
                    plot.status = "Available";
                    await plot.save();
                }

                if (sub.user) {
                    await createNotification({
                        user: sub.user,
                        title: "Subscription Expired",
                        message: plot ? `Your subscription to plot ${plot.plotNumber} has expired` : `Your subscription has expired`,
                        type: "EXPIRY"
                    });
                }
            } catch (error) {
                console.error("Error processing subscription expiry", error);
            }
        }
        console.log(`Processed ${expiredSubscriptions.length} expired subscriptions`);
    } catch (error) {
        console.error("Cron job failed", error);
    }
});

module.exports = subscriptionCron;