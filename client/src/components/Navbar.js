import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
    const token = localStorage.getItem('token');
    const name = localStorage.getItem('name');
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('name');
        navigate('/login');
    };

    if (!token) return null;

    return (
        <nav className="navbar">
            <span className="nav-logo">BudgetTracker</span>
            <div className="nav-links">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/transactions">Transactions</Link>
                <Link to="/budgets">Budgets</Link>
            </div>
            <div className="nav-right">
                <span className="nav-user">{name}</span>
                <button onClick={logout} className="btn-logout">Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
