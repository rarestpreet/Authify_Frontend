import { Link } from "react-router-dom";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Assets from "../assets/assets";
import api from "../util/axiosConfig";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";

const RESET_STORAGE_KEY = "resetPasswordState"

const getStoredResetState = () => {
    try {
        const stored = sessionStorage.getItem(RESET_STORAGE_KEY)
        return stored ? JSON.parse(stored) : {}
    } catch {
        return {}
    }
}

const ResetPassword = () => {
    const inputRef = useRef([])
    const navigate = useNavigate()
    const stored = getStoredResetState()
    const [email, setEmail] = useState(stored.email || "")
    const [newPassword, setNewPassword] = useState("")
    const [isEmailSent, setIsEmailSent] = useState(stored.isEmailSent || false)
    const [otp, setOtp] = useState(stored.otp || "")
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(stored.isOtpSubmitted || false)
    const { loading, setLoading, setUserData } = useAppContext()

    const saveResetState = (state) => {
        sessionStorage.setItem(RESET_STORAGE_KEY, JSON.stringify(state))
    }

    const clearResetState = () => {
        sessionStorage.removeItem(RESET_STORAGE_KEY)
    }

    const logout = async () => {
        try {
            await api.post(
                "/logout"
            )

            toast.success("Logged out successfully")
            setUserData({})
        }
        catch (ex) {
            if (ex.response) {
                toast.error(ex.response.message)
            }
            else {
                toast.error("Network error")
            }
        }
    }

    const handleEmailSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await api.post(
                `send-reset-otp?email=${email}`
            )

            toast.success("Otp sent on email")
            setIsEmailSent(true)
            saveResetState({ email, isEmailSent: true, otp: "", isOtpSubmitted: false })
        } catch (ex) {
            console.log(ex.response ? ex.response.message : "Network error");
        } finally {
            setLoading(false)
        }
    }

    const handleOtpVerify = () => {
        setLoading(true)
        const enteredOtp = inputRef.current.filter(Boolean).map((input) => input.value).join("")

        setOtp(enteredOtp)
        setIsOtpSubmitted(true)
        saveResetState({ email, isEmailSent: true, otp: enteredOtp, isOtpSubmitted: true })
        setLoading(false)
    }

    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const info = {
            email: email,
            password: newPassword,
            otp: otp
        }

        try {
            await api.post(
                "/reset-password",
                info
            )

            clearResetState()
            logout()
            toast.success("Password changed successfully!")
            navigate("/login")

        } catch (ex) {
            console.log(ex.response ? ex.response.message : "Network error")
        } finally {
            setLoading(false)
        }

    }

    const handleChange = (e, index) => {
        const value = e.target.value.replace(/\D/, "")
        e.target.value = value

        if (value && index < 5) {
            inputRef.current[index + 1].focus()
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
            inputRef.current[index - 1].focus()
        }
    }


    const handlePaste = (e) => {
        e.preventDefault()
        const paste = e.clipboardData.getData("text").slice(0, 6).split("")
        paste.forEach((digit, i) => {
            if (inputRef.current[i]) {
                inputRef.current[i].value = digit
            }
        })
        const next = paste.length < 6 ? paste.length : 5
        inputRef.current[next].focus()
    }

    return (
        <div className="email-verify-contailer d-flex align-items-center justify-content-center vh-100 position-relative"
            style={{
                background: "linear-gradient(90deg, #6a5af9, #8268f9)",
                border: "none"
            }}
        >
            <Link
                to="/"
                className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
            >
                <img src={Assets.logo} alt="logo" height={32} width={32} />
                <span className="fs-4 fw-semibold text-light">
                    Authify
                </span>
            </Link>

            {!isEmailSent && (
                <div className="rounded-4 p-5 text-center bg-white"
                    style={{
                        width: "100%",
                        maxWidth: "400px"
                    }}>
                    <h4 className="mb-2">
                        Reset Password
                    </h4>
                    <p className="mb-4">
                        Enter your registered email address
                    </p>
                    <form>
                        <div className="input-group mb-4 bg-secondary bg-opacity-10 rounded-pill">
                            <span className="input-group-text bg-transparent border-0 ps-4">
                                <i className="bi bi-envelope"></i>
                            </span>
                            <input type="email"
                                placeholder="Enter email address"
                                className="form-control bg-transparent border-0 ps-1 pe-4 rounded-end"
                                style={{
                                    height: "50px",
                                }}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <button className="btn btn-primary w-100 py-2"
                            onClick={(e) => handleEmailSubmit(e)}
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Submit"}
                        </button>
                    </form>
                </div>
            )}

            {!isOtpSubmitted && isEmailSent && (
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
                                ref={(el) => (inputRef.current[i] = el)}
                                onChange={(e) => handleChange(e, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                onPaste={(e) => handlePaste(e)}
                            />
                        ))}
                    </div>
                    <button
                        className="btn btn-primary w-100 fw-semibold"
                        disabled={loading}
                        onClick={(e) => handleOtpVerify(e)}
                    >
                        {loading ? "Verifying..." : "Verify Otp"}
                    </button>
                </div>
            )}
            {isOtpSubmitted && isEmailSent && (
                <div className="rounded-4 p-4 text-center bg-white"
                    style={{
                        width: "100%",
                        maxWidth: "400px"
                    }}>
                    <h4>
                        New Password
                    </h4>
                    <p className="mb-4">
                        Enter the new password below
                    </p>
                    <form className="input-group bg-secondary border-opacity-10 rounded-pill">
                        <span className="input-group-text bg-transparent border-0 ps-4">
                            <i className="bi bi-person-fill-lock"></i>
                        </span>
                        <input type="password"
                            className="form-control bg-transparent ps-1 pe-4 rounded-end border-0"
                            placeholder="Enter password"
                            style={{
                                height: "50px"
                            }}
                            onChange={(e) => setNewPassword(e.target.value)}
                            value={newPassword}
                            required
                        />
                        <button type="submit"
                            className="btn btn-primary w-100"
                            disabled={loading}
                            onClick={(e) => handlePasswordSubmit(e)}>
                            {loading ? "Loading..." : "Submit"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    )
}

export default ResetPassword;