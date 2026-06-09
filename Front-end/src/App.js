import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy, Zap, Target, Dumbbell, Activity, Info, X, User as UserIcon, Calendar, Weight, Clock, CheckCircle, LogOut } from 'lucide-react';
import axios from 'axios';
import './App.css';

// Import images
import heroImg from './assets/hero.png';
import heroGrayscale from './assets/hero_grayscale.png';
import modelNeon from './assets/model_neon.png';
import workout1 from './assets/workout_1.png';
import workout2 from './assets/workout_2.png';
import workout3 from './assets/workout_3.png';
import workout4 from './assets/workout_4.png';

// Import carousel images
import carousel1 from './assets/carousel-1.jpg';
import carousel2 from './assets/carousel-2.jpg';
import carousel3 from './assets/carousel-3.jpg';
import carousel4 from './assets/carousel-4.jpg';
import carousel5 from './assets/carousel-5.jpg';
import carousel6 from './assets/carousel-6.jpg';

// Import gallery carousel images
import mainHall1 from './assets/gallery-carousel/main-hall/1.jpg';
import mainHall2 from './assets/gallery-carousel/main-hall/2.jpg';
import mainHall3 from './assets/gallery-carousel/main-hall/3.jpg';

import cardioZone1 from './assets/gallery-carousel/cardio-zone/1.jpg';
import cardioZone2 from './assets/gallery-carousel/cardio-zone/2.jpg';
import cardioZone3 from './assets/gallery-carousel/cardio-zone/3.jpg';

import freeWeights1 from './assets/gallery-carousel/free-weights/1.jpg';
import freeWeights2 from './assets/gallery-carousel/free-weights/2.jpg';
import freeWeights3 from './assets/gallery-carousel/free-weights/3.jpg';

import groupClasses1 from './assets/gallery-carousel/group-classes/1.jpg';
import groupClasses2 from './assets/gallery-carousel/group-classes/2.jpg';
import groupClasses3 from './assets/gallery-carousel/group-classes/3.jpg';

import personalTraining1 from './assets/gallery-carousel/personal-training/1.jpg';
import personalTraining2 from './assets/gallery-carousel/personal-training/2.jpg';
import personalTraining3 from './assets/gallery-carousel/personal-training/3.jpg';

const carouselImages = [carousel1, carousel2, carousel3, carousel4, carousel5, carousel6];

const zoneCarouselImages = {
  'main-hall': [mainHall1, mainHall2, mainHall3],
  'cardio-zone': [cardioZone1, cardioZone2, cardioZone3],
  'free-weights': [freeWeights1, freeWeights2, freeWeights3],
  'group-classes': [groupClasses1, groupClasses2, groupClasses3],
  'personal-training': [personalTraining1, personalTraining2, personalTraining3]
};

const API_URL = 'https://website-gym-backend.onrender.com';

function ZoneCard({ zoneKey, title, icon, onClick, images }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isTextScrolled, setIsTextScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 992px)');
    setIsMobile(mediaQuery.matches);

    const handler = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    let timeoutId;
    let intervalId;

    if (isMobile) {
      intervalId = setInterval(() => {
        setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 1500);
    } else if (isHovered) {
      timeoutId = setTimeout(() => {
        setIsTextScrolled(true);
        setActiveImageIndex(1);

        intervalId = setInterval(() => {
          setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 1500);
      }, 500);
    } else {
      setIsTextScrolled(false);
      setActiveImageIndex(0);
    }

    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [isHovered, isMobile, images.length]);

  return (
    <div
      className={`zone-card ${zoneKey} ${isMobile ? 'mobile-card' : ''}`}
      onClick={onClick}
      onMouseEnter={() => !isMobile && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
    >
      <div className="zone-card-images-container">
        <AnimatePresence initial={false}>
          <motion.img
            key={activeImageIndex}
            src={images[activeImageIndex]}
            alt={title}
            className="zone-card-bg-carousel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            style={{
              filter: (isMobile || isTextScrolled) ? 'brightness(0.95)' : 'brightness(0.55)'
            }}
          />
        </AnimatePresence>
        <div className={`zone-card-overlay ${isMobile ? 'mobile-hidden' : ''} ${isTextScrolled ? 'scrolled' : ''}`}></div>
      </div>
      <motion.div
        className={`zone-card-content ${isMobile ? 'mobile-content' : ''}`}
        animate={isMobile ? { y: 0, opacity: 1, scale: 1 } : {
          y: isTextScrolled ? -120 : 0,
          opacity: isTextScrolled ? 0 : 1,
          scale: isTextScrolled ? 0.95 : 1
        }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {icon}
        <span className="zone-name">{title}</span>
      </motion.div>
    </div>
  );
}

function App() {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'signup'
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [authForm, setAuthForm] = useState({
    username: '', password: '', firstName: '', lastName: '',
    age: '', weight: '', phoneNumber: '', membershipPlan: 'ONE WEEK TRIAL',
    birthDate: '', profileImage: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ weight: '', profileImage: '' });
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [regNumInput, setRegNumInput] = useState('');
  const [recoveryPhone, setRecoveryPhone] = useState('');
  const [adminData, setAdminData] = useState({ users: [], attendance: [] });
  const [attendanceMessage, setAttendanceMessage] = useState('');
  const [recoveryInfo, setRecoveryInfo] = useState(null);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [message, setMessage] = useState('');

  // Coaching section and gym zones state variables
  const [coachingFormTab, setCoachingFormTab] = useState('inquiry');
  const [coachingInquiry, setCoachingInquiry] = useState({
    name: '', email: '', phone: '', goal: 'Muscle Building', message: ''
  });
  const [coachingLogin, setCoachingLogin] = useState({ username: '', password: '' });
  const [coachingMsg, setCoachingMsg] = useState('');
  const [coachingError, setCoachingError] = useState('');
  const [selectedZone, setSelectedZone] = useState(null);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${API_URL}/user/profile`, {
        headers: { 'x-auth-token': token }
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      handleLogout();
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (authMode === 'login') {
        const res = await axios.post(`${API_URL}/auth/login`, {
          username: authForm.username,
          password: authForm.password
        });
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        setIsAuthOpen(false);
      } else {
        const res = await axios.post(`${API_URL}/auth/signup`, authForm);
        setAuthMode('login');
        setMessage(`Signup successful! Your Registration ID is: ${res.data.registrationNumber}. Please login.`);
      }
    } catch (err) {
      if (!err.response) {
        setMessage('Cannot reach the server. Please ensure the Backend is running and MongoDB is connected.');
      } else {
        setMessage(err.response.data?.message || 'An error occurred during authentication');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsProfileOpen(false);
  };

  const markAttendance = async () => {
    try {
      const res = await axios.post(`${API_URL}/user/attendance`, {}, {
        headers: { 'x-auth-token': token }
      });
      setUser({ ...user, attendance: res.data.attendance });
      alert('Attendance marked successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handleAttendanceByReg = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/attendance/mark`, { registrationNumber: regNumInput });
      setAttendanceMessage(res.data.message);
      setRegNumInput('');
      if (user && user.registrationNumber === regNumInput) {
        fetchUserProfile();
      }
    } catch (err) {
      setAttendanceMessage(err.response?.data?.message || 'Error marking attendance');
    }
  };

  const handleRecoverRegNum = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/attendance/recover`, { phoneNumber: recoveryPhone });
      setRecoveryInfo(res.data);
      setRecoveryPhone('');
    } catch (err) {
      alert(err.response?.data?.message || 'Phone number not found');
    }
  };

  const fetchAdminData = async () => {
    try {
      const usersRes = await axios.get(`${API_URL}/admin/users`, { headers: { 'x-auth-token': token } });
      const statsRes = await axios.get(`${API_URL}/admin/attendance-stats`, { headers: { 'x-auth-token': token } });
      setAdminData({ users: usersRes.data, attendance: statsRes.data });
      setIsAdminDashboardOpen(true);
    } catch (err) {
      alert('Admin access denied or error fetching data');
    }
  };

  const handleMakeAdmin = async (userId) => {
    try {
      if (!window.confirm('Are you sure you want to make this user an Admin?')) return;
      await axios.put(`${API_URL}/admin/make-admin/${userId}`, {}, { headers: { 'x-auth-token': token } });
      alert('User is now an Admin!');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error making user admin');
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  const isBirthday = (birthDate) => {
    if (!birthDate) return false;
    const birth = new Date(birthDate);
    const today = new Date();
    return birth.getDate() === today.getDate() && birth.getMonth() === today.getMonth();
  };

  const handleImageUpload = (e, target = 'auth') => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (target === 'auth') setAuthForm({ ...authForm, profileImage: reader.result });
        else setEditForm({ ...editForm, profileImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/user/profile`, editForm, {
        headers: { 'x-auth-token': token }
      });
      setUser(res.data);
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating profile');
    }
  };

  const calculateDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diff = end - now;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  const handleCoachingInquirySubmit = async (e) => {
    e.preventDefault();
    setCoachingError('');
    setCoachingMsg('');
    try {
      const res = await axios.post(`${API_URL}/coaching/inquiry`, {
        name: coachingInquiry.name,
        email: coachingInquiry.email,
        phone: coachingInquiry.phone,
        goal: coachingInquiry.goal,
        message: coachingInquiry.message
      });
      setCoachingMsg(res.data.message);
      setCoachingInquiry({
        name: '', email: '', phone: '', goal: 'Muscle Building', message: ''
      });
    } catch (err) {
      if (!err.response) {
        setCoachingError('Cannot reach the server. Please ensure the Backend is running.');
      } else {
        setCoachingError(err.response.data?.message || 'Failed to submit inquiry.');
      }
    }
  };

  const handleCoachingLoginSubmit = async (e) => {
    e.preventDefault();
    setCoachingError('');
    setCoachingMsg('');
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        username: coachingLogin.username,
        password: coachingLogin.password
      });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      setCoachingMsg('Login successful!');
      setCoachingLogin({ username: '', password: '' });
      setIsProfileOpen(true);
    } catch (err) {
      if (!err.response) {
        setCoachingError('Cannot reach the server. Please ensure the Backend is running.');
      } else {
        setCoachingError(err.response.data?.message || 'Invalid username or password');
      }
    }
  };

  const zoneDetailsData = {
    'main-hall': {
      title: 'Main Hall',
      description: 'The premium heart of Beauty and Beast Gym. Features high ceilings, ambient ventilation, and state-of-the-art strength training machines by leading manufacturers. Perfect for structured resistance workouts.',
      features: ['Selectorized Strength Machines', 'Olympic Lifting Platforms', 'Heavy Kettlebell Area', 'Dedicated Stretching Space']
    },
    'cardio-zone': {
      title: 'Cardio Zone',
      description: 'Equipped with the latest generation curved and motorized treadmills, cross-trainers, rowing machines, and high-intensity assault bikes. Ideal for enhancing heart health and explosive calorie burning.',
      features: ['Curved Woodway Treadmills', 'Concept2 Rower & SkiErg', 'Assault AirBikes', 'Interactive Spin Bikes']
    },
    'free-weights': {
      title: 'Free Weights',
      description: 'Designed for raw power and bodybuilding. Our free weight section features multiple heavy-duty power racks, dumbbell ranges up to 80kg, flat/incline/decline bench presses, and impact-absorbing flooring.',
      features: ['Dumbbells from 2kg to 80kg', 'Competition Power Racks', 'Calibrated Steel Plates', 'Barbell Specialties (Trap, Safety, EZ)']
    },
    'group-classes': {
      title: 'Group Classes',
      description: 'Join a community of motivated beasts. Our dedicated group training studio hosts high-intensity HIIT circuits, boxing drills, yoga flow sessions, and specialized core conditioning classes guided by elite trainers.',
      features: ['Daily High-Energy Workouts', 'Elite Group Instructors', 'Boxing & Combat Gear', 'Yoga & Mobility Sessions']
    },
    'personal-training': {
      title: 'Personal Training',
      description: 'One-on-one coaching with our elite personal trainers. Get a custom workout plan, nutrition guidance, and real-time tracking to hit your fitness goals faster.',
      features: ['Custom Workout & Nutrition Plans', '1-on-1 Dedicated Coaching', 'Weekly Progress & Body Metrics Review', 'Flexible Scheduling']
    }
  };

  const exerciseKnowledge = {
    cardio: { title: "High Intensity Cardio", text: "HIIT workouts push your heart rate to 80-90% of its maximum, resulting in higher calorie burn and improved cardiovascular health even hours after the workout." },
    strength: { title: "Hypertrophy Training", text: "To build muscle effectively, aim for 3-5 sets of 8-12 repetitions. This range is scientifically proven to maximize muscle growth and strength gains." },
    mobility: { title: "Dynamic Mobility", text: "Incorporating dynamic stretching before workouts increases joint range of motion and blood flow, significantly reducing the risk of injury." },
    nutrition: { title: "Metabolic Nutrition", text: "Eating high-quality protein within 30-60 minutes post-workout optimizes muscle protein synthesis and accelerates the repair of micro-tears in muscle tissue." }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="app">
      {/* ORIGINAL HEADER TOP BAR */}
      <div className="top-bar">
        <div className="top-bar-left">
          CALL US (345) 522656
          {user && user.role === 'admin' && (
            <button onClick={fetchAdminData} className="top-bar-admin-btn">ADMIN DASHBOARD</button>
          )}
        </div>
        <div className="top-bar-right">
          <a href="#trial-signup" className="btn-trial-old">
            1 WEEK TRIAL <ArrowRight size={18} />
          </a>
          <a href="#get-started" className="btn-membership-old">
            FULL MEMBERSHIP <ArrowRight size={18} />
          </a>
        </div>
      </div>

      {/* ORIGINAL NAVBAR */}
      <nav className="navbar-old">
        <div className="logo-old">
          BEAUTY AND BEAST <span className="logo-pro-tag">GYM</span>
        </div>
        <div className="nav-links-old">
          <a href="#get-started">GET STARTED</a>
          <a href="#about">ABOUT</a>
          <a href="#workouts">WORKOUTS</a>
          <a href="#coaching">COACHING</a>
        </div>
        <div className="nav-right-old">
          {user ? (
            <>
              <button onClick={() => { setIsAttendanceOpen(true); setAttendanceMessage(''); }} className="nav-attendance-btn">ATTENDANCE</button>
              <button onClick={() => setIsProfileOpen(true)} className="profile-icon-btn">
                <UserIcon size={24} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => { setIsAuthOpen(true); setAuthMode('login'); }} className="nav-login-btn">LOGIN</button>
              <button onClick={() => { setIsAttendanceOpen(true); setAttendanceMessage(''); }} className="nav-attendance-btn">ATTENDANCE</button>
            </>
          )}
        </div>
      </nav>

      {/* ORIGINAL HERO SECTION */}
      <section className="hero-old">
        {/* Decorative background icons */}
        <div className="decor-icons">
          <motion.div className="decor-icon d1" animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity }}><Dumbbell size={100} /></motion.div>
          <motion.div className="decor-icon d2" animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }}><Zap size={80} /></motion.div>
          <motion.div className="decor-icon d3" animate={{ rotate: [0, 10, 0] }} transition={{ duration: 6, repeat: Infinity }}><Target size={120} /></motion.div>
          <motion.div className="decor-icon d4" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }}><Activity size={90} /></motion.div>
          <motion.div className="decor-icon d5" animate={{ y: [0, -15, 0] }} transition={{ duration: 5, repeat: Infinity }}><Trophy size={110} /></motion.div>
          <motion.div className="decor-icon side-left-1" animate={{ x: [-10, 10, -10] }} transition={{ duration: 7, repeat: Infinity }}><Zap size={150} /></motion.div>
          <motion.div className="decor-icon side-left-2" animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity }}><Dumbbell size={130} /></motion.div>
          <motion.div className="decor-icon side-right-1" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }}><Activity size={160} /></motion.div>
          <motion.div className="decor-icon side-right-2" animate={{ y: [-20, 20, -20] }} transition={{ duration: 6, repeat: Infinity }}><Target size={140} /></motion.div>
        </div>

        <div className="hero-info-box bg-extra-1">
          <div className="info-icon"><Info size={20} /></div>
          <div className="info-content">
            <h4>24/7 ACCESS</h4>
            <p>Train whenever you want, our facility is always open.</p>
          </div>
        </div>

        <div className="hero-info-box bg-extra-2">
          <div className="info-icon"><Info size={20} /></div>
          <div className="info-content">
            <h4>EXPERT COACHES</h4>
            <p>Get professional guidance from certified trainers.</p>
          </div>
        </div>

        <div className="container">
          <div className="hero-container-old">
            <motion.div className="hero-left-old" variants={stagger} initial="initial" animate="animate">
              <motion.div className="feature-item-old" variants={fadeInUp}>
                <div className="feature-icon-old"><Activity size={32} /></div>
                <div className="feature-text-old">INCREASE ENDURANCE</div>
              </motion.div>
              <motion.div className="feature-item-old" variants={fadeInUp}>
                <div className="feature-icon-old"><Dumbbell size={32} /></div>
                <div className="feature-text-old">CUSTOMIZE WORKOUTS</div>
              </motion.div>
              <motion.div className="feature-item-old" variants={fadeInUp}>
                <div className="feature-icon-old"><Trophy size={32} /></div>
                <div className="feature-text-old">ACHIEVE RESULTS</div>
              </motion.div>
            </motion.div>

            <motion.div className="hero-center-old" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}>
              <div className="hero-glow-old"></div>
              <div className="hero-glow-purple-old"></div>
              <div className="hero-info-box top-left"><div className="info-icon"><Zap size={20} /></div><div className="info-content"><h4>FAST PACE</h4><p>HIIT to boost metabolism.</p></div></div>
              <div className="hero-info-box top-right"><div className="info-icon"><Target size={20} /></div><div className="info-content"><h4>PRECISE</h4><p>Targeted results.</p></div></div>
              <div className="hero-info-box bottom-left"><div className="info-icon"><Activity size={20} /></div><div className="info-content"><h4>VITALITY</h4><p>Daily energy levels.</p></div></div>
              <div className="hero-info-box bottom-right"><div className="info-icon"><Trophy size={20} /></div><div className="info-content"><h4>WINNER</h4><p>Celebrate milestones.</p></div></div>
              <img src={heroImg} alt="Fitness Professional" className="hero-image-old" />
            </motion.div>

            <motion.div className="hero-right-old" variants={fadeInUp} initial="initial" animate="animate">
              <h1 className="hero-title-old">BUILD YOUR HEALTH<br />BUILD YOUR BODY</h1>
              <p className="hero-p-old">Are you ready to start taking your fitness to another level? Guided workouts anytime, anywhere.</p>
              <button className="btn-trial-old hero-cta-old">1 WEEK TRIAL <ArrowRight size={18} /></button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="container">
          <motion.h2 className="about-heading" {...fadeInUp}>About BEAUTY AND BEAST GYM</motion.h2>
          <div className="about-content">
            <motion.p className="about-p" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              At Beauty and Beast GYM, we believe in the perfect balance of aesthetics and raw power. Our facility is designed for those who want to sculpt their physique while building unstoppable strength.
            </motion.p>
          </div>
          <div className="carousel-container">
            <motion.div className="carousel-track" animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
              {carouselImages.map((img, i) => (
                <div key={`carousel-1-${i}`} className="carousel-item">
                  <img src={img} alt={`Gym Moment ${i + 1}`} className="carousel-img" />
                </div>
              ))}
              {carouselImages.map((img, i) => (
                <div key={`carousel-2-${i}`} className="carousel-item">
                  <img src={img} alt={`Gym Moment ${i + 1}`} className="carousel-img" />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Gym Zones grid gallery from user screenshot */}
          <div className="zones-gallery">
            <div className="zones-grid">
              <ZoneCard
                zoneKey="main-hall"
                title="MAIN HALL"
                icon={<Trophy size={48} className="zone-icon" />}
                onClick={() => setSelectedZone('main-hall')}
                images={zoneCarouselImages['main-hall']}
              />
              <ZoneCard
                zoneKey="cardio-zone"
                title="CARDIO ZONE"
                icon={<Zap size={48} className="zone-icon" />}
                onClick={() => setSelectedZone('cardio-zone')}
                images={zoneCarouselImages['cardio-zone']}
              />
              <ZoneCard
                zoneKey="free-weights"
                title="FREE WEIGHTS"
                icon={<Target size={48} className="zone-icon" />}
                onClick={() => setSelectedZone('free-weights')}
                images={zoneCarouselImages['free-weights']}
              />
              <ZoneCard
                zoneKey="group-classes"
                title="GROUP CLASSES"
                icon={<Activity size={48} className="zone-icon" />}
                onClick={() => setSelectedZone('group-classes')}
                images={zoneCarouselImages['group-classes']}
              />
              <ZoneCard
                zoneKey="personal-training"
                title="PERSONAL TRAINING"
                icon={<Dumbbell size={48} className="zone-icon" />}
                onClick={() => setSelectedZone('personal-training')}
                images={zoneCarouselImages['personal-training']}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="signup-old" id="get-started">
        <div className="container">
          <motion.h2 className="signup-h2-old" {...fadeInUp}>BUILD YOUR HEALTH BUILD YOUR BODY</motion.h2>
          <div className="signup-form-old">
            <div className="form-group-old"><label>ACCOUNT TYPE</label><select><option>One week trial: $1</option><option>Monthly Membership: $45.95</option></select></div>
            <div className="form-group-old"><label>EMAIL</label><input type="email" placeholder="Email" /></div>
            <div className="form-group-old"><label>USERNAME</label><input type="text" placeholder="Username" /></div>
            <div className="form-group-old"><label>PASSWORD</label><input type="password" placeholder="Password" /></div>
            <button className="btn-submit-old">Submit <ArrowRight size={18} /></button>
          </div>
        </div>
      </section>

      <section className="hero-full" id="coaching">
        <div className="hero-full-decor"></div>
        <motion.h1 {...fadeInUp}>ONLINE PERSONAL TRAINING FROM ANYWHERE</motion.h1>
        <div className="hero-full-img-container">
          <img src={heroGrayscale} alt="Training" className="hero-full-img" />
          <div className="coaching-form-overlay">
            <div className="coaching-form-card">
              <div className="coaching-tabs">
                <button 
                  className={`coaching-tab-btn ${coachingFormTab === 'inquiry' ? 'active' : ''}`}
                  onClick={() => { setCoachingFormTab('inquiry'); setCoachingMsg(''); setCoachingError(''); }}
                >
                  INQUIRY
                </button>
                <button 
                  className={`coaching-tab-btn ${coachingFormTab === 'login' ? 'active' : ''}`}
                  onClick={() => { setCoachingFormTab('login'); setCoachingMsg(''); setCoachingError(''); }}
                >
                  CLIENT LOGIN
                </button>
              </div>
              
              <div className="coaching-card-body">
                {coachingMsg && <div className="coaching-success-alert">{coachingMsg}</div>}
                {coachingError && <div className="coaching-error-alert">{coachingError}</div>}
                
                {coachingFormTab === 'inquiry' ? (
                  <form onSubmit={handleCoachingInquirySubmit} className="coaching-card-form">
                    <h3>GET A COACH</h3>
                    <p className="coaching-subtitle">Submit your details for a customized online training plan.</p>
                    
                    <div className="form-group-old">
                      <label>Full Name</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Your Name"
                        value={coachingInquiry.name} 
                        onChange={(e) => setCoachingInquiry({...coachingInquiry, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group-old">
                      <label>Email Address</label>
                      <input 
                        type="email" 
                        required 
                        placeholder="yourname@email.com"
                        value={coachingInquiry.email} 
                        onChange={(e) => setCoachingInquiry({...coachingInquiry, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group-old">
                      <label>Phone Number</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Contact number"
                        value={coachingInquiry.phone} 
                        onChange={(e) => setCoachingInquiry({...coachingInquiry, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group-old">
                      <label>Fitness Goal</label>
                      <select 
                        value={coachingInquiry.goal} 
                        onChange={(e) => setCoachingInquiry({...coachingInquiry, goal: e.target.value})}
                      >
                        <option>Muscle Building</option>
                        <option>Fat Loss & Tone</option>
                        <option>Cardio Endurance</option>
                        <option>Mobility & Flexibility</option>
                      </select>
                    </div>
                    
                    <div className="form-group-old">
                      <label>Message (Optional)</label>
                      <textarea 
                        placeholder="Tell us about your fitness history..."
                        value={coachingInquiry.message} 
                        onChange={(e) => setCoachingInquiry({...coachingInquiry, message: e.target.value})}
                        rows="2"
                        className="coaching-textarea"
                      />
                    </div>
                    
                    <button type="submit" className="btn-submit-old full-width">
                      SUBMIT REQUEST <ArrowRight size={18} />
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleCoachingLoginSubmit} className="coaching-card-form">
                    <h3>CLIENT PORTAL</h3>
                    <p className="coaching-subtitle">Log in to view your personalized training program.</p>
                    
                    <div className="form-group-old">
                      <label>Username</label>
                      <input 
                        type="text" 
                        required 
                        placeholder="Enter Username"
                        value={coachingLogin.username} 
                        onChange={(e) => setCoachingLogin({...coachingLogin, username: e.target.value})}
                      />
                    </div>
                    
                    <div className="form-group-old">
                      <label>Password</label>
                      <input 
                        type="password" 
                        required 
                        placeholder="Enter Password"
                        value={coachingLogin.password} 
                        onChange={(e) => setCoachingLogin({...coachingLogin, password: e.target.value})}
                      />
                    </div>
                    
                    <button type="submit" className="btn-submit-old full-width">
                      LOGIN TO PORTAL <ArrowRight size={18} />
                    </button>
                  </form>
                )}
              </div>
            </div>

            <div className="coaching-features-container">
              <div className="coaching-feature-box">
                <div className="coaching-feature-icon-wrapper">
                  <UserIcon size={24} />
                </div>
                <div className="coaching-feature-text">
                  <h4>Expert Coaching</h4>
                  <p>Our certified personal trainers are here to guide you step-by-step. We customize your training to match your pace, schedule, and lifestyle, making it easy to stay committed.</p>
                </div>
              </div>
              
              <div className="coaching-feature-box">
                <div className="coaching-feature-icon-wrapper">
                  <Trophy size={24} />
                </div>
                <div className="coaching-feature-text">
                  <h4>Guaranteed Results</h4>
                  <p>We combine science-backed workouts with customized nutrition plans. By tracking your progress weekly, we ensure every workout brings you closer to your fitness goals.</p>
                </div>
              </div>
              
              <div className="coaching-feature-box">
                <div className="coaching-feature-icon-wrapper">
                  <Activity size={24} />
                </div>
                <div className="coaching-feature-text">
                  <h4>Flexible & Interactive</h4>
                  <p>Train from anywhere, anytime. Our online client portal gives you 24/7 access to your personalized workout schedules, video guides, and direct chat support with your coach.</p>
                </div>
              </div>

              <div className="coaching-feature-box">
                <div className="coaching-feature-icon-wrapper">
                  <Dumbbell size={24} />
                </div>
                <div className="coaching-feature-text">
                  <h4>Custom Nutrition Plans</h4>
                  <p>Get tailored meal guidelines to fuel your workouts and accelerate recovery. Our nutrition templates ensure your diet works hand-in-hand with your training.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-neon">
        <div className="neon-shapes-container"><div className="neon-shape neon-green"></div><div className="neon-shape neon-purple"></div></div>
        <div className="neon-info-box n-top-left"><div className="info-icon"><Zap size={20} /></div><div className="info-content"><h4>CARDIO TIP</h4><p>Master stamina.</p><button className="btn-popup-tiny" onClick={() => setSelectedExercise('cardio')}>Learn More</button></div></div>
        <div className="neon-info-box n-top-right"><div className="info-icon"><Info size={20} /></div><div className="info-content"><h4>NUTRITION TIP</h4><p>Fuel gains.</p><button className="btn-popup-tiny" onClick={() => setSelectedExercise('nutrition')}>Learn More</button></div></div>
        <div className="neon-info-box n-left"><div className="info-icon"><Dumbbell size={20} /></div><div className="info-content"><h4>STRENGTH TIP</h4><p>Build power.</p><button className="btn-popup-tiny" onClick={() => setSelectedExercise('strength')}>Learn More</button></div></div>
        <div className="neon-info-box n-right"><div className="info-icon"><Activity size={20} /></div><div className="info-content"><h4>RECOVERY TIP</h4><p>Stay agile.</p><button className="btn-popup-tiny" onClick={() => setSelectedExercise('mobility')}>Learn More</button></div></div>
        <motion.img src={modelNeon} alt="Model" className="feature-model-img" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} />
      </section>

      <section className="cta-section" id="trial-signup">
        <div className="cta-bg-glow"></div>
        <div className="container">
          <motion.p className="cta-small" {...fadeInUp}>SIGNUP FOR</motion.p>
          <motion.h2 className="cta-heading" {...fadeInUp}>1 WEEK TRIAL</motion.h2>
          <motion.button className="btn-gradient" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => { setIsAuthOpen(true); setAuthMode('signup'); }}>SIGN UP NOW <ArrowRight size={24} /></motion.button>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col"><div className="footer-logo">BEAUTY AND BEAST <span className="pro-tag">GYM</span></div><p>We believe fitness should be fun and done on your own terms.</p></div>
            <div className="footer-col"><h4>CONTACT</h4><ul><li>help@beautyandbeast.com</li><li>0800 2236 791</li></ul></div>
            <div className="footer-col"><h4>QUICK LINKS</h4><ul><li>Terms</li><li>Privacy</li></ul></div>
          </div>
          <div className="footer-bottom"><p>Copyright by Beauty and Beast. All rights reserved.</p></div>
        </div>
      </footer>

      <AnimatePresence>
        {isAuthOpen && (
          <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
            <motion.div className="auth-modal-content" initial={{ x: "100%", opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: "100%", opacity: 0 }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setIsAuthOpen(false)}><X size={24} /></button>
              <div className="auth-header"><h2 className="logo-old">{authMode === 'login' ? 'LOGIN' : 'SIGN UP'}</h2></div>
              <div className="auth-body">
                {message && <div className="auth-message">{message}</div>}
                <form className="auth-form" onSubmit={handleAuthSubmit}>
                  {authMode === 'signup' && (
                    <>
                      <div className="form-row">
                        <div className="form-group-old"><label>FIRST NAME</label><input type="text" required value={authForm.firstName} onChange={(e) => setAuthForm({ ...authForm, firstName: e.target.value })} /></div>
                        <div className="form-group-old"><label>LAST NAME</label><input type="text" required value={authForm.lastName} onChange={(e) => setAuthForm({ ...authForm, lastName: e.target.value })} /></div>
                      </div>
                      <div className="form-row">
                        <div className="form-group-old"><label>AGE</label><input type="number" required value={authForm.age} onChange={(e) => setAuthForm({ ...authForm, age: e.target.value })} /></div>
                        <div className="form-group-old"><label>WEIGHT (KG)</label><input type="number" required value={authForm.weight} onChange={(e) => setAuthForm({ ...authForm, weight: e.target.value })} /></div>
                      </div>
                      <div className="form-row">
                        <div className="form-group-old"><label>PHONE NUMBER</label><input type="text" required value={authForm.phoneNumber} onChange={(e) => setAuthForm({ ...authForm, phoneNumber: e.target.value })} /></div>
                        <div className="form-group-old"><label>DATE OF BIRTH</label><input type="date" required value={authForm.birthDate} onChange={(e) => setAuthForm({ ...authForm, birthDate: e.target.value })} /></div>
                      </div>
                      <div className="form-group-old"><label>MEMBERSHIP PLAN</label><select value={authForm.membershipPlan} onChange={(e) => setAuthForm({ ...authForm, membershipPlan: e.target.value })}><option>ONE WEEK TRIAL</option><option>MONTHLY MEMBERSHIP</option><option>ANNUAL BEAST MODE</option></select></div>
                      <div className="form-group-old"><label>PROFILE IMAGE</label><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="file-input" /></div>
                    </>
                  )}
                  <div className="form-group-old"><label>USERNAME</label><input type="text" required value={authForm.username} onChange={(e) => setAuthForm({ ...authForm, username: e.target.value })} /></div>
                  <div className="form-group-old"><label>PASSWORD</label><input type="password" required value={authForm.password} onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })} /></div>
                  <button type="submit" className="btn-submit-old full-width">{authMode === 'login' ? 'LOGIN' : 'SUBMIT'}</button>
                  <button type="button" className="btn-switch-auth" onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setMessage(''); }}>{authMode === 'login' ? 'NEED AN ACCOUNT? SIGN UP' : 'ALREADY HAVE AN ACCOUNT? LOGIN'}</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isProfileOpen && user && (
          <div className="modal-overlay" onClick={() => setIsProfileOpen(false)}>
            <motion.div className="profile-modal-content" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setIsProfileOpen(false)}><X size={24} /></button>
              <div className="profile-header">
                <div className="profile-avatar">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="avatar-img" />
                  ) : (
                    <>{user.firstName[0]}{user.lastName[0]}</>
                  )}
                </div>
                <div className="profile-titles">
                  <h2>{user.firstName} {user.lastName}</h2>
                  <p>@{user.username}</p>
                  {isBirthday(user.birthDate) && (
                    <motion.div className="birthday-badge" animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity }}>
                      🎂 HAPPY BIRTHDAY!
                    </motion.div>
                  )}
                </div>
                <div className="profile-actions">
                  <button className="btn-edit-profile" onClick={() => { setEditMode(!editMode); setEditForm({ weight: user.weight, profileImage: user.profileImage }); }}>
                    {editMode ? 'CANCEL' : 'EDIT'}
                  </button>
                  <button className="btn-logout" onClick={handleLogout}><LogOut size={18} /> Logout</button>
                </div>
              </div>

              {editMode ? (
                <form className="edit-profile-form" onSubmit={handleUpdateProfile}>
                  <h3>EDIT PROFILE</h3>
                  <div className="form-group-old"><label>WEIGHT (KG)</label><input type="number" value={editForm.weight} onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })} /></div>
                  <div className="form-group-old"><label>PROFILE IMAGE</label><input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'edit')} /></div>
                  <button type="submit" className="btn-submit-old">SAVE CHANGES</button>
                </form>
              ) : (
                <>
                  <div className="profile-grid">
                    <div className="profile-card-item"><div className="card-item-icon"><Clock size={20} /></div><div className="card-item-data"><label>MEMBERSHIP</label><span>{user.membershipPlan}</span></div></div>
                    <div className="profile-card-item"><div className="card-item-icon"><Weight size={20} /></div><div className="card-item-data"><label>WEIGHT</label><span>{user.weight} KG</span></div></div>
                    <div className="profile-card-item"><div className="card-item-icon"><Activity size={20} /></div><div className="card-item-data"><label>AGE</label><span>{calculateAge(user.birthDate)} YRS</span></div></div>
                    <div className="profile-card-item"><div className="card-item-icon"><Zap size={20} /></div><div className="card-item-data"><label>REG. ID</label><span className="reg-id-badge">{user.registrationNumber || 'N/A'}</span></div></div>
                    <div className="profile-card-item"><div className="card-item-icon"><Calendar size={20} /></div><div className="card-item-data"><label>DAYS LEFT</label><span>{calculateDaysLeft(user.membershipEnd)} DAYS</span></div></div>
                  </div>
                  <div className="membership-progress">
                    <div className="progress-label"><span>Membership Status</span><span>{calculateDaysLeft(user.membershipEnd)} days remaining</span></div>
                    <div className="progress-bar-container"><motion.div className="progress-bar-fill" initial={{ width: 0 }} animate={{ width: `${Math.min(100, (calculateDaysLeft(user.membershipEnd) / 30) * 100)}%` }}></motion.div></div>
                  </div>
                </>
              )}
              <div className="attendance-section">
                <div className="attendance-header"><h3><CheckCircle size={20} color="#c6f531" /> Attendance Register</h3></div>
                <div className="attendance-stats">
                  <div className="stat-box"><span className="stat-val">{user.attendance?.length || 0}</span><span className="stat-label">Days Present</span></div>
                  <div className="stat-box"><span className="stat-val">{Math.max(0, 30 - (user.attendance?.length || 0))}</span><span className="stat-label">Days Absent (Est)</span></div>
                </div>
                <div className="attendance-history">
                  {user.attendance?.slice(-5).reverse().map((a, i) => (
                    <div key={i} className="history-item">
                      <div className="history-info">
                        <span className="history-date">{a.date}</span>
                        <span className="history-time">{a.time || '--:--'}</span>
                      </div>
                      <span className="status-present">PRESENT</span>
                    </div>
                  ))}
                  {!user.attendance?.length && <p className="no-data">No attendance records yet.</p>}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAttendanceOpen && (
          <div className="modal-overlay" onClick={() => setIsAttendanceOpen(false)}>
            <motion.div className="attendance-modal-content" initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setIsAttendanceOpen(false)}><X size={24} /></button>
              <div className="attendance-modal-header">
                <h2>{isRecoveryMode ? 'ATTENDANCE CORRECTION' : 'MARK ATTENDANCE'}</h2>
                <p>{isRecoveryMode ? 'Find your registration number' : 'Enter your 3-digit registration number'}</p>
              </div>

              <div className="attendance-modal-body">
                {attendanceMessage && (
                  <motion.div className="attendance-success-msg" initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
                    <CheckCircle size={24} /> {attendanceMessage}
                  </motion.div>
                )}

                {!isRecoveryMode ? (
                  <form onSubmit={handleAttendanceByReg} className="reg-num-form">
                    <input
                      type="text"
                      placeholder="e.g. 123"
                      maxLength="3"
                      required
                      className="reg-input-large"
                      value={regNumInput}
                      onChange={(e) => setRegNumInput(e.target.value.replace(/\D/g, ''))}
                    />
                    <button type="submit" className="btn-submit-old">MARK PRESENT</button>
                    <button type="button" className="btn-forgot-reg" onClick={() => { setIsRecoveryMode(true); setRecoveryInfo(null); setAttendanceMessage(''); }}>
                      Forgot Registration Number?
                    </button>
                  </form>
                ) : (
                  <div className="recovery-section">
                    {recoveryInfo ? (
                      <motion.div className="recovery-result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <p>Welcome back, <strong>{recoveryInfo.firstName} {recoveryInfo.lastName}</strong>!</p>
                        <div className="reg-display-box">
                          <label>YOUR REGISTRATION NUMBER</label>
                          <span>{recoveryInfo.registrationNumber}</span>
                        </div>
                        <button className="btn-submit-old" onClick={() => { setIsRecoveryMode(false); setRegNumInput(recoveryInfo.registrationNumber); setRecoveryInfo(null); }}>
                          CONTINUE TO ATTENDANCE
                        </button>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleRecoverRegNum} className="recovery-form">
                        <div className="form-group-old">
                          <label>ENTER PHONE NUMBER</label>
                          <input
                            type="text"
                            required
                            placeholder="Your registered phone number"
                            value={recoveryPhone}
                            onChange={(e) => setRecoveryPhone(e.target.value)}
                          />
                        </div>
                        <button type="submit" className="btn-submit-old">FIND REG. NUMBER</button>
                        <button type="button" className="btn-switch-auth" onClick={() => setIsRecoveryMode(false)}>
                          BACK TO ATTENDANCE
                        </button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAdminDashboardOpen && (
          <div className="modal-overlay" onClick={() => setIsAdminDashboardOpen(false)}>
            <motion.div className="admin-modal-content" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setIsAdminDashboardOpen(false)}><X size={24} /></button>
              <div className="admin-header">
                <h2>ADMIN DASHBOARD</h2>
                <div className="admin-stats-summary">
                  <div className="a-stat"><span>{adminData.users.length}</span><label>TOTAL MEMBERS</label></div>
                  <div className="a-stat"><span>{adminData.attendance.filter(u => u.attendance.some(a => a.date === new Date().toISOString().split('T')[0])).length}</span><label>PRESENT TODAY</label></div>
                </div>
              </div>

              <div className="admin-tabs">
                <div className="admin-table-container">
                  <h3>MEMBERS ATTENDANCE</h3>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>REG. ID</th>
                        <th>NAME</th>
                        <th>TOTAL DAYS</th>
                        <th>LAST ATTENDED</th>
                        <th>STATUS</th>
                        <th>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {adminData.attendance.map((u, i) => {
                        const lastAtt = u.attendance.length > 0 ? u.attendance[u.attendance.length - 1].date : 'Never';
                        const isPresentToday = u.attendance.some(a => a.date === new Date().toISOString().split('T')[0]);
                        return (
                          <tr key={i}>
                            <td><span className="reg-badge-small">{u.registrationNumber}</span></td>
                            <td>{u.firstName} {u.lastName} {u.role === 'admin' && <span className="pro-tag" style={{ fontSize: '0.6rem', marginLeft: '5px' }}>ADMIN</span>}</td>
                            <td>{u.attendance.length}</td>
                            <td>{lastAtt}</td>
                            <td>
                              <span className={isPresentToday ? 'status-pill present' : 'status-pill absent'}>
                                {isPresentToday ? 'PRESENT' : 'ABSENT'}
                              </span>
                            </td>
                            <td>
                              {u.role !== 'admin' ? (
                                <button className="btn-popup-tiny" style={{ background: '#c6f531', color: '#000' }} onClick={() => handleMakeAdmin(u._id)}>
                                  MAKE ADMIN
                                </button>
                              ) : (
                                <span style={{ fontSize: '0.8rem', color: '#888' }}>Admin</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedExercise && (
          <div className="modal-overlay" onClick={() => setSelectedExercise(null)}>
            <motion.div className="modal-content" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedExercise(null)}><X size={24} /></button>
              <h3>{exerciseKnowledge[selectedExercise].title}</h3>
              <p>{exerciseKnowledge[selectedExercise].text}</p>
              <button className="btn-close-modal" onClick={() => setSelectedExercise(null)}>GOT IT</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedZone && (
          <div className="modal-overlay" onClick={() => setSelectedZone(null)}>
            <motion.div className="modal-content zone-modal-content" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setSelectedZone(null)}><X size={24} /></button>
              <h3 className="zone-modal-title" style={{ color: 'var(--accent-green)', marginBottom: '15px' }}>{zoneDetailsData[selectedZone].title}</h3>
              <p className="zone-modal-desc" style={{ fontSize: '14px', lineHeight: '1.6', color: '#ccc', marginBottom: '20px' }}>{zoneDetailsData[selectedZone].description}</p>
              <div className="zone-features-section" style={{ textAlign: 'left', marginBottom: '25px' }}>
                <h4 style={{ fontSize: '12px', color: 'var(--primary-purple)', letterSpacing: '1px', marginBottom: '10px' }}>KEY FEATURES:</h4>
                <ul className="zone-features-list" style={{ listStyleType: 'square', paddingLeft: '20px', color: '#aaa', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {zoneDetailsData[selectedZone].features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
              <button className="btn-submit-old full-width" onClick={() => setSelectedZone(null)}>CLOSE</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
