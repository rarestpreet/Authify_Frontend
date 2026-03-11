import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import Home from "./pages/Home"
import Login from "./pages/Login"
import EmailVerify from "./pages/EmailVerify"
import ResetPassword from "./pages/ResetPassword"
import { ProtectedRoute, PublicRoute } from "./components/CustomRoute.jsx"

function App() {

  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/email-verify" element={<EmailVerify />} />
        </Route >

      </Routes >
    </div >
  )
}

export default App
