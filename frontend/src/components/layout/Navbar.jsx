import { useSelector } from "react-redux"

const Navbar = () => {
    const {user} = useSelector((state)=> state.auth);
    return (
        <>
        <div className="h-16 bg-white shadow flex items-center justify-between px-6">
            <h1 className="text-lg font-bold text-green-600">PocketFarm</h1>
        <div className="flex items-center gap-4">
            <span className="text-gray-600 font-medium">
                {user?.name}
            </span>
            <span className="text-gray-600 font-medium">
                {user?.role}
            </span>
            <button className="text-red-500 hover:underline">
                Logout
            </button>
        </div>
        </div>
        </>
    )
}

export default Navbar;