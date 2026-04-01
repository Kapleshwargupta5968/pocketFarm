import useAuthInit from "./hooks/useAuthInit"
import socket from "./services/socketService";
import { useEffect } from "react";
import { useSelector } from "react-redux";
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
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
        <p className="text-gray-600 font-medium">Connecting to PocketFarm...</p>
      </div>
    );
  }

  return (
    <>
    {children}
    </>
  )
}

export default App
