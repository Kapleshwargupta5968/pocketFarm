import useAuthInit from "./hooks/useAuthInit"
function App({children}) {
  const isInitialized = useAuthInit();
  
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
