import React, {useState, useRef, useEffect } from "react";
import { FaUserTie,FaSignOutAlt, FaConciergeBell, FaUserCircle, FaUserFriends, FaUtensils, FaStore, FaCalendarAlt,FaTable,FaUserCog } from "react-icons/fa";
import "./admin.css";
import { useNavigate } from "react-router-dom";


function Admin() {
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef();

    // for the close menu by click outside

    useEffect(() => {
        const handleClick = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);

    const dashboard = [
        {
            title: "Owner Dashboard",
            desc: "Overview, revenue & analytics",
            icon: <FaStore/>,
            link: "/owner"
        },
        {
            title: "Manager Dashboard",
            desc: "Daily operations & reporting",
            icon: <FaUserTie/>,
            link: "/manager"
        },
        {
            title: "Host Dashboard",
            desc: "Manage tables & reservations",
            icon: <FaConciergeBell/>,
            link: "/host"
        },
        {
            title: "Waiter Dashboard",
            desc: "Servr customers & update order status",
            icon: <FaUserFriends/>,
            link: "/waiter"
        },
        {
            title: "Chef Dashboard",
            desc: "View & prepare orders",
            icon: <FaUtensils/>,
            link: "/chef"
        },
        
    ];
    return (
        <div className="admin-container">
            <nav className="admin-navbar">
                <h2 className="admin-logo">Admin Panel</h2>

                {/* Profile dropdown */}
                <div className="admin-profile" ref={menuRef}>
                    <FaUserCircle
                    className="admin-user-icon" 
                    onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpen(!menuOpen);
                    }}
                    />

                    {menuOpen && (
                        <div className="admin-dropdown">
                            <p className="dd-item">
                                <FaUserCog /> Profile Settings
                            </p>
                            <p className="dd-item logout-item">
                                <FaSignOutAlt /> Logout
                            </p>
                        </div>
                    )}
                </div>
            </nav>
{/* Dashboard items */}
            <section className="admin-dashboard">
                {dashboard.map((item, index) => (
                    <div className="admin-card" key={index} onClick={() => navigate(item.link)}>
                        <div className="admin-icon">{item.icon}</div>
                        <h3>{item.title}</h3>
                        <p>{item.desc}</p>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Admin;