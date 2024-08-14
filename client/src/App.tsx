import './App.css'
import Layout from './Layout/Layout'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'
import SignIn from './pages/SignIn'
import { useAppContext } from './contexts/AppContext'
import AddHotel from './pages/AddHotel'

function App() {
  const { isLogin } = useAppContext();
  return (
    <>
      <Router>
        <Routes>

          <Route path='/' element={
            <Layout>
              <p>Home Page</p>
            </Layout>}>
          </Route>

          <Route path='/search'
            element={
              <Layout>
                <p>Search Page</p>
              </Layout>}>
          </Route>

          <Route path='/register'
            element={
              <Layout>
                <Register />
              </Layout>}>
          </Route>

          <Route path='/sign-in'
            element={
              <Layout>
                <SignIn />
              </Layout>}>
          </Route>
          {isLogin &&
            <>
              <Route path='/add-hotel'
                element={
                  <Layout>
                    <AddHotel />
                  </Layout>}>
              </Route>
            </>
          }

          <Route path='*' element={<Navigate to={"/"}></Navigate>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
