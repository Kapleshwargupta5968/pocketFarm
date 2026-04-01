import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux"
import { getMyPlots, deletePlot } from "../../services/plotService";
import { setMyPlots } from "../../features/plot/plotSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const MyPlots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {myPlots, stats} = useSelector((state)=>state.plot);

  useEffect(()=>{
    const fetchMyPlots = async () => {
      try{
      const response = await getMyPlots();
      dispatch(setMyPlots(response));
      }catch(error){
        toast.error(error?.response?.data?.message || "Failed to fetch plots");
      }
    }
    fetchMyPlots()
  }, [dispatch]);

  const handleDelete = async (plotID) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this plot?");
    if(!confirmDelete){
      return;
    }
    try{
      await deletePlot(plotID);
      const updatePlots = myPlots.filter(plot => plot._id !== plotID);
      const updateStats = {
        total: updatePlots.length,
        available: updatePlots.filter(plot => plot.status === "Available").length,
        subscribed: updatePlots.filter(plot => plot.status === "Subscribed").length,
        harvesting: updatePlots.filter(plot => plot.status === "Harvesting").length,
      }
      dispatch(setMyPlots({plots: updatePlots, stats: updateStats}));
      toast.success("Plot deleted successfully");
    }catch(error){
      toast.error(error?.response?.data?.message || "Failed to delete plot");
    }
  }

  return (
    <>
      <div className='p-6'>
        <div className='grid grid-cols-4 gap-4 mb-6'>
          <div className='bg-white shadow p-4 rounded '>
            <h3 className='text-gray-500 text-sm'>Total</h3>
            <p className='text-xl font-bold'>{stats.total || 0}</p>
          </div>
          <div>
             <h3 className='text-sm'>Available</h3>
            <p className='text-xl font-bold'>{stats.available || 0}</p>
          </div>
          <div>
             <h3 className='text-sm'>Subscribed</h3>
            <p className='text-xl font-bold'>{stats.subscribed || 0}</p>
          </div>
          <div>
             <h3 className='text-sm'>Harvesting</h3> 
            <p className='text-xl font-bold'>{stats.harvesting || 0}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
      <h1 className="text-xl font-bold mb-4">My Plots</h1>
      <button onClick={() => navigate("/create-plot")} className="bg-green-500 text-white px-4 py-2 rounded">
        + Create Plot
      </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {myPlots?.length === 0 ? (
          <p className="text-gray-500">No plots found</p>   
        ) : (
          myPlots.map((plot) => (
          <div key={plot._id} className="bg-white shadow p-4 rounded">
            <h3 className="text-xl font-semi-bold">Plot #{plot?.plotNumber}</h3>
            <p className="text-gray-500">Location: {plot?.location?.coordinates ? `${plot?.location?.coordinates[0]}, ${plot?.location?.coordinates[1]}` : "N/A"}</p>
            <p className="text-gray-500">Size: {plot?.size}</p>
            <p className="text-gray-500">Price: {plot?.price}</p>
            <p className="text-gray-500">Status: {plot?.status}</p>

            {
              plot.currentCrop && (
                <div>
                  <h4 className="text-lg font-semibold">Crops: {plot.currentCrop}</h4>
                </div>
              )
            }
            <div className="flex gap-2 mt-3">
              <button onClick={() => navigate(`/edit-plot/${plot._id}`)} className="bg-blue-500 text-white px-4 py-2 rounded">Edit</button>
              <button onClick={() => handleDelete(plot._id)} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        )))}
      </div>
    </>
  )
}

export default MyPlots
