const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-attendance';
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

const DB_FILE = path.join(__dirname, 'db.json');

// Helper to read/write JSON DB
const readDB = () => {
    if (!fs.existsSync(DB_FILE)) return { users: [] };
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
};

const writeDB = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

let useMongoDB = false;

mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 2000,
})
    .then(() => {
        console.log('✅ MongoDB Connected');
        useMongoDB = true;
    })
    .catch(err => {
        console.error('⚠️ MongoDB not found. Switching to Local JSON Database mode.');
        console.log('💡 TIP: To use MongoDB, make sure it is installed and running on port 27017.');
        useMongoDB = false;
    });

// Helper to generate unique 3-digit registration number
const generateRegistrationNumber = async (useMongoDB) => {
    let regNum;
    let exists = true;
    while (exists) {
        regNum = Math.floor(100 + Math.random() * 900).toString();
        if (useMongoDB) {
            const user = await User.findOne({ registrationNumber: regNum });
            if (!user) exists = false;
        } else {
            const db = readDB();
            if (!db.users.find(u => u.registrationNumber === regNum)) exists = false;
        }
    }
    return regNum;
};

// Auth Routes
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { 
            firstName, lastName, phoneNumber, age, weight, 
            membershipPlan, username, password, birthDate, profileImage 
        } = req.body;
        
        if (useMongoDB) {
            const userExists = await User.findOne({ username });
            if (userExists) return res.status(400).json({ message: 'Username already exists' });
        } else {
            const db = readDB();
            if (db.users.find(u => u.username === username)) return res.status(400).json({ message: 'Username already exists' });
        }
        
        const registrationNumber = await generateRegistrationNumber(useMongoDB);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        let membershipDuration = 30;
        if (membershipPlan === 'ONE WEEK TRIAL') membershipDuration = 7;
        else if (membershipPlan === 'ANNUAL BEAST MODE') membershipDuration = 365;

        const membershipEnd = new Date();
        membershipEnd.setDate(membershipEnd.getDate() + membershipDuration);

        const userData = {
            firstName, lastName, phoneNumber, registrationNumber,
            age, weight, birthDate, membershipPlan,
            membershipStart: new Date(),
            membershipEnd, username, password: hashedPassword,
            profileImage: profileImage || '',
            role: 'user', // Default to user, only manual DB update for admin
            attendance: []
        };

        if (useMongoDB) {
            const newUser = new User(userData);
            await newUser.save();
        } else {
            const db = readDB();
            userData._id = Date.now().toString(); // Simple ID for JSON
            db.users.push(userData);
            writeDB(db);
        }

        res.status(201).json({ message: 'User created successfully', registrationNumber });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        let user;

        if (useMongoDB) {
            user = await User.findOne({ username });
        } else {
            const db = readDB();
            user = db.users.find(u => u.username === username);
        }

        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            phoneNumber: user.phoneNumber,
            registrationNumber: user.registrationNumber,
            role: user.role,
            username: user.username,
            membershipPlan: user.membershipPlan,
            membershipEnd: user.membershipEnd,
            weight: user.weight,
            age: user.age,
            birthDate: user.birthDate,
            profileImage: user.profileImage,
            attendance: user.attendance
        }});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware to protect routes
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

const adminAuth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if (decoded.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token is not valid' });
    }
};

// User Profile & Attendance Routes
app.get('/api/user/profile', auth, async (req, res) => {
    try {
        if (useMongoDB) {
            const user = await User.findById(req.user.id).select('-password');
            res.json(user);
        } else {
            const db = readDB();
            const user = db.users.find(u => u._id === req.user.id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            const { password, ...userWithoutPassword } = user;
            res.json(userWithoutPassword);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/user/profile', auth, async (req, res) => {
    try {
        const { weight, profileImage } = req.body;
        if (useMongoDB) {
            const user = await User.findByIdAndUpdate(
                req.user.id, 
                { weight, profileImage }, 
                { new: true }
            ).select('-password');
            res.json(user);
        } else {
            const db = readDB();
            const index = db.users.findIndex(u => u._id === req.user.id);
            if (index === -1) return res.status(404).json({ message: 'User not found' });
            
            db.users[index].weight = weight !== undefined ? weight : db.users[index].weight;
            db.users[index].profileImage = profileImage !== undefined ? profileImage : db.users[index].profileImage;
            
            writeDB(db);
            const { password, ...userWithoutPassword } = db.users[index];
            res.json(userWithoutPassword);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mark attendance by Registration Number (Public)
app.post('/api/attendance/mark', async (req, res) => {
    try {
        const { registrationNumber } = req.body;
        let user;

        if (useMongoDB) {
            user = await User.findOne({ registrationNumber });
        } else {
            const db = readDB();
            user = db.users.find(u => u.registrationNumber === registrationNumber);
        }

        if (!user) return res.status(404).json({ message: 'Invalid Registration Number' });

        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const currentTime = now.toLocaleTimeString('en-GB'); // Format: HH:MM:SS

        const alreadyMarked = user.attendance.find(a => a.date === today);
        if (alreadyMarked) {
            return res.status(400).json({ message: `Attendance already marked for today, ${user.firstName}` });
        }

        user.attendance.push({ date: today, time: currentTime, status: 'Present' });

        if (useMongoDB) {
            await user.save();
        } else {
            const db = readDB();
            const index = db.users.findIndex(u => u.registrationNumber === registrationNumber);
            db.users[index] = user;
            writeDB(db);
        }

        res.json({ message: `Your attendance has been marked, ${user.firstName} ${user.lastName}`, firstName: user.firstName });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Recover Registration Number (Public)
app.post('/api/attendance/recover', async (req, res) => {
    try {
        const { phoneNumber } = req.body;
        let user;

        if (useMongoDB) {
            user = await User.findOne({ phoneNumber });
        } else {
            const db = readDB();
            user = db.users.find(u => u.phoneNumber === phoneNumber);
        }

        if (!user) return res.status(404).json({ message: 'Phone number not found' });

        res.json({ 
            registrationNumber: user.registrationNumber, 
            firstName: user.firstName, 
            lastName: user.lastName 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Coaching Inquiry Route (Public)
app.post('/api/coaching/inquiry', async (req, res) => {
    try {
        const { name, email, phone, goal, message } = req.body;
        
        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email, and phone number are required' });
        }

        const inquiryData = {
            name, email, phone, goal, message: message || '',
            date: new Date()
        };

        if (useMongoDB) {
            const InquirySchema = new mongoose.Schema({
                name: String,
                email: String,
                phone: String,
                goal: String,
                message: String,
                date: { type: Date, default: Date.now }
            });
            const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
            const newInquiry = new Inquiry(inquiryData);
            await newInquiry.save();
        } else {
            const db = readDB();
            if (!db.inquiries) db.inquiries = [];
            inquiryData._id = Date.now().toString();
            db.inquiries.push(inquiryData);
            writeDB(db);
        }

        res.status(201).json({ message: 'Inquiry submitted successfully! Our coach will contact you shortly.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Admin Routes
app.get('/api/admin/users', adminAuth, async (req, res) => {
    try {
        if (useMongoDB) {
            const users = await User.find().select('-password');
            res.json(users);
        } else {
            const db = readDB();
            const usersWithoutPasswords = db.users.map(({ password, ...u }) => u);
            res.json(usersWithoutPasswords);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.get('/api/admin/attendance-stats', adminAuth, async (req, res) => {
    try {
        let users;
        if (useMongoDB) {
            users = await User.find().select('firstName lastName attendance registrationNumber role _id');
        } else {
            const db = readDB();
            users = db.users.map(u => ({
                _id: u._id,
                firstName: u.firstName,
                lastName: u.lastName,
                registrationNumber: u.registrationNumber,
                attendance: u.attendance,
                role: u.role
            }));
        }
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.put('/api/admin/make-admin/:id', adminAuth, async (req, res) => {
    try {
        const userId = req.params.id;
        if (useMongoDB) {
            const user = await User.findByIdAndUpdate(userId, { role: 'admin' }, { new: true }).select('-password');
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.json(user);
        } else {
            const db = readDB();
            const index = db.users.findIndex(u => u._id === userId);
            if (index === -1) return res.status(404).json({ message: 'User not found' });
            db.users[index].role = 'admin';
            writeDB(db);
            const { password, ...userWithoutPassword } = db.users[index];
            res.json(userWithoutPassword);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
