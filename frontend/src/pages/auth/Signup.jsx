import { useDispatch, useSelector } from "react-redux";
import FormWrapper from "../../components/common/FormWrapper"
import Input from "../../components/common/Input"
import {authStart, authFailure, authSuccess} from "../../features/auth/authSlice";
import {registerUser} from "../../services/authService";
import Button from "../../components/common/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
const Signup = () => {
    const dispatch = useDispatch();
    const {loading, error} = useSelector((state)=> state.auth);

  const {register, handleSubmit, formState:{errors}} = useForm();

    const onSubmit = async (data) => {
        try{
            dispatch(authStart());
            const response = await registerUser(data);
            dispatch(authSuccess(response?.user));
            toast.success(response?.message || "User registered successfully");
        }catch(error){
            dispatch(authFailure(error?.response?.data?.message || "Failed to register user"));
            toast.error(error?.response?.data?.message || "Failed to register user");
        }
    }
  return (
    <>
      <FormWrapper title="Sign Up" onSubmit={handleSubmit(onSubmit)}>
        <Input
        type="text"
        label="Name"
        name="name"
        placeholder="Enter your name"
        autoComplete="name"
        register={register}
        rules={{
            required:"Name is required",
            minLength:{
                value:3,
                message:"Name must be atleast 3 characters"
            }
        }}
        error={errors.name}
        />
        <Input
        type="email"
        label="Email"
        name="email"
        placeholder="Enter your email"
        autoComplete="email"
        register={register}
        rules={{
            required:"Email is required",
            pattern:{
                value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message:"Please enter a valid email address"
            }
        }}
        error={errors.email}
        />
        <Input
        type="password"
        label="Password"
        name="password"
        placeholder="Enter your password"
        autoComplete="new-password"
        register={register}
        rules={{
            required:"Password is required",
            minLength:{
                value:6,
                message:"Password must be at least 6 characters long"
            }
        }}
        error={errors.password}
        />  

        <Button loading={loading} fullWidth>
            {loading ? "Signing up..." : "Sign Up"}
        </Button>

        {error && <p className='text-red-500 mt-2 text-sm'>{error}</p>}
      </FormWrapper>
    </>
  )
}

export default Signup
