const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    month: { type: String, required: true },
    date: { type: String, required: true },
    note: { type: String, default: '' }
});

module.exports = mongoose.model('Transaction', transactionSchema);
