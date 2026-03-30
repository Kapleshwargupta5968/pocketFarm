import DataTable from "../../components/dashboard/DataTable";
import StatsCard from "../../components/dashboard/StatsCard";

const SubscriberDashboard = () => {
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
    <div>
      <h1 className="text-xl font-semi-bold mb-4">Subscriber Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Subscribed Plots" value="10"/>
        <StatsCard title="Active Plans" value="10"/>
        <StatsCard title="Total Spent (INR)" value="10"/>
      </div>
      <h2 className="text-lg font-semibold mb-2">
        My Subscriptions
      </h2>
      <DataTable columns={columns} data={data}/>
    </div>
  )
}

export default SubscriberDashboard