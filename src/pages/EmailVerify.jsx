import {Link, useNavigate} from "react-router-dom"
import Assets from "../assets/assets"
import {useRef} from "react"
import {useAppContext} from "../context/AppContext.js"
import {useRouteToast} from "../components/RouteRedirect.jsx"
import inputHandler from "../util/inputHandler.js"
import apiMethod from "../services/api.js";
import handleToast from "../util/toast.js";

const EmailVerify = () => {
    const inputRef = useRef([])
    const {loading, setLoading, setUserData} = useAppContext()
    const navigate = useNavigate()

    useRouteToast()

    const handleVerify = async () => {
        const otp = inputRef.current.map(input => input.value).join("")
        if (otp.length !== 6) {
            handleToast.notifyError("Please enter valid otp")
            return
        }

        await apiMethod.verifyEmail(otp, setLoading, navigate, setUserData)


    }


    return (
        <div
            className="email-verify-container d-flex align-items-center justify-content-center vh-100 position-relative"
            style={{
                background: "linear-gradient(90deg, #6a5af9, #8268f9)"
            }}
        >
            <Link
                to="/"
                className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
            >
                <img src={Assets.logo} alt="logo" height={32} width={32}/>
                <span className="fs-4 fw-semibold text-light">
                    Authify
                </span>
            </Link>

            <div
                className="p-5 rounded-4 shadow"
                style={{
                    width: "400px",
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.2)"
                }}
            >
                <h4 className="text-center text-light fw-bold mb-2">
                    Email Verify OTP
                </h4>

                <p className="text-center text-light mb-4">
                    Enter the 6-digit code sent to your email.
                </p>

                <div className="d-flex justify-content-between gap-2 mb-4">
                    {[...Array(6)].map((_, i) => (
                        <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className="form-control text-center fs-4 otp-input"
                            ref={(el) => {
                                inputRef.current[i] = el
                            }}
                            onChange={(e) => inputHandler.handleChange(e, i, inputRef)}
                            onKeyDown={(e) => inputHandler.handleKeyDown(e, i, inputRef)}
                            onPaste={(e) => inputHandler.handlePaste(e, inputRef)}
                        />
                    ))}
                </div>

                <button
                    className="btn btn-primary w-100 fw-semibold"
                    disabled={loading}
                    onClick={handleVerify}
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
            </div>
        </div>
    );
};

export default EmailVerify;