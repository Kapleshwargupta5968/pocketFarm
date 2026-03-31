import StatsCard from "../../components/dashboard/StatsCard"
import EarningsChart from "../../components/dashboard/EarningsChart"
import DataTable from "../../components/dashboard/DataTable";
import Loader from "../../components/common/Loader"
import { fetchDashboardData } from "../../features/dashboard/dashboardThunk";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
const FarmerDashboard = () => {
  const dispatch = useDispatch();
  const { stats, chart, table, loading, error } = useSelector(state => state.dashboard);
  useEffect(()=>{
    if(!stats?.totalPlots){
      dispatch(fetchDashboardData());
    }
  },[dispatch, stats]);
  if (loading) return <Loader fullScreen text="Loading dashboard..." />
  if (error) return <div className="text-red-500">{error}</div>

  const columns = [
    {
      title: "Plot ID",
      dataIndex: "plotId",
      key: "plotId"
    },
    {
      title: "Plot Name",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status"
    },
    {
      title: "Subscription",
      dataIndex: "subscription",
      key: "subscription"
    },
    {
      title: "Price (INR)",
      dataIndex: "price",
      key: "price",
      render: (val) => `₹${val}`
    },
    {
      title: "Earnings (INR)",
      dataIndex: "earnings",
      key: "earnings"
    },
  ];

  return (
    <>
      <div>
        <h1 className="text-xl font-semibold mb-4">Farmer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Plots" value={stats?.totalPlots || "0"} />
          <StatsCard title="Active Subscriptions" value={stats?.activeSubscriptions || "0"} />
          <StatsCard title="Earnings (INR)" value={stats?.earnings || "0"} />
          <StatsCard title="Pending Requests" value={stats?.pendingRequests || "0"} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EarningsChart data={chart || []} />
        </div>
        <h2 className="text-lg font-semibold mb-2">My Plots</h2>
        <DataTable columns={columns} data={table || []} />
      </div>
    </>
  )
}

export default FarmerDashboard;