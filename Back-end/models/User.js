const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    age: { type: Number },
    weight: { type: Number },
    birthDate: { type: Date },
    membershipPlan: { type: String, required: true },
    membershipStart: { type: Date, default: Date.now },
    membershipEnd: { type: Date },
    profileImage: { type: String }, // Base64 string or URL
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    attendance: [{
        date: { type: String }, // Format: YYYY-MM-DD
        time: { type: String }, // Format: HH:MM:SS
        status: { type: String, enum: ['Present', 'Absent'], default: 'Present' }
    }]
});

module.exports = mongoose.model('User', UserSchema);

