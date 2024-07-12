import { useState } from 'react'

import './App.css'
import Layout from './Layout/Layout'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Register from './pages/Register'

function App() {
  const [count, setCount] = useState(0)

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

          <Route path='*' element={<Navigate to={"/"}></Navigate>}></Route>
        </Routes>
      </Router>
    </>
  )
}

export default App
