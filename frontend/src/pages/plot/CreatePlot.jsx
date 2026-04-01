import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
// import FormWrapper from "../../components/common/FormWrapper";
import Input from "../../components/common/Input"
import { useForm } from "react-hook-form"
import { createPlot } from "../../services/plotService";
import { toast } from "react-toastify";

const CreatePlot = () => {
    const {register, handleSubmit, formState : {errors}} = useForm();

    const navigate = useNavigate();
    const onSubmit = async (data) => {
        try{
            await createPlot({
                ...data,
                size: Number(data.size),
                price: Number(data.price),
                latitude: Number(data.latitude),
                longitude: Number(data.longitude)
            });
            toast.success("Plot created successfully");
            navigate("/plots");
        }catch(error){
            toast.error(error?.response?.data?.message || "Failed to create plot"); 
        }
    }
  return (
    <>
      {/* <FormWrapper title="Create Plot" onSubmit={handleSubmit(onSubmit)}"> */}
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Create Plot</h1>
        <form action="#" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Plot Number"
            type="Number"
            placeholder="Enter plot number"
            register={register}
        name="plotNumber"
        rules={{required:"Plot number is required"}}
        error={errors.plotNumber}
        />

        <Input
        label="Size"
        type="number"
        placeholder="Enter plot size"
        register={register}
        name="size"
        rules={{required:"Plot size is required"}}
        error={errors.size}
        />

        <Input
        label="Price"
        type="number"
        placeholder="Enter plot price"
        register={register}
        name="price"
        rules={{required:"Plot price is required", min: {value: 0, message:"Price cannot be negative"}}}
        error={errors.price}
        />

        <Input
        label="Current-Crop"
        type="text"
        placeholder="Enter current crop name"
        register={register}
        name="currentCrop"
        />

        <Input
        label="Sowing Date"
        type="date"
        register={register}
        name="sowingDate"
        />
        <Input
        label="Harvest Date"
        type="date"
        register={register}
        name="expectedHarvestDate"
        />
        <Input
        label="Latitude"
        type="number"
        placeholder="Enter latitude"
        register={register}
        name="latitude"
        />

        <Input
        label="Longitude"
        type="number"
        placeholder="Enter longitude"
        register={register}
        name="longitude"
        />
        <Button loading={false} fullWidth>
          Create Plot
        </Button>
        </form>
      </div>
      {/* </FormWrapper> */}
    </>
  )
}

export default CreatePlot
