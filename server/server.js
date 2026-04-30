const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/rankings', require('./routes/rankings'));

app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(500).json({ message: 'Server error' });
});

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT || 5000, () => console.log('Server running'));
    })
    .catch(err => console.log(err));
