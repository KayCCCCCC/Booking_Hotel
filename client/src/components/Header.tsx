import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import SignOutButton from './SignOutButton';
const Header = () => {
    const { isLogin, isAdmin } = useAppContext();
    return (
        <>
            <div className="bg-blue-800 py-6">
                <div className="container mx-auto flex justify-between">
                    <span className="text-3xl text-white font-bold tracking-tight">
                        <Link to="/">BookingHotel.com</Link>
                    </span>

                    <span className="flex space-x-2">
                        {isLogin ?
                            <>
                                {!isAdmin && <Link className='flex items-center text-white px-3 font-bold hover:bg-blue-600 rounded' to="/my-booking">MyBookings</Link>}
                                {isAdmin && <Link className='flex items-center text-white px-3 font-bold hover:bg-blue-600 rounded' to="/my-hotel">MyHotels</Link>}
                                <SignOutButton />
                            </> :
                            <Link to="/sign-in" className='flex items-center bg-white text-blue-600 px-3 font-bold hover:bg-gray-300 rounded'>Sign In </Link>
                        }
                    </span>
                </div>
            </div>
        </>
    )
}

export default Header