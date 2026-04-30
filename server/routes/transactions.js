const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const authMiddleware = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    const filter = { userId: req.user.id };
    if (req.query.month) filter.month = req.query.month;
    if (req.query.type) filter.type = req.query.type;

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
});

router.post('/', authMiddleware, validate(['type', 'category', 'amount', 'date']), async (req, res) => {
    const { type, category, amount, date, note } = req.body;
    const month = date.slice(0, 7);

    const t = new Transaction({ userId: req.user.id, type, category, amount, date, month, note });
    await t.save();
    res.status(201).json(t);
});

router.delete('/:id', authMiddleware, async (req, res) => {
    await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Deleted' });
});

module.exports = router;
