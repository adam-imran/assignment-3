const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    const now = new Date();
    const month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const targetMonth = req.query.month || month;

    const spending = await Transaction.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(req.user.id), type: 'expense', month: targetMonth } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
        { $sort: { total: -1 } }
    ]);

    const budgets = await Budget.find({ userId: req.user.id, month: targetMonth });

    const ranked = spending.map((item, i) => {
        const b = budgets.find(b => b.category === item._id);
        const percent = b ? Math.round((item.total / b.limit) * 100) : null;
        return {
            rank: i + 1,
            category: item._id,
            spent: item.total,
            limit: b ? b.limit : null,
            percent
        };
    });

    res.json(ranked);
});

module.exports = router;
