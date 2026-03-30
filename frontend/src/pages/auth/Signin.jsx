import {useForm} from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { authStart,authSuccess, authFailure } from '../../features/auth/authSlice';
import {loginUser} from '../../services/authService';
import FormWrapper from '../../components/common/FormWrapper'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
const Signin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {loading, error} = useSelector((state) => state.auth);

    const {register, handleSubmit, formState:{errors}} = useForm();
  
    const onSubmit = async (data) => {
        try{
            dispatch(authStart());
            const response = await loginUser(data);
            dispatch(authSuccess(response?.user));
            toast.success(response?.user || "User login successfully");
            navigate("/dashboard");
        }catch(error){
            dispatch(authFailure(error?.response?.data?.message || "Login failed, please try again."));
            toast.error(error?.response?.data?.message || "Login failed, please try again.");
        }
    }

  return (
    <>
      <FormWrapper title = "Login" onSubmit={handleSubmit(onSubmit)}>
        <Input
        label="Email"
        type="email"
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
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        autoComplete="current-password"
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
            {loading ? "Logging in..." : "Login"}
        </Button>

        {error && <p className='text-red-500 mt-2 text-sm'>{error}</p>}
      </FormWrapper>
    </>
  )
}

export default Signin
