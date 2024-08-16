import './App.css'
import Layout from './Layout/Layout'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import { useAppContext } from './contexts/AppContext'
import AddHotel from './pages/AddHotel'
import MyHotels from './pages/MyHotels'
import EditHotel from './pages/EditHotel'
import Search from './pages/Search'
import Detail from './pages/Detail'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBooking'
import Home from './pages/Home'

function App() {
  const { isLogin, isAdmin } = useAppContext();
  console.log(isAdmin)
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={
            <Layout>
              <Home />
            </Layout>
          } />

          <Route path="/search" element={
            <Layout>
              <Search />
            </Layout>
          } />

          <Route path="/detail/:hotelId" element={
            <Layout>
              <Detail />
            </Layout>
          } />

          <Route path="/register" element={
            <Layout>
              <Register />
            </Layout>
          } />

          <Route path="/sign-in" element={
            <Layout>
              <SignIn />
            </Layout>
          } />

          {isLogin && (
            <>
              <Route path="/hotel/:hotelId/booking" element={
                <Layout>
                  <Booking />
                </Layout>
              } />

              <Route path="/my-booking" element={
                <Layout>
                  <MyBookings />
                </Layout>
              } />

              {isAdmin ? (
                <>
                  <Route path="/add-hotel" element={
                    <Layout>
                      <AddHotel />
                    </Layout>
                  } />

                  <Route path="/my-hotel" element={
                    <Layout>
                      <MyHotels />
                    </Layout>
                  } />

                  <Route path="/edit-hotel/:hotelId" element={
                    <Layout>
                      <EditHotel />
                    </Layout>
                  } />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/" />} />
              )}
            </>
          )}

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
