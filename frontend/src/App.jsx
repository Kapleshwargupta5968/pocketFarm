import useAuthInit from "./hooks/useAuthInit"
function App({children}) {
  const isInitialized = useAuthInit();
  
  if(!isInitialized){
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  return (
    <>
    {children}
    </>
  )
}

export default App
