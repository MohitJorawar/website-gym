import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Trophy, Zap, Target, Dumbbell, Activity, Info, X } from 'lucide-react';
import './App.css';

// Import images
import heroImg from './assets/hero.png';
import logoImg from './assets/logo.jpg';
import heroGrayscale from './assets/hero_grayscale.png';
import modelNeon from './assets/model_neon.png';
import workout1 from './assets/workout_1.png';
import workout2 from './assets/workout_2.png';
import workout3 from './assets/workout_3.png';
import workout4 from './assets/workout_4.png';

function App() {
  const [selectedExercise, setSelectedExercise] = React.useState(null);
  const [isAuthOpen, setIsAuthOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState('login'); // 'login' or 'signup'

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
          <button onClick={() => { setIsAuthOpen(true); setAuthMode('login'); }} className="nav-login-btn">LOGIN</button>
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
          {/* New icons at the sides */}
          <motion.div className="decor-icon side-left-1" animate={{ x: [-10, 10, -10] }} transition={{ duration: 7, repeat: Infinity }}><Zap size={150} /></motion.div>
          <motion.div className="decor-icon side-left-2" animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity }}><Dumbbell size={130} /></motion.div>
          <motion.div className="decor-icon side-right-1" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }}><Activity size={160} /></motion.div>
          <motion.div className="decor-icon side-right-2" animate={{ y: [-20, 20, -20] }} transition={{ duration: 6, repeat: Infinity }}><Target size={140} /></motion.div>
          
        </div>

        {/* Extra Background Info Boxes moved out of decor-icons for hover effects */}
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
            {/* Left Side Features */}
            <motion.div
              className="hero-left-old"
              variants={stagger}
              initial="initial"
              animate="animate"
            >
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

            {/* Center Image */}
            <motion.div
              className="hero-center-old"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="hero-glow-old"></div>
              <div className="hero-glow-purple-old"></div>
              
              {/* Info Boxes around image */}
              <div className="hero-info-box top-left">
                <div className="info-icon"><Zap size={20} /></div>
                <div className="info-content">
                  <h4>FAST PACE</h4>
                  <p>High intensity interval training to boost metabolism.</p>
                </div>
              </div>

              <div className="hero-info-box top-right">
                <div className="info-icon"><Target size={20} /></div>
                <div className="info-content">
                  <h4>PRECISE</h4>
                  <p>Scientifically backed programs for targeted results.</p>
                </div>
              </div>

              <div className="hero-info-box bottom-left">
                <div className="info-icon"><Activity size={20} /></div>
                <div className="info-content">
                  <h4>VITALITY</h4>
                  <p>Improve your daily energy levels and longevity.</p>
                </div>
              </div>

              <div className="hero-info-box bottom-right">
                <div className="info-icon"><Trophy size={20} /></div>
                <div className="info-content">
                  <h4>WINNER</h4>
                  <p>Join a community that celebrates every milestone.</p>
                </div>
              </div>

              <img src={heroImg} alt="Fitness Professional" className="hero-image-old" />
            </motion.div>

            {/* Right Side Content */}
            <motion.div
              className="hero-right-old"
              variants={fadeInUp}
              initial="initial"
              animate="animate"
            >
              <h1 className="hero-title-old">
                BUILD YOUR HEALTH<br />
                BUILD YOUR BODY
              </h1>
              <p className="hero-p-old">
                Are you ready to start taking your fitness to another level? Beauty and Beast GYM gets you results with guided workouts anytime, anywhere.
              </p>
              <button className="btn-trial-old hero-cta-old">
                1 WEEK TRIAL <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section" id="about">
        <div className="container">
          <motion.h2 
            className="about-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            About BEAUTY AND BEAST GYM
          </motion.h2>
          
          <div className="about-content">
            <motion.p 
              className="about-p"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              At Beauty and Beast GYM, we believe in the perfect balance of aesthetics and raw power. 
              Our facility is designed for those who want to sculpt their physique while building 
              unstoppable strength. Whether you're here to tone up or bulk up, our expert trainers 
              and state-of-the-art equipment provide everything you need to reach your peak performance.
              We've created a community where beginners become beasts and every milestone is celebrated.
            </motion.p>
          </div>

          {/* Sliding Carousel */}
          <div className="carousel-container">
            <motion.div 
              className="carousel-track"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="carousel-item">
                  <div className="placeholder-img">
                    <Dumbbell size={40} opacity={0.3} />
                    <span>GYM MOMENT {i}</span>
                  </div>
                </div>
              ))}
              {/* Duplicate for seamless loop */}
              {[1,2,3,4,5,6].map((i) => (
                <div key={i+6} className="carousel-item">
                  <div className="placeholder-img">
                    <Activity size={40} opacity={0.3} />
                    <span>GYM MOMENT {i}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image Gallery Grid */}
          <div className="gallery-grid">
            <div className="gallery-item large">
              <div className="placeholder-img"><Trophy size={60} opacity={0.2} /><span>MAIN HALL</span></div>
            </div>
            <div className="gallery-item">
              <div className="placeholder-img"><Zap size={40} opacity={0.2} /><span>CARDIO ZONE</span></div>
            </div>
            <div className="gallery-item">
              <div className="placeholder-img"><Target size={40} opacity={0.2} /><span>FREE WEIGHTS</span></div>
            </div>
            <div className="gallery-item wide">
              <div className="placeholder-img"><Activity size={50} opacity={0.2} /><span>GROUP CLASSES</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* ORIGINAL SIGNUP SECTION */}
      <section className="signup-old" id="get-started">
        <div className="container">
          <motion.h2
            className="signup-h2-old"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            BUILD YOUR HEALTH BUILD YOUR BODY
          </motion.h2>

          <div className="signup-form-old">
            <div className="form-group-old">
              <label>ACCOUNT TYPE</label>
              <select defaultValue="one-week">
                <option value="one-week">One week trial: $1</option>
                <option value="monthly">Monthly Membership: $45.95</option>
              </select>
            </div>

            <div className="form-group-old">
              <label>EMAIL</label>
              <input type="email" placeholder="Email" />
            </div>

            <div className="form-group-old">
              <label>USERNAME</label>
              <input type="text" placeholder="Username" />
            </div>

            <div className="form-group-old">
              <label>PASSWORD</label>
              <input type="password" placeholder="Password" />
            </div>

            <button className="btn-submit-old">
              Submit <ArrowRight size={18} />
            </button>
          </div>

          <p className="footer-text-old">
            All memberships and plans automatically renew for a recurring monthly fee of <span>$45.95</span> unless canceled. 
            Members are free to cancel at any time. By clicking the "Submit" button, you agree to the Terms & Conditions and Privacy Policy.
          </p>
        </div>
      </section>

      {/* NEW FUNFITNESSPRO SECTIONS */}
      {/* SECTION 1: FULL WIDTH TITLE + IMAGE */}
      <section className="hero-full" id="coaching">
        <div className="hero-full-decor"></div>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          ONLINE PERSONAL TRAINING FROM ANYWHERE
        </motion.h1>
        <div className="hero-full-img-container">
          <img src={heroGrayscale} alt="Training anywhere" className="hero-full-img" />
        </div>
      </section>

      {/* SECTION 2: FEATURE IMAGE WITH NEON OUTLINE */}
      <section className="feature-neon">
        <div className="neon-shapes-container">
          <motion.div
            className="neon-shape neon-green"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          ></motion.div>
          <motion.div
            className="neon-shape neon-purple"
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
          ></motion.div>
        </div>

        {/* Info Boxes with Popup Buttons */}
        <div className="neon-info-box n-top-left">
          <div className="info-icon"><Zap size={20} /></div>
          <div className="info-content">
            <h4>CARDIO TIP</h4>
            <p>Master your stamina.</p>
            <button className="btn-popup-tiny" onClick={() => setSelectedExercise('cardio')}>Learn More</button>
          </div>
        </div>

        <div className="neon-info-box n-top-right">
          <div className="info-icon"><Info size={20} /></div>
          <div className="info-content">
            <h4>NUTRITION TIP</h4>
            <p>Fuel your gains.</p>
            <button className="btn-popup-tiny" onClick={() => setSelectedExercise('nutrition')}>Learn More</button>
          </div>
        </div>

        <div className="neon-info-box n-left">
          <div className="info-icon"><Dumbbell size={20} /></div>
          <div className="info-content">
            <h4>STRENGTH TIP</h4>
            <p>Build real power.</p>
            <button className="btn-popup-tiny" onClick={() => setSelectedExercise('strength')}>Learn More</button>
          </div>
        </div>

        <div className="neon-info-box n-right">
          <div className="info-icon"><Activity size={20} /></div>
          <div className="info-content">
            <h4>RECOVERY TIP</h4>
            <p>Stay agile.</p>
            <button className="btn-popup-tiny" onClick={() => setSelectedExercise('mobility')}>Learn More</button>
          </div>
        </div>

        <motion.img
          src={modelNeon}
          alt="Fitness Model"
          className="feature-model-img"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        />
      </section>

      {/* SECTION 3: CTA (SIGNUP) */}
      <section className="cta-section" id="trial-signup">
        <div className="cta-bg-glow"></div>
        <div className="container">
          <motion.p className="cta-small" {...fadeInUp}>SIGNUP FOR</motion.p>
          <motion.h2 className="cta-heading" {...fadeInUp}>1 WEEK TRIAL</motion.h2>
          <motion.button
            className="btn-gradient"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            SIGN UP NOW <ArrowRight size={24} />
          </motion.button>
        </div>
      </section>

      {/* SECTION 4: WORKOUT CARDS GRID */}
      <section className="workout-grid-section" id="workouts">
        <div className="workout-decor"></div>
        <div className="container">
          <motion.h2 
            className="workout-main-heading"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            OUR ELITE WORKOUTS
          </motion.h2>
          <div className="workout-grid">
            {/* Card 1 */}
            <motion.div className="workout-card card-1" {...fadeInUp}>
              <div className="card-image">
                <img src={workout1} alt="Fat Loss" />
              </div>
              <div className="card-content">
                <h3>FAT LOSS AND TONING</h3>
                <p>Get workouts that help shed excess fat and tone muscles</p>
                <button className="btn-purple">START NOW</button>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div className="workout-card card-2" {...fadeInUp} transition={{ delay: 0.2 }}>
              <div className="card-image">
                <img src={workout2} alt="Strength Training" />
              </div>
              <div className="card-content">
                <h3>STRENGTH TRAINING</h3>
                <p>See the gains you’re looking for with our muscle pumping series</p>
                <button className="btn-purple">START NOW</button>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div className="workout-card card-3" {...fadeInUp}>
              <div className="card-image">
                <img src={workout3} alt="Flexibility" />
              </div>
              <div className="card-content">
                <h3>FLEXIBILITY EXERCISES</h3>
                <p>Increase agility with guided workouts for greater flexibility</p>
                <button className="btn-purple">START NOW</button>
              </div>
            </motion.div>

            {/* Card 4 */}
            <motion.div className="workout-card card-4" {...fadeInUp} transition={{ delay: 0.2 }}>
              <div className="card-image">
                <img src={workout4} alt="Every Goal" />
              </div>
              <div className="card-content">
                <h3>WORKOUTS FOR EVERY GOAL</h3>
                <p>Our exercise plans cater to every body & fitness goal</p>
                <button className="btn-purple">SEE THEM ALL</button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 5: FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">
                BEAUTY AND BEAST <span className="pro-tag">GYM</span>
              </div>
              <p className="footer-desc">
                We believe fitness should be fun and done on your own terms. That’s why we created guided training workout videos that can be done from anywhere. Take us to the gym or workout from home.
              </p>
            </div>

            <div className="footer-col">
              <h4>CONTACT</h4>
              <ul>
                <li>help@beautyandbeast.com</li>
                <li>0800 2236 791</li>
                <li>Beauty and Beast Gym<br />254 E 56th Street Apt C10<br />Brooklyn, NY, 11203, US</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>QUICK LINKS</h4>
              <ul>
                <li>Terms</li>
                <li>Privacy</li>
                <li>Support</li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>MENU</h4>
              <ul>
                <li>About</li>
                <li>Workouts</li>
                <li>Sign Up</li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>Copyright by Beauty and Beast. All rights reserved.</p>
          </div>
        </div>
      </footer>
      {/* AUTH MODAL (LOGIN/SIGNUP) */}
      <AnimatePresence>
        {isAuthOpen && (
          <div className="modal-overlay" onClick={() => setIsAuthOpen(false)}>
            <motion.div 
              className="auth-modal-content"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setIsAuthOpen(false)}>
                <X size={24} />
              </button>

              <div className="auth-header">
                <h2 className="logo-old">
                  {authMode === 'login' ? 'LOGIN' : 'SIGN UP'}
                </h2>
              </div>

              <div className="auth-body">
                <AnimatePresence mode="wait">
                  {authMode === 'login' ? (
                    <motion.form 
                      key="login"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="auth-form"
                    >
                      <div className="form-group-old">
                        <label>USERNAME</label>
                        <input type="text" placeholder="Username" />
                      </div>
                      <div className="form-group-old">
                        <label>PASSWORD</label>
                        <input type="password" placeholder="Password" />
                      </div>
                      <div className="auth-actions">
                        <button type="submit" className="btn-submit-old">LOGIN</button>
                        <button type="button" className="btn-switch-auth" onClick={() => setAuthMode('signup')}>SIGN IN</button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.form 
                      key="signup"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="auth-form scrollable-form"
                    >
                      <div className="form-row">
                        <div className="form-group-old">
                          <label>FIRST NAME</label>
                          <input type="text" placeholder="First Name" />
                        </div>
                        <div className="form-group-old">
                          <label>LAST NAME</label>
                          <input type="text" placeholder="Last Name" />
                        </div>
                      </div>
                      <div className="form-row">
                        <div className="form-group-old">
                          <label>AGE</label>
                          <input type="number" placeholder="Age" />
                        </div>
                        <div className="form-group-old">
                          <label>WEIGHT (KG)</label>
                          <input type="number" placeholder="Weight" />
                        </div>
                      </div>
                      <div className="form-group-old">
                        <label>MEMBERSHIP PLAN</label>
                        <select>
                          <option>ONE WEEK TRIAL</option>
                          <option>MONTHLY MEMBERSHIP</option>
                          <option>ANNUAL BEAST MODE</option>
                        </select>
                      </div>
                      <div className="form-group-old">
                        <label>PROFILE IMAGE</label>
                        <input type="file" className="file-input" />
                      </div>
                      <div className="form-group-old">
                        <label>USERNAME</label>
                        <input type="text" placeholder="Username" />
                      </div>
                      <div className="form-group-old">
                        <label>PASSWORD</label>
                        <input type="password" placeholder="Password" />
                      </div>
                      <button type="submit" className="btn-submit-old full-width">SUBMIT</button>
                      <button type="button" className="btn-switch-auth" onClick={() => setAuthMode('login')}>ALREADY HAVE AN ACCOUNT? LOGIN</button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EXERCISE MODAL POPUP */}
      <AnimatePresence>
        {selectedExercise && (
          <div className="modal-overlay" onClick={() => setSelectedExercise(null)}>
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="modal-close" onClick={() => setSelectedExercise(null)}>
                <X size={24} />
              </button>
              <h3>{exerciseKnowledge[selectedExercise].title}</h3>
              <p>{exerciseKnowledge[selectedExercise].text}</p>
              <button className="btn-close-modal" onClick={() => setSelectedExercise(null)}>GOT IT</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
