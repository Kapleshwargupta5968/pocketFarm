import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import notificationReducer from "../features/notification/notificationSlice";
import plotReducer from "../features/plot/plotSlice";
const rootReducer = {
auth: authReducer,
dashboard: dashboardReducer,
notification : notificationReducer,
plot: plotReducer,
};
export default rootReducer;