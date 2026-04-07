import useAuthInit from "./hooks/useAuthInit"
import socket from "./services/socketService";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import Loader from "./components/common/Loader";

function App({children}) {
  const isInitialized = useAuthInit();

  const {user} = useSelector((state) => state.auth);

  useEffect(() => {
    if(user?._id){
      socket.emit("register", user._id);
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
