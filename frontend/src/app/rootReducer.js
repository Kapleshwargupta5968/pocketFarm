import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import notificationReducer from "../features/notification/notificationSlice";
const rootReducer = {
auth: authReducer,
dashboard: dashboardReducer,
notification : notificationReducer
};
export default rootReducer;