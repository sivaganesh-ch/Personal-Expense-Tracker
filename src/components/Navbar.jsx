import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LogOut, PieChart, List, PlusCircle } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container flex justify-between items-center navbar-content">
                <div className="sm-nav">
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <PieChart size={28} color="var(--accent-color)" />
                        <span>ExpenseTracker</span>
                    </Link>
                    <button onClick={handleLogout} className="btn btn-danger sm-logout-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
                <div className="flex items-center gap-4 navbar-actions">
                    <Link to="/" className="btn" style={{ background: 'transparent', color: 'var(--text-primary)' }}>
                        Dashboard
                    </Link>
                    <Link to="/transactions" className="btn" style={{ background: 'transparent', color: 'var(--text-primary)' }}>
                        <List size={18} /> Transactions
                    </Link>
                    <button onClick={handleLogout} className="btn btn-danger lg-logout-btn" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
