import { useSelector } from "react-redux";
import FarmerDashboard from "./FarmerDashboard";
import SubscriberDashboard from "./SubscriberDashboard";

const DashboardHome = () => {
  const { user } = useSelector((state) => state.auth);
  return user?.role === "Farmer" ? <FarmerDashboard /> : <SubscriberDashboard />;
};

export default DashboardHome;
