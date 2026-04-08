import useAuthInit from "./hooks/useAuthInit"
import socket from "./services/socketService";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "./components/common/Loader";

function App({children}) {
  const isInitialized = useAuthInit();

  const {user} = useSelector((state) => state.auth);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if(userId){
      console.log("📱 Registering user with socket:", userId);
      socket.emit("register", userId);
    }

    return () => {
     socket.off("register");
    }
  }, [user]);
  
  if(!isInitialized){
    return <Loader fullScreen={true} text="Connecting to PocketFarm..." />;
  }

  return (
    <>
    {children}
    </>
  )
}

export default App
