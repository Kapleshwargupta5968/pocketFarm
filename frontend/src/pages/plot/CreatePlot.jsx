import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
// import FormWrapper from "../../components/common/FormWrapper";
import Input from "../../components/common/Input"
import { useForm } from "react-hook-form"
import { createPlot } from "../../services/plotService";
import { toast } from "react-toastify";
import {useState} from "react"

const CreatePlot = () => {
    const {register, handleSubmit, formState : {errors}} = useForm();
    const [files, setFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
      try{
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);

        const previewUrls = selectedFiles.map((file) => (
          URL.createObjectURL(file)
        ));
        setPreviews(previewUrls);
      }catch(error){
        toast.error(`Failed to preview images, ${error?.response?.data?.message}`);
      }
    }

    const onSubmit = async (data) => {
        setLoading(true);
        try{
            const formData = new FormData();
            Object.keys(data).forEach((key) => {
              formData.append(key, data[key]);
            });

            for(let file of files){
              formData.append("images", file);
            }

            await createPlot(formData);
            toast.success("Plot created successfully");
            setLoading(false);
            navigate("/plots");
        }catch(error){
            toast.error(error?.response?.data?.message || "Failed to create plot"); 
            setLoading(false);
        }
    }
  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="card">
        <div className="mb-8 border-b border-slate-100 pb-5">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create New Plot</h1>
          <p className="text-sm text-slate-500 mt-1">Fill in the details below to add a new plot to your farm.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Main Details Section */}
          <div>
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2"><span className="text-emerald-500">🌾</span> Plot Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
               <Input label="Plot Number" type="number" placeholder="e.g. 101" register={register} name="plotNumber" rules={{required:"Plot number is required"}} error={errors.plotNumber} />
               <Input label="Size (sq.ft)" type="number" placeholder="Enter plot size" register={register} name="size" rules={{required:"Plot size is required"}} error={errors.size} />
               <Input label="Price (₹)" type="number" placeholder="Enter plot price" register={register} name="price" rules={{required:"Plot price is required", min: {value: 0, message:"Price cannot be negative"}}} error={errors.price} />
               <Input label="Current Crop" type="text" placeholder="e.g. Wheat" register={register} name="currentCrop" />
            </div>
          </div>

          {/* Dates Section */}
          <div className="pt-2">
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2"><span className="text-emerald-500">📅</span> Schedule</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Input label="Sowing Date" type="date" register={register} name="sowingDate" />
              <Input label="Harvest Date" type="date" register={register} name="expectedHarvestDate" />
            </div>
          </div>

          {/* Location Section */}
          <div className="pt-2">
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2"><span className="text-emerald-500">📍</span> Coordinates</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <Input label="Latitude" type="number" placeholder="e.g. 28.7041" register={register} name="latitude" />
              <Input label="Longitude" type="number" placeholder="e.g. 77.1025" register={register} name="longitude" />
            </div>
          </div>

          {/* Media Section */}
          <div className="pt-2">
            <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2"><span className="text-emerald-500">📸</span> Media</h2>
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 transition-colors text-center relative group">
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="text-slate-500 flex flex-col items-center pointer-events-none group-hover:text-emerald-600 transition-colors">
                <span className="text-4xl mb-3">📥</span>
                <p className="font-semibold text-lg">Click or drag images here</p>
                <p className="text-sm mt-1 opacity-75">JPG, PNG up to 5MB</p>
              </div>
            </div>

            {previews.length > 0 && (
              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
                {previews.map((preview, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden shadow-sm border border-slate-100">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-28 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">Image {index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="pt-6 border-t border-slate-100">
            <Button loading={loading} fullWidth>
              Create Plot
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePlot
