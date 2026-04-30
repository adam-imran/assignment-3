import { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function Dashboard() {
    const token = localStorage.getItem('token');
    const now = new Date();
    const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

    const [month, setMonth] = useState(currentMonth);
    const [transactions, setTransactions] = useState([]);
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        loadData();
    }, [month]);

    const loadData = async () => {
        const headers = { Authorization: 'Bearer ' + token };

        const tRes = await fetch(API + '/transactions?month=' + month, { headers });
        const tData = await tRes.json();
        setTransactions(tData);

        const rRes = await fetch(API + '/rankings?month=' + month, { headers });
        const rData = await rRes.json();
        setRankings(rData);
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    return (
        <div className="page">
            <div className="page-header">
                <h1>Dashboard</h1>
                <input type="month" value={month} onChange={e => setMonth(e.target.value)} />
            </div>

            <div className="summary-cards">
                <div className="card green">
                    <p>Income</p>
                    <h3>PKR {totalIncome.toLocaleString()}</h3>
                </div>
                <div className="card red">
                    <p>Expenses</p>
                    <h3>PKR {totalExpense.toLocaleString()}</h3>
                </div>
                <div className={`card ${balance >= 0 ? 'blue' : 'red'}`}>
                    <p>Balance</p>
                    <h3>PKR {balance.toLocaleString()}</h3>
                </div>
            </div>

            <div className="section">
                <h2>Spending Rankings</h2>
                {rankings.length === 0 ? (
                    <p className="empty">No expense data for this month.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Category</th>
                                <th>Spent (PKR)</th>
                                <th>Budget (PKR)</th>
                                <th>Used</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rankings.map(r => (
                                <tr key={r.category}>
                                    <td>#{r.rank}</td>
                                    <td>{r.category}</td>
                                    <td>{r.spent.toLocaleString()}</td>
                                    <td>{r.limit ? r.limit.toLocaleString() : 'No budget'}</td>
                                    <td>
                                        {r.percent !== null ? (
                                            <span className={r.percent > 100 ? 'over' : r.percent > 80 ? 'warn' : 'ok'}>
                                                {r.percent}%
                                            </span>
                                        ) : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
