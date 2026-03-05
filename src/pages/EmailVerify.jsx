import { Link, useNavigate } from "react-router-dom";
import Assets from "../assets/assets";
import { useRef, useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import api from "../util/axiosConfig";

const EmailVerify = () => {
    const inputRef = useRef([])
    const [loading, setLoading] = useState(false)
    const { userData } = useAppContext()
    const navigate = useNavigate()

    useEffect(() => {
        if (userData?.isAccountVerified) {
            toast.error("Email already verified")
            navigate("/")
        }
    }, [userData, navigate])

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

    const handleVerify = async () => {
        const otp = inputRef.current.map(input => input.value).join("")
        if (otp.length != 6) {
            toast.error("Please enter valid otp")
            return
        }

        setLoading(true)

        try {
            await api.post(
                "/verify-email",
                { otp }
            )

            toast.success("Email verified successfully")
            navigate("/")
        }
        catch (ex) {
            toast.error(ex.response ? ex.response.message : "Network error")
        }
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
                <img src={Assets.logo} alt="logo" height={32} width={32} />
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
                    onClick={handleVerify}
                >
                    {loading ? "Verifying..." : "Verify Email"}
                </button>
            </div>
        </div>
    );
};

export default EmailVerify;