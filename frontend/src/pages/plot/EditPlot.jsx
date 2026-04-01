import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { getPlotById, updatePlot } from "../../services/plotService";
import { toast } from "react-toastify";
import { useEffect } from "react";
const EditPlot = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchPlot = async (id) => {
      try {
        const response = await getPlotById(id);
        const plot = response?.data || response;
        setValue("currentCrop", plot.currentCrop || "");
        setValue("price", plot.price);
        setValue("status", plot.status);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    };
    fetchPlot(id);
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      await updatePlot(id, {
        ...data,
        price: Number(data.price),
      });

      toast.success("Plots are updated");
    } catch (error) {
      toast.error(
        `Plots are not update, due to this ${error?.response?.data?.message}`,
      );
    }
  };

  return (
    <>
      <div className="p-6 max-w-xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Edit Plot</h1>

        <form action="#" onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Current Crop"
            name="currentCrop"
            register={register}
            error={errors.currentCrop}
          />

          <Input
            label="Price"
            name="price"
            type="number"
            register={register}
            rules={{ required: "Price is required" }}
            error={errors.price}
          />

          <div className="mb-3">
            <label className="block mb-1 font-medium">Status</label>
            <select
              {...register("status")}
              className="border p-2 w-full rounded"
            >
              <option value="Available">Available</option>
              <option value="Subscribed">Subscribed</option>
              <option value="Harvesting">Harvesting</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <Button fullWidth>Update plot</Button>
        </form>
      </div>
    </>
  );
};

export default EditPlot;
