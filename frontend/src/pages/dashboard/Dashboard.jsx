import { useSelector } from "react-redux"
import DashboardLayout from "../../components/layout/DashboardLayout";
import FarmerDashboard from "./FarmerDashboard";
import SubscriberDashboard from "./SubscriberDashboard";

const Dashboard = () => {
  const {user} = useSelector((state)=>state.auth);
  return (
    <>
    <DashboardLayout>
      {user?.role === "Farmer" ? (
        <FarmerDashboard/>
      ) : (
        <SubscriberDashboard/>
      )}
    </DashboardLayout>
    </>
  )
}

export default Dashboard