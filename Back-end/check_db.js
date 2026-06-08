const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-attendance';
const DB_FILE = path.join(__dirname, 'db.json');

async function check() {
    console.log('--- DB Check ---');
    
    // Check JSON
    if (fs.existsSync(DB_FILE)) {
        const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
        const user = db.users.find(u => u.username === 'mohit');
        console.log('JSON User (mohit):', user ? { 
            role: user.role, 
            reg: user.registrationNumber,
            phone: user.phoneNumber 
        } : 'Not found');
    }

    // Check MongoDB
    try {
        await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 });
        console.log('MongoDB Connected');
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        const user = await User.findOne({ username: 'mohit' });
        console.log('MongoDB User (mohit):', user ? { 
            role: user.role, 
            reg: user.registrationNumber,
            phone: user.phoneNumber 
        } : 'Not found');
        await mongoose.disconnect();
    } catch (err) {
        console.log('MongoDB connection failed:', err.message);
    }
}

check();
