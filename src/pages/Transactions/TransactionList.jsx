import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import TransactionContext from '../../context/TransactionContext';
import TransactionFormModal from '../../components/TransactionFormModal';
import { Search, Filter, Plus, Trash2, Edit2 } from 'lucide-react';

const TransactionList = () => {
    const { filters, updateFilters, page, setPage, limit } = useContext(TransactionContext);
    const [transactions, setTransactions] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const fetchTransactions = async (reset = false) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const query = new URLSearchParams({
                page: reset ? 1 : page,
                limit,
                search: filters.search,
                category: filters.category,
                startDate: filters.startDate,
                endDate: filters.endDate,
            }).toString();

            const { data } = await axios.get(`https://personal-expense-tracker-mauve-eight.vercel.app/api/transactions?${query}`, config);

            if (reset || page === 1) {
                setTransactions(data.transactions);
            } else {
                setTransactions(prev => [...prev, ...data.transactions]);
            }
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            fetchTransactions(true); // Reset to page 1 on filter change
        }, 500);
        return () => clearTimeout(handler);
    }, [filters]);

    // Load more trigger
    useEffect(() => {
        if (page > 1) {
            fetchTransactions(false);
        }
    }, [page]);

    const handleLoadMore = () => {
        if (page < totalPages) {
            setPage(prev => prev + 1);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                await axios.delete(`https://personal-expense-tracker-mauve-eight.vercel.app/api/transactions/${id}`, config);
                fetchTransactions(true);
            } catch (err) {
                alert('Failed to delete');
            }
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingTransaction(null);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h1 className='transaction-heading'>Transactions</h1>
                    <button className="btn btn-primary add-new-btn" onClick={handleAdd}>
                        <Plus size={20} /> Add New
                    </button>
                </div>

                {/* Filters */}
                <div className="card mb-6" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    <div className="input-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                        <label>Search</label>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-secondary)' }} />
                            <input
                                type="text"
                                placeholder="Search by title..."
                                style={{ paddingLeft: '35px' }}
                                value={filters.search}
                                onChange={(e) => updateFilters({ search: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="input-group" style={{ flex: '0 0 150px', marginBottom: 0 }}>
                        <label>Category</label>
                        <select value={filters.category} onChange={(e) => updateFilters({ category: e.target.value })}>
                            <option value="All">All Categories</option>
                            <option value="Food">Food</option>
                            <option value="Transport">Transport</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Shopping">Shopping</option>
                            <option value="Utilities">Utilities</option>
                            <option value="Health">Health</option>
                            <option value="Salary">Salary</option>
                            <option value="Investment">Investment</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="input-group" style={{ flex: '0 0 150px', marginBottom: 0 }}>
                        <label>From</label>
                        <input type="date" value={filters.startDate} onChange={(e) => updateFilters({ startDate: e.target.value })} />
                    </div>
                    <div className="input-group" style={{ flex: '0 0 150px', marginBottom: 0 }}>
                        <label>To</label>
                        <input type="date" value={filters.endDate} onChange={(e) => updateFilters({ endDate: e.target.value })} />
                    </div>
                </div>

                {/* List */}
                <div className="transaction-list">
                    {transactions.map(t => (
                        <div key={t._id} className="card mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ marginBottom: '0.5rem' }}>{t.title}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    {new Date(t.date).toLocaleDateString()} • {t.category}
                                </p>
                                {t.notes && <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{t.notes}</p>}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    color: t.amount > 0 ? 'var(--success)' : 'var(--danger)',
                                    marginBottom: '0.5rem'
                                }}>
                                    {t.amount > 0 ? '+' : ''}${Math.abs(t.amount).toFixed(2)}
                                </div>
                                <div className="flex gap-2 justify-end transaction-menu">
                                    <button className="btn" style={{ padding: '5px' }} onClick={() => handleEdit(t)}>
                                        <Edit2 size={16} color="var(--text-secondary)" />
                                    </button>
                                    <button className="btn" style={{ padding: '5px' }} onClick={() => handleDelete(t._id)}>
                                        <Trash2 size={16} color="var(--danger)" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {transactions.length === 0 && !loading && (
                        <p className="text-center text-secondary">No transactions found.</p>
                    )}

                    {loading && <p className="text-center">Loading...</p>}

                    {page < totalPages && (
                        <div className="text-center mt-4">
                            <button className="btn btn-primary" onClick={handleLoadMore}>
                                Load More
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <TransactionFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                transactionToEdit={editingTransaction}
                refreshTransactions={() => fetchTransactions(true)}
            />
        </>
    );
};

export default TransactionList;
