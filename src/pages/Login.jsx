import { useState } from "react";
import Assets from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Login = () => {
    const [isCreateAccount, setisCreateAccount] = useState(true)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const { backend_URL } = useAppContext()
    const navigate = useNavigate()

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        axios.defaults.withCredentials = true
        setLoading(true)
        if (isCreateAccount) {
            try {
                const response = await axios.post(
                    `${backend_URL}/register`,
                    { name, email, password }
                )
                console.log(response);

                toast.success("Account creeated successfully")
                navigate("/")
            }
            catch (ex) {
                if (ex.response) {
                    toast.error(ex.response.data.message)
                }
                else {
                    toast.error("Network Error")
                }
            }
            finally {
                setLoading(false)
            }
        }
        else {
            try {
                const response = axios.post(
                    `${backend_URL}/login`,
                    { email, password }
                )
                console.log(response);

                toast.success("LoggedIn successfully")
                navigate("/")
            }
            catch (ex) {
                if (ex.response) {
                    toast.error(ex.response.data.message)
                }
                else {
                    toast.error("Network Error")
                }
            }
            finally {
                setLoading(false)
            }
        }
    }

    return (
        <div
            className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
            style={{
                background: "linear-gradient(90deg, #6a5af9, #8268f9)"
            }}
        >
            <Link
                to="/"
                className="d-flex align-items-center gap-2 fw-bold fs-4 text-decoration-none text-light"
                style={{
                    position: "absolute",
                    top: "20px",
                    left: "30px"
                }}
            >
                <img src={Assets.logo} alt="logo" height={32} width={32} />
                <span>Authify</span>
            </Link>

            <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>
                <h2 className="text-center mb-4">
                    {isCreateAccount ? "Create Account" : "Login"}
                </h2>
                <form onSubmit={onSubmitHandler}>
                    {isCreateAccount &&
                        (
                            <div className="mb-3">
                                <label
                                    htmlFor="username"
                                    className="form-label">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    className="form-control"
                                    placeholder="Enter username"
                                    value={name}
                                    onChange={(e) => setName(name => e.target.value)}
                                    required />
                            </div>
                        )
                    }
                    <div className="mb-3">
                        <label
                            htmlFor="email"
                            className="form-label">
                            Email Id
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="form-control"
                            placeholder="Enter email"
                            value={email}
                            onChange={(e) => setEmail(email => e.target.value)}
                            required />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="password"
                            className="form-label">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(password => e.target.value)}
                            required />
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <Link to="/reset-password" className="text-decoration-none">
                            Forgot password?</Link>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button type="submit" className="btn btn-primary w-50" display={loading}>
                            {loading ? "Loading" : isCreateAccount ? "Sign up" : "Login"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <div className="mb-0">
                        {isCreateAccount ?
                            <div className="d-flex gap-1 justify-content-center">
                                <span>Already have an account?</span>
                                <span
                                    className="text-decoration-underline"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setisCreateAccount(false)}
                                >
                                    Login here
                                </span>
                            </div> :
                            <div className="d-flex gap-1 justify-content-center">
                                <span>Don't have an account?</span>
                                <span
                                    className="text-decoration-underline"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setisCreateAccount(true)}
                                >
                                    Signup here
                                </span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;