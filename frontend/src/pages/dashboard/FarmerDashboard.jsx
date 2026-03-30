import StatsCard from "../../components/dashboard/StatsCard"
import EarningsChart from "../../components/dashboard/EarningsChart"
import DataTable from "../../components/dashboard/DataTable";
const FarmerDashboard = () => {
  const chartData = [
    { month: 'Jan', earnings: 100 },
    { month: 'Feb', earnings: 200 },
    { month: 'Mar', earnings: 300 },
    { month: 'Apr', earnings: 400 },
    { month: 'May', earnings: 500 },
    { month: 'Jun', earnings: 600 },
    { month: 'Jul', earnings: 700 },
    { month: 'Aug', earnings: 800 },
    { month: 'Sep', earnings: 900 },
    { month: 'Oct', earnings: 1000 },
    { month: 'Nov', earnings: 1100 },
    { month: 'Dec', earnings: 1200 },
  ];

  const columns = [
    {
      title: "Plot ID",
      dataIndex: "plotId",
      key: "plotId"
    },
    {
      title: "Crop",
      dataIndex: "crop",
      key: "crop"
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
      title: "Earnings",
      dataIndex: "earnings",
      key: "earnings"
    },
  ];

  const data = [
    { plotId: "1", crop: "Wheat", status: "Active", subscription: "100", earnings: "100" },
    { plotId: "2", crop: "Rice", status: "Active", subscription: "100", earnings: "100" },
    { plotId: "3", crop: "Maize", status: "Active", subscription: "100", earnings: "100" },
    { plotId: "4", crop: "Wheat", status: "Active", subscription: "100", earnings: "100" },
    { plotId: "5", crop: "Rice", status: "Active", subscription: "100", earnings: "100" },
  ];

  return (
    <>
      <div>
        <h1 className="text-xl font-semi-bold mb-4">Farmer Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Plots" value="10" />
          <StatsCard title="Active Subscriptions" value="10" />
          <StatsCard title="Earnings (INR)" value="10" />
          <StatsCard title="Pending Requests" value="10" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <EarningsChart data={chartData} />
        </div>
        <h2 className="text-lg font-semibold mb-2">My Plots</h2>
        <DataTable columns={columns} data={data} />
      </div>

    </>
  )
}

export default FarmerDashboard;