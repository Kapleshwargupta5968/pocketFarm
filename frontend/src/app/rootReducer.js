import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import notificationReducer from "../features/notification/notificationSlice";
import plotReducer from "../features/plot/plotSlice";
import subscriptionSlice from "../features/subscription/subscriptionSlice";
const rootReducer = {
auth: authReducer,
dashboard: dashboardReducer,
notification : notificationReducer,
plot: plotReducer,
subscription: subscriptionSlice
};
export default rootReducer;