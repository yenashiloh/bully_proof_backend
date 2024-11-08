const mongoose = require('mongoose');
const db = require('../config/db');

const { Schema } = mongoose;

const reportSchema = new Schema({
    victimRelationship: {
        type: String,
        required: true
    },
    victimName: {
        type: String,
        required: true
    },
    victimType: {
        type: String,
        required: true
    },
    gradeYearLevel: {
        type: String,
        required: true
    },
    hasReportedBefore: {
        type: String,
        required: true
    },
    reportedTo: {
        type: String,
        required: false
    },
    platformUsed: {
        type: [String],
        required: true
    },
    cyberbullyingType: {
        type: [String],
        required: true
    },
    incidentDetails: {
        type: String,
        required: true
    },
    incidentEvidence: {
        type: [String],
        required: false
    },
    perpetratorName: {
        type: String,
        required: true
    },
    perpetratorRole: {
        type: String,
        required: true
    },
    perpetratorGradeYearLevel: {
        type: String,
        required: true
    },
    supportTypes: {
        type: [String],
        required: true
    },
    actionsTaken: {
        type: String,
        required: true
    },
    describeActions: {
        type: String,
        required: false
    },
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    reportDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'To Review'
    }
});

const ReportModel = db.model('report', reportSchema);
module.exports = ReportModel;
