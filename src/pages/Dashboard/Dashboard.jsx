import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../../context/AuthContext';
import { PieChart, Pie, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';
import { PlusCircle, Wallet, TrendingUp, TrendingDown } from 'lucide-react';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0 });
    const [categoryData, setCategoryData] = useState([]);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };

                const summaryRes = await axios.get('http://localhost:5000/api/transactions/summary', config);
                setSummary(summaryRes.data.summary);
                setCategoryData(summaryRes.data.categoryBreakdown);

                const recentRes = await axios.get('http://localhost:5000/api/transactions?limit=5', config);
                setRecentTransactions(recentRes.data.transactions);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

    // Process data for the chart: filtering expenses (negative values) and converting to positive
    // Process data for the chart: filtering expenses (negative values), converting to positive, and assigning colors
    const chartData = categoryData
        .filter(item => item.totalAmount < 0)
        .map((item, index) => ({
            name: item._id,
            amount: Math.abs(item.totalAmount),
            fill: COLORS[index % COLORS.length]
        }));

    if (loading) return <div className="text-center mt-4">Loading Dashboard...</div>;

    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h1 className='dashboard-heading'>Dashboard</h1>
                <Link to="/transactions?add=true" className="btn btn-primary add-transaction-btn">
                    <PlusCircle size={20} /> Add Transaction
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid-summary" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '2rem' }}>
                <div className="card text-center">
                    <Wallet size={32} color="var(--text-secondary)" />
                    <h3>Total Balance</h3>
                    <h2 style={{ color: (summary.totalIncome + summary.totalExpense) >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                        ${(summary.totalIncome + summary.totalExpense).toFixed(2)}
                    </h2>
                </div>
                <div className="card text-center">
                    <TrendingUp size={32} color="var(--success)" />
                    <h3>Total Income</h3>
                    <h2 className="text-success">${Math.abs(summary.totalIncome).toFixed(2)}</h2>
                </div>
                <div className="card text-center">
                    <TrendingDown size={32} color="var(--danger)" />
                    <h3>Total Expense</h3>
                    <h2 className="text-danger">${Math.abs(summary.totalExpense).toFixed(2)}</h2>
                </div>
            </div>

            <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
                {/* Chart Section */}
                <div className="card" style={{ flex: '1 1 400px', minHeight: '400px' }}>
                    <h3>Expenses by Category</h3>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="amount"
                                    nameKey="name"
                                />
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className="text-center mt-4 text-secondary">No data to display</p>
                    )}
                </div>

                {/* Recent Transactions */}
                <div className="card" style={{ flex: '1 1 400px' }}>
                    <h3>Recent Transactions</h3>
                    <ul className="transaction-list mt-4">
                        {recentTransactions.map((t) => (
                            <li key={t._id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '10px 0',
                                borderBottom: '1px solid var(--bg-tertiary)'
                            }}>
                                <div>
                                    <strong>{t.title}</strong>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                        {new Date(t.date).toLocaleDateString()} • {t.category}
                                    </div>
                                </div>
                                <div style={{
                                    fontWeight: 'bold',
                                    color: t.amount > 0 ? 'var(--success)' : 'var(--danger)'
                                }}>
                                    {t.amount > 0 ? '+' : ''}${t.amount.toFixed(2)}
                                </div>
                            </li>
                        ))}
                        {recentTransactions.length === 0 && <p>No recent transactions.</p>}
                    </ul>
                    <Link to="/transactions" className="btn mt-4" style={{ width: '100%', background: 'var(--bg-tertiary)', justifyContent: 'center' }}>
                        View All
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default Dashboard;
