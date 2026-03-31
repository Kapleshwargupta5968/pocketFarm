import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import Loader from "../../components/common/Loader";
import DataTable from "../../components/dashboard/DataTable";
import StatsCard from "../../components/dashboard/StatsCard";
import { fetchDashboardData } from "../../features/dashboard/dashboardThunk";

const SubscriberDashboard = () => {
  const dispatch = useDispatch();
  const { stats, table, loading, error } = useSelector(state => state.dashboard);

  useEffect(() => {
    if (!stats?.subscribedPlots) {
      dispatch(fetchDashboardData());
    }
  }, [dispatch, stats]);

  if (loading) return <Loader fullScreen text="Loading dashboard..." />
  if (error) return <div className="text-red-500">{error}</div>

  const columns = [
    { title: "Plot ID", dataIndex: "plotId", key: "plotId" },
    { title: "Farmer Name", dataIndex: "farmerName", key: "farmerName" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Subscriber Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Subscribed Plots" value={stats?.subscribedPlots || "0"} />
        <StatsCard title="Active Plans" value={stats?.activePlans || "0"} />
        <StatsCard title="Total Spent (INR)" value={stats?.totalSpent || "0"} />
      </div>
      <h2 className="text-lg font-semibold mb-2">My Subscriptions</h2>
      <DataTable columns={columns} data={table} />
    </div>
  )
}

export default SubscriberDashboard;