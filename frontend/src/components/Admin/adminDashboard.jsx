import { Link } from "react-router-dom";
import { useNavigate } from "react-router";


const AdminDashboard = () => {
    const navigate = useNavigate()
    const handleLogOut = evt => {
        evt.preventDefault()
        navigate("/")
    };

    return (
        <div>
            <button style={{
                position: "relative",
                bottom: "3rem",
                left: "35rem"
            }}
                onClick={handleLogOut}
            >
                Logout
            </button>
            <div className="container">
                <h1 style={{ fontSize: "35px" }}>Admin Dashboard</h1>
                <div style={{display:"flex", justifyContent:"center", gap:"35px"}}>
                <h2><Link to={`/admin/users`} style={{ fontSize: "25px" }}>Show Users</Link></h2>
                <h2><Link to={`/admin/posts`} style={{ fontSize: "25px" }}>Show Posts</Link></h2>
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard