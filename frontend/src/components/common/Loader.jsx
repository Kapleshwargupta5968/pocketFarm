const Loader = ({ fullScreen = false, text = "Loading..." }) => {
  if (fullScreen) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50/50 backdrop-blur-sm gap-3">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="text-slate-600 font-medium">{text}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-6 gap-2">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      <p className="text-slate-500 text-sm">{text}</p>
    </div>
  );
};

export default Loader;