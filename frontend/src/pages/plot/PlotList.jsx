import { useEffect } from "react";
import {useDispatch, useSelector} from "react-redux";
import { getAllPlots } from "../../services/plotService";
import { setPlots } from "../../features/plot/plotSlice";
const PlotList = () => {
    const dispatch = useDispatch();
    const {plots = []} = useSelector((state) => state.plot);
    useEffect(()=>{
      const fetchPlots = async () => {
          try{
            const response = await getAllPlots();
            dispatch(setPlots(response.data));
        }catch(error){
            console.error("Error fetching plots:", error);
        }
      }
        fetchPlots();
    }, [dispatch]);
  return (
    <>
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">All plots</h1>

        {
            Array.isArray(plots) &&
            !plots || plots.length === 0 ? (
                <p>No plots found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {
                        plots.map((plot) => (
                            <div key={plot._id} className="border rounded-lg p-4 shadow">
                                <h2 className="font-semibold">Plot #{plot.plotNumber}</h2>
                                <p>Size: {plot.size}</p>
                                <p>Price: {plot.price}</p>
                                <p>Status: {plot.status}</p>

                                <p className="text-sm text-gray-500">
                                    Farmer: {plot?.farmer ? plot?.farmer?.name : "N/A"}
                                </p>
                            </div>
                        ))
                    }
                </div>
            )
        }
      </div>
    </>
  )
}

export default PlotList;
