const mongoose = require('mongoose');

const financialReportSchema = new mongoose.Schema({
    reportType: {
        type: String,
        enum: ['monthly', 'quarterly', 'yearly'],
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    summary: {
        totalIncome: { type: Number, default: 0 },
        totalExpenses: { type: Number, default: 0 },
        netBalance: { type: Number, default: 0 }
    },
    reportData: {
        type: String, // Can be a JSON string or a Base64 encoded file
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('FinancialReport', financialReportSchema);
