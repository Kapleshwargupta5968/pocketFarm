import { NavLink } from 'react-router-dom';
import LandingLayout from '../../components/layout/LandingLayout';
import smartFarmHero from '../../assets/smart_farm_hero.png';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <LandingLayout>
      <div className="font-['Outfit',sans-serif] text-slate-800 overflow-x-hidden bg-slate-50">
        
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-8 py-24 bg-[radial-gradient(circle_at_top_right,_#e0f2fe_0%,_#f0fdf4_40%,_#ffffff_100%)] overflow-hidden">
          {/* Background Shapes */}
          <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-gradient-to-br from-emerald-200 to-emerald-400 rounded-full blur-[80px] opacity-40 animate-float-slow"></div>
            <div className="absolute bottom-[10%] -left-[10%] w-[400px] h-[400px] bg-gradient-to-br from-blue-200 to-blue-400 rounded-full blur-[80px] opacity-30 animate-float-slow-reverse"></div>
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center max-w-7xl mx-auto text-center lg:text-left gap-16 w-full">
            
            {/* Text Content */}
            <motion.div 
              initial={{opacity: 0, y: 30}} 
              animate={{opacity: 1, y: 0}} 
              transition={{duration: 0.8, ease: "easeOut"}}
              className="flex-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/70 border border-white/40 backdrop-blur-md rounded-full text-emerald-700 font-semibold text-sm mb-8 shadow-sm">
                <span className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_0_0_rgba(16,185,129,0.7)] animate-pulse"></span>
                Smart Farm Management
              </div>
              
              <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-6 bg-gradient-to-br from-emerald-800 via-emerald-600 to-sky-500 text-transparent bg-clip-text">
                Your Personal Farm,<br /> Right in Your Pocket
              </h1>
              
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Manage plots, track crops, handle subscriptions and payments — all from one premium dashboard.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <NavLink to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl font-semibold text-lg shadow-[0_10px_15px_-3px_rgba(16,185,129,0.4)] hover:-translate-y-1 hover:shadow-[0_20px_25px_-5px_rgba(16,185,129,0.5)] transition-all duration-300">
                  Get Started Free
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </NavLink>
                <NavLink to="/signin" className="inline-flex items-center justify-center px-8 py-4 bg-white/80 backdrop-blur-md border border-slate-200/50 text-emerald-700 rounded-2xl font-semibold text-lg shadow-sm hover:-translate-y-1 hover:bg-white hover:shadow-md transition-all duration-300">
                  Login to Dashboard
                </NavLink>
              </div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div 
              initial={{opacity: 0, scale: 0.9}} 
              animate={{opacity: 1, scale: 1}} 
              transition={{duration: 0.8, delay: 0.2, ease: "easeOut"}}
              className="flex-1 flex justify-center items-center relative mt-12 lg:mt-0 w-full"
            >
              <div className="relative w-full max-w-[500px] animate-float z-10">
                <img src={smartFarmHero} alt="Smart Farm Illustration" className="w-full h-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.15)] rounded-3xl" />
                
                {/* Floating Card 1 */}
                <div className="absolute bottom-8 -left-8 bg-white/85 backdrop-blur-lg border border-white/60 p-4 rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-4 z-20 animate-[var(--animate-float-card-1)] w-max">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-emerald-100 text-emerald-600">🌱</div>
                  <div>
                    <h4 className="m-0 text-base text-slate-900 font-bold leading-tight">Active Plots</h4>
                    <p className="m-0 text-sm text-slate-500 font-medium">+24% this month</p>
                  </div>
                </div>
                
                {/* Floating Card 2 */}
                <div className="absolute top-12 -right-4 bg-white/85 backdrop-blur-lg border border-white/60 p-4 rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)] flex items-center gap-4 z-20 animate-[var(--animate-float-card-2)] w-max">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-blue-100 text-blue-600">💧</div>
                  <div>
                    <h4 className="m-0 text-base text-slate-900 font-bold leading-tight">Smart Irrigation</h4>
                    <p className="m-0 text-sm text-slate-500 font-medium">Optimal Levels</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </section>

        {/* Features Section */}
        <section className="px-8 py-32 bg-white relative z-20 overflow-hidden">
          <motion.div 
            initial={{opacity: 0, y: 40}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-100px"}}
            transition={{duration: 0.6}}
            className="text-center mb-20"
          >
            <span className="inline-block text-emerald-600 font-bold uppercase tracking-widest mb-4 text-sm bg-emerald-50 px-4 py-2 rounded-full">Features</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Why PocketFarm?</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Everything you need to manage your farm efficiently in a unified suite.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <motion.div 
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, delay: 0.1}}
              className="group relative bg-white border border-slate-100 rounded-3xl p-10 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:border-transparent transition-all duration-300 overflow-hidden z-10"
            >
              {/* Top Gradient Border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 z-20"></div>
              {/* Background gradient hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl mb-6 shadow-[0_4px_6px_-1px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:rotate-6 group-hover:bg-emerald-100 transition-transform duration-300">🌍</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Manage Plots</h3>
              <p className="text-slate-600 leading-relaxed">Create, edit and monitor all your farm plots in real time with our powerful visual tools and data insights.</p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, delay: 0.2}}
              className="group relative bg-white border border-slate-100 rounded-3xl p-10 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:border-transparent transition-all duration-300 overflow-hidden z-10"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 z-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl mb-6 shadow-[0_4px_6px_-1px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:rotate-6 group-hover:bg-emerald-100 transition-transform duration-300">📅</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Subscriptions</h3>
              <p className="text-slate-600 leading-relaxed">Let subscribers book your plots effortlessly. Manage flexible subscription plans and boost your revenue.</p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              initial={{opacity: 0, y: 30}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{duration: 0.5, delay: 0.3}}
              className="group relative bg-white border border-slate-100 rounded-3xl p-10 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),_0_10px_10px_-5px_rgba(0,0,0,0.04)] hover:border-transparent transition-all duration-300 overflow-hidden z-10"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 z-20"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-3xl mb-6 shadow-[0_4px_6px_-1px_rgba(16,185,129,0.1)] group-hover:scale-110 group-hover:rotate-6 group-hover:bg-emerald-100 transition-transform duration-300">💳</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Seamless Payments</h3>
              <p className="text-slate-600 leading-relaxed">Collect payments online securely. Integrated with top tier payment gateways like Razorpay for instant settlements.</p>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="px-8 py-32 bg-slate-50 relative z-10 overflow-hidden">
          <motion.div 
            initial={{opacity: 0, y: 40}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true, margin: "-100px"}}
            transition={{duration: 0.6}}
            className="text-center mb-20"
          >
            <span className="inline-block text-emerald-600 font-bold uppercase tracking-widest mb-4 text-sm bg-emerald-100 px-4 py-2 rounded-full">Onboarding</span>
            <h2 className="text-4xl font-extrabold text-slate-900 mb-4">How It Works</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">Get started in minutes. No complicated setup — just sign up and start managing your farm instantly.</p>
          </motion.div>
          
          <div className="max-w-5xl mx-auto space-y-16 lg:space-y-24">
            {/* Step 1 */}
            <motion.div 
               initial={{opacity: 0, x: -50}}
               whileInView={{opacity: 1, x: 0}}
               viewport={{once: true}}
               transition={{duration: 0.6}}
               className="flex flex-col md:flex-row items-center gap-8 lg:gap-16"
            >
              <div className="flex-1 w-full">
                <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-[0_25px_50px_-12px_rgba(16,185,129,0.25)] flex items-center justify-center text-7xl text-white">
                  📝
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-emerald-600 font-extrabold text-2xl mb-6 shadow-md border border-slate-100">1</div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Create an Account</h3>
                <p className="text-lg text-slate-600 leading-relaxed">Sign up rapidly as a Farmer to list your plots, or as a Subscriber to browse and book available farm plots in your preferred location.</p>
              </div>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
               initial={{opacity: 0, x: 50}}
               whileInView={{opacity: 1, x: 0}}
               viewport={{once: true}}
               transition={{duration: 0.6}}
               className="flex flex-col md:flex-row-reverse items-center gap-8 lg:gap-16"
            >
              <div className="flex-1 w-full">
                <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_25px_50px_-12px_rgba(59,130,246,0.25)] flex items-center justify-center text-7xl text-white">
                  🌾
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-emerald-600 font-extrabold text-2xl mb-6 shadow-md border border-slate-100">2</div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Set Up Your Plots</h3>
                <p className="text-lg text-slate-600 leading-relaxed">Farmers can add rich details to their plots including size, location, and crop type. Everything looks beautiful on your personalized dashboard.</p>
              </div>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
               initial={{opacity: 0, x: -50}}
               whileInView={{opacity: 1, x: 0}}
               viewport={{once: true}}
               transition={{duration: 0.6}}
               className="flex flex-col md:flex-row items-center gap-8 lg:gap-16"
            >
              <div className="flex-1 w-full">
                <div className="w-full aspect-[4/3] rounded-3xl bg-gradient-to-br from-amber-500 to-amber-700 shadow-[0_25px_50px_-12px_rgba(245,158,11,0.25)] flex items-center justify-center text-7xl text-white">
                  📈
                </div>
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white text-emerald-600 font-extrabold text-2xl mb-6 shadow-md border border-slate-100">3</div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Manage & Earn</h3>
                <p className="text-lg text-slate-600 leading-relaxed">Subscribers book plots quickly. Payments are processed immediately securely via Razorpay, while farmers track their earnings seamlessly.</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-32 bg-gradient-to-br from-emerald-900 to-emerald-700 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '40px 40px', zIndex: 0}}></div>
          <motion.div 
            initial={{opacity: 0, scale: 0.95}}
            whileInView={{opacity: 1, scale: 1}}
            viewport={{once: true}}
            transition={{duration: 0.6}}
            className="relative z-10 max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Ready to Grow Smarter?</h2>
            <p className="text-xl text-emerald-100 mb-12">Join hundreds of modern farmers and subscribers already leveraging PocketFarm.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <NavLink to="/signup" className="inline-flex items-center justify-center px-10 py-4 bg-white text-emerald-800 rounded-2xl font-bold text-lg shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)] hover:-translate-y-1 hover:scale-105 hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)] transition-all duration-300">
                Get Started Free
              </NavLink>
              <NavLink to="/signin" className="inline-flex items-center justify-center px-10 py-4 bg-transparent border-2 border-white/50 text-white rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white transition-all duration-300">
                Sign In
              </NavLink>
            </div>
          </motion.div>
        </section>
        
      </div>
    </LandingLayout>
  );
};

export default Home;
