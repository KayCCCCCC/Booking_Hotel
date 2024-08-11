import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
const Header = () => {
    const { isLogin } = useAppContext();
    return (
        <>
            <div className="bg-blue-800 py-6">
                <div className="container mx-auto flex justify-between">
                    <span className="text-3xl text-white font-bold tracking-tight">
                        <Link to="/">BookingHotel.com</Link>
                    </span>
                    {isLogin ?
                        <>
                            <Link to="/">MyBookings</Link>
                            <Link to="/">MyHotels</Link>
                            <button>Sign out</button>
                        </> :
                        <span className="flex space-x-2">
                            <Link to="/sign-in" className='flex items-center bg-white text-blue-600 px-3 font-bold hover:bg-gray-300 rounded'>Sign In </Link>
                        </span>}
                </div>
            </div>
        </>
    )
}

export default Header