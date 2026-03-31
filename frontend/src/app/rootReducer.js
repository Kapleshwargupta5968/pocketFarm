import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
const rootReducer = {
auth: authReducer,
dashboard: dashboardReducer
};
export default rootReducer;