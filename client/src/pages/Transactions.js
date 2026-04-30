import { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const CATEGORIES = ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

function Transactions() {
    const token = localStorage.getItem('token');
    const now = new Date();
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    const [transactions, setTransactions] = useState([]);
    const [filterMonth, setFilterMonth] = useState(currentMonth);
    const [filterType, setFilterType] = useState('');

    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadTransactions();
    }, [filterMonth, filterType]);

    const loadTransactions = async () => {
        let url = API + '/transactions?month=' + filterMonth;
        if (filterType) url += '&type=' + filterType;

        const res = await fetch(url, { headers: { Authorization: 'Bearer ' + token } });
        const data = await res.json();
        setTransactions(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!category) { setError('Please select a category'); return; }

        const res = await fetch(API + '/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
            body: JSON.stringify({ type, category, amount: Number(amount), date, note })
        });

        const data = await res.json();
        if (!res.ok) { setError(data.message); return; }

        setAmount('');
        setDate('');
        setNote('');
        setCategory('');
        loadTransactions();
    };

    const handleDelete = async (id) => {
        await fetch(API + '/transactions/' + id, {
            method: 'DELETE',
            headers: { Authorization: 'Bearer ' + token }
        });
        loadTransactions();
    };

    return (
        <div className="page">
            <h1>Transactions</h1>

            <div className="form-box">
                <h3>Add Transaction</h3>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="form-grid">
                    <select value={type} onChange={e => setType(e.target.value)}>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" placeholder="Amount (PKR)" value={amount} onChange={e => setAmount(e.target.value)} required />
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    <input type="text" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} />
                    <button type="submit" className="btn-primary">Add</button>
                </form>
            </div>

            <div className="section">
                <div className="filter-row">
                    <input type="month" value={filterMonth} onChange={e => setFilterMonth(e.target.value)} />
                    <select value={filterType} onChange={e => setFilterType(e.target.value)}>
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                </div>

                {transactions.length === 0 ? (
                    <p className="empty">No transactions found.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Note</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map(t => (
                                <tr key={t._id}>
                                    <td>{t.date}</td>
                                    <td><span className={t.type === 'income' ? 'badge-green' : 'badge-red'}>{t.type}</span></td>
                                    <td>{t.category}</td>
                                    <td>PKR {t.amount.toLocaleString()}</td>
                                    <td>{t.note || '-'}</td>
                                    <td><button onClick={() => handleDelete(t._id)} className="btn-delete">X</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Transactions;
