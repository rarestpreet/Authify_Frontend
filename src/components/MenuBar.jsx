import { useNavigate } from "react-router-dom";
import Assets from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const MenuBar = () => {
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const dropDownRef = useRef(null)
    const navigate = useNavigate();
    const { userData, setUserData} = useAppContext()

    const handleLogout = async () => {
        try {
            await axios.post(
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

    return (
        <nav className="navbar">
            <div className="container bg-light px-5 py-4 d-flex rounded-pill justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                    <img src={Assets.logo} alt="logo" width={32} height={32} />
                    <span className="fw-bold fs-4 text-dark">Authify</span>
                </div>

                {userData?.username ? (
                    <div className="position-relative" ref={dropDownRef}>
                        <div className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center cursor-pointer"
                            style={{
                                width: "40px",
                                height: "40px",
                                userSelect: "none",
                                cursor: "pointer"
                            }}
                            onClick={() => setDropDownOpen(state => !state)}
                        >
                            {userData.username[0].toUpperCase()}
                        </div>
                        {dropDownOpen && (
                            <div className="position-absolute shadow bg-white rounded p-2"
                                style={{
                                    top: "50px",
                                    zIndex: 1000,
                                    right: 0
                                }}
                            >
                                {!userData.isAccountVerified && (
                                    <div className="dropdown-item py-1 px-2"
                                        style={{
                                            cursor: "pointer"
                                        }}
                                        onClick={() => { }}
                                    >
                                        Verify email
                                    </div>
                                )}
                                <div className="dropdown-item py-1 px-2 text-danger cursor-pointer"
                                    style={{
                                        cursor: "pointer"
                                    }}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="btn btn-outline-dark rounded-pill px-3"
                        onClick={() => navigate("/login")}
                    >
                        Login <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                )}
            </div >
        </nav>
    );
};

export default MenuBar;