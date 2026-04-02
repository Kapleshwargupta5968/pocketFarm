import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {useParams} from "react-router-dom"
import { getPlotById } from "../../services/plotService";
import {toast} from "react-toastify"
import {setSelectedPlot} from "../../features/plot/plotSlice"
const PlotDetails = () => {
    const {id} = useParams();
    const dispatch = useDispatch();

    const {selectedPlot} = useSelector((state)=>state.plot);
    useEffect(()=>{
        const fetchPlot = async () => {
            try{
            const response = await getPlotById(id);
            dispatch(setSelectedPlot(response.plot));
            }catch(error){
                toast.error(`Enable to fetching plot, ${error?.response?.data?.message}`);
            }
        }
        fetchPlot();
    }, [id, dispatch]);

    if(!selectedPlot){
        return <p className="p-6">Loading...</p>
    }
  return (
    <>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Plot #{selectedPlot.plotNumber}</h1>

        {
            selectedPlot.images?.length > 0 && (
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {
                        selectedPlot.images.map((img, index) => (
                            <img
                            key={index}
                            src={img}
                            alt="Plot image"
                            className="w-full h-48 object-cover rounded-lg shadow" />
                        ))
                    }
                </div>
            )
        }

        <div className="bg-white shadow rounded p-4 space-y-2">
            <p><strong>Size:</strong>{selectedPlot.size}</p>
            <p><strong>Price:</strong>{selectedPlot.price}</p>
            <p><strong>Status:</strong>{selectedPlot.status}</p>

            {
                selectedPlot.sowingDate && (
                    <p>
                        <strong>Harvest Date:</strong>{" "}
                        {new Date(selectedPlot.expectedHarvestDate).toLocaleDateString()}
                    </p>
                )
            }
            <hr/>
            <h2 className="font-semibold">Farmer Info</h2>
            <p>Name: {selectedPlot?.farmer?.name}</p>
            <p>Email: {selectedPlot?.farmer?.email}</p>

            <hr/>
            <h2 className="font-semibold">Location</h2>
            <p>
                Lat: {selectedPlot?.location?.coordinates[1]} | Lng: {" "}
                {selectedPlot?.location?.coordinates[0]}
            </p>
        </div>
      </div>
    </>
  )
}

export default PlotDetails
