import { FaHome, FaCalendarAlt, FaUtensils, FaUsers, FaChartBar, FaCog } from "react-icons/fa";

function Sidebar() {
    return(
        <aside className="sidebar">
            <h2 className="logo">Restaurant Management</h2>
            <div className="role-badge">Host</div>
            
            <ul className="sidebar-menu">
                <li><FaHome /> Dashboard</li>
                <li><FaCalendarAlt /> Reservations</li>
                <li><FaUtensils /> Tables</li>
                <li><FaUsers /> Customers</li>
                <li><FaChartBar /> Reports</li>
                <li><FaCog /> Settings</li>
            </ul>
        </aside>
    );
}
export default Sidebar;