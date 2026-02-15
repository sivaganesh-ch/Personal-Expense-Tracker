import { useState, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const TransactionFormModal = ({ isOpen, onClose, transactionToEdit, refreshTransactions }) => {
    const [formData, setFormData] = useState({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });
    const [type, setType] = useState('expense');

    useEffect(() => {
        if (transactionToEdit) {
            setType(transactionToEdit.amount < 0 ? 'expense' : 'income');
            setFormData({
                title: transactionToEdit.title,
                amount: Math.abs(transactionToEdit.amount),
                category: transactionToEdit.category,
                date: new Date(transactionToEdit.date).toISOString().split('T')[0],
                notes: transactionToEdit.notes || '',
            });
        } else {
            setType('expense');
            setFormData({
                title: '',
                amount: '',
                category: 'Food',
                date: new Date().toISOString().split('T')[0],
                notes: '',
            });
        }
    }, [transactionToEdit, isOpen]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const payload = {
                ...formData,
                amount: type === 'expense' ? -Math.abs(Number(formData.amount)) : Math.abs(Number(formData.amount)),
            };

            if (transactionToEdit) {
                await axios.put(`http://localhost:5000/api/transactions/${transactionToEdit._id}`, payload, config);
            } else {
                await axios.post('http://localhost:5000/api/transactions', payload, config);
            }
            refreshTransactions();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Error processing transaction');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div className="card sm-model" style={{ width: '100%', maxWidth: '500px', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', color: 'var(--text-secondary)' }}>
                    <X size={24} />
                </button>
                <h2 className="mb-4">{transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>

                <div className="flex gap-4 mb-4">
                    <button
                        type="button"
                        className={`btn ${type === 'income' ? 'btn-success' : ''}`}
                        style={{ flex: 1, border: type === 'income' ? '2px solid var(--success)' : '1px solid var(--text-secondary)', color: type === 'income' ? 'var(--success)' : 'var(--text-secondary)' }}
                        onClick={() => setType('income')}
                    >
                        Income
                    </button>
                    <button
                        type="button"
                        className={`btn ${type === 'expense' ? 'btn-danger' : ''}`}
                        style={{ flex: 1, border: type === 'expense' ? '2px solid var(--danger)' : '1px solid var(--text-secondary)', color: type === 'expense' ? '' : 'var(--text-secondary)' }}
                        onClick={() => setType('expense')}
                    >
                        Expense
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Amount</label>
                        <input type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} required min="0" />
                    </div>
                    <div className="input-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
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
                    <div className="input-group">
                        <label>Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                    </div>
                    <div className="input-group">
                        <label>Notes (Optional)</label>
                        <textarea name="notes" value={formData.notes} onChange={handleChange}></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-full">
                        {transactionToEdit ? 'Update' : 'Add'} Transaction
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionFormModal;
