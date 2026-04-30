const express = require('express');
const router = express.Router();
const Budget = require('../models/Budget');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    const filter = { userId: req.user.id };
    if (req.query.month) filter.month = req.query.month;

    const budgets = await Budget.find(filter);
    res.json(budgets);
});

router.post('/', authMiddleware, validate(['category', 'limit', 'month']), async (req, res) => {
    const { category, limit, month } = req.body;

    const existing = await Budget.findOne({ userId: req.user.id, category, month });
    if (existing) {
        existing.limit = limit;
        await existing.save();
        return res.json(existing);
    }

    const b = new Budget({ userId: req.user.id, category, limit, month });
    await b.save();
    res.status(201).json(b);
});

module.exports = router;
