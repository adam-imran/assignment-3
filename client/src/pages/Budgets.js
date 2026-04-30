import { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const CATEGORIES = ['Food', 'Transport', 'Rent', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Other'];

function Budgets() {
    const token = localStorage.getItem('token');
    const now = new Date();
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    const [budgets, setBudgets] = useState([]);
    const [month, setMonth] = useState(currentMonth);
    const [category, setCategory] = useState('');
    const [limit, setLimit] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadBudgets();
    }, [month]);

    const loadBudgets = async () => {
        const res = await fetch(API + '/budgets?month=' + month, {
            headers: { Authorization: 'Bearer ' + token }
        });
        const data = await res.json();
        setBudgets(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!category) { setError('Please select a category'); return; }

        const res = await fetch(API + '/budgets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
            body: JSON.stringify({ category, limit: Number(limit), month })
        });

        const data = await res.json();
        if (!res.ok) { setError(data.message); return; }

        setCategory('');
        setLimit('');
        loadBudgets();
    };

    return (
        <div className="page">
            <h1>Budgets</h1>

            <div className="form-box">
                <h3>Set Budget</h3>
                {error && <p className="error">{error}</p>}
                <form onSubmit={handleSubmit} className="form-grid">
                    <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input type="number" placeholder="Budget Limit (PKR)" value={limit} onChange={e => setLimit(e.target.value)} required />
                    <button type="submit" className="btn-primary">Save Budget</button>
                </form>
            </div>

            <div className="section">
                <h2>Budgets for {month}</h2>
                {budgets.length === 0 ? (
                    <p className="empty">No budgets set for this month.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Limit (PKR)</th>
                                <th>Month</th>
                            </tr>
                        </thead>
                        <tbody>
                            {budgets.map(b => (
                                <tr key={b._id}>
                                    <td>{b.category}</td>
                                    <td>{b.limit.toLocaleString()}</td>
                                    <td>{b.month}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Budgets;
