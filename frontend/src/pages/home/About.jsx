import { NavLink } from 'react-router-dom';
import LandingLayout from '../../components/layout/LandingLayout';
import AnimatedCounter from '../../components/shared/AnimatedCounter';
import { motion, AnimatePresence } from 'framer-motion';

const About = () => {
  const team = [
    {
      name: "Arjun Sharma",
      role: "Founder & Farmer",
      emoji: "👨‍🌾",
      bio: "A third-generation farmer who wanted to bring technology to agriculture.",
    },
    {
      name: "Priya Patel",
      role: "Lead Developer",
      emoji: "👩‍💻",
      bio: "Full-stack engineer passionate about building tools that make a real difference.",
    },
    {
      name: "Ravi Kumar",
      role: "Operations & Growth",
      emoji: "📊",
      bio: "Helps farmers and subscribers get the most out of PocketFarm every day.",
    },
  ];

  const stats = [
    { target: 500,  suffix: "+",  label: "Farmers Registered" },
    { target: 1200, suffix: "+",  label: "Plots Listed" },
    { target: 3000, suffix: "+",  label: "Subscribers" },
    { target: 50,   suffix: "L+", label: "Earnings Facilitated", prefix: "₹" },
  ];

  const values = [
    {
      icon: "🌿",
      title: "Sustainability",
      desc: "We believe in farming practices that respect the earth and create long-term value for communities.",
    },
    {
      icon: "🤝",
      title: "Trust",
      desc: "Every transaction and interaction on PocketFarm is built on transparency and accountability.",
    },
    {
      icon: "💡",
      title: "Innovation",
      desc: "We bring modern technology to agriculture so farmers spend less time on admin and more time farming.",
    },
    {
      icon: "🌍",
      title: "Community",
      desc: "We connect farmers and subscribers to build a thriving local food ecosystem.",
    },
  ];

  return (
    <LandingLayout>
      <AnimatePresence mode="wait">
        <motion.div
          key="about-page"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 pt-32 pb-24 px-6 text-center text-white isolate">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full mix-blend-screen filter blur-[100px] opacity-70 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }} />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="relative z-10 max-w-5xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-semibold px-5 py-2 rounded-full mb-8 backdrop-blur-md shadow-lg shadow-emerald-500/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Our Story
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            We're Building the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 inline-block animate-fade-in-up" style={{ animationDelay: '100ms' }}>
              Future of Farming
            </span>
          </h1>
          <p className="text-slate-400 text-xl md:text-2xl max-w-3xl mx-auto mb-12 font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            PocketFarm was born from a simple idea — every farmer deserves smart tools,
            and every family deserves access to fresh local produce.
          </p>
          <div className="flex justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <NavLink
              to="/signup"
              className="btn-primary text-lg !py-3 !px-10 shadow-emerald-500/30"
            >
              Join Us Today
            </NavLink>
          </div>
        </motion.div>
      </section>

      {/* Mission */}
      <section className="py-24 px-6 bg-slate-50 relative overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-full h-full bg-gradient-to-b from-blue-50/50 to-transparent rounded-full rotate-45 pointer-events-none filter blur-3xl opacity-60" />
        
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <motion.div 
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, delay: 0.1}}
          >
            <span className="inline-block text-emerald-600 font-bold uppercase tracking-wider text-sm mb-4">
              Our Mission
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8 leading-snug tracking-tight">
              Empowering Farmers, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Connecting Communities</span>
            </h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed font-light">
              <p>
                PocketFarm gives farmers the power to digitize their operations — from
                managing plots and crops to receiving payments and handling subscriptions,
                all from a single, intuitive dashboard.
              </p>
              <p>
                For subscribers, it means direct access to local farms — fresh, traceable,
                and affordable. No middlemen, just genuine connections between growers and consumers.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6, delay: 0.2}}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl rotate-3 scale-105 opacity-20 blur-xl transition-transform duration-500 hover:rotate-6 group-hover:scale-110" />
            <div className="relative bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-12 text-center shadow-2xl shadow-slate-200/50 hover:shadow-emerald-500/10 transition-all duration-500 group transform hover:-translate-y-2">
              <div className="text-8xl mb-6 transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 inline-block">🌾</div>
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 mb-4">Farm to Dashboard</h3>
              <p className="text-slate-500 text-lg">
                Everything you need to grow your business, packaged in a sleek, modern interface.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative py-24 bg-gradient-to-br from-emerald-600 to-teal-700 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik01OS41IDAuNWgtNjB2NjBoNjB6IiBmaWxsPSJub25lIi8+CjxwYXRoIGQ9Ik0wIDAuNWg2MCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIG9wYWNpdHk9IjAuMDUiLz4KPHBhdGggZD0iTTAuNSAwLjV2NjAiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyIiBvcGFjaXR5PSIwLjA1Ii8+Cjwvc3ZnPg==')] opacity-30" />
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white relative z-10"
        >
          {stats.map((s, i) => (
            <motion.div 
              key={i} 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              className="p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors duration-300"
            >
              <p className="text-5xl font-extrabold mb-3 tracking-tight">
                <span className="text-emerald-300">{s.prefix || ""}</span>
                <AnimatedCounter target={s.target} suffix={s.suffix} duration={2000} />
              </p>
              <p className="text-emerald-100 font-medium tracking-wide uppercase text-sm">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Values */}
      <section className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6}}
            className="text-center mb-20"
          >
            <span className="inline-block text-teal-600 font-bold uppercase tracking-wider text-sm mb-4">
              What We Stand For
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 tracking-tight">Our Core Values</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              Every feature we design, every decision we make is guided by these foundational elements.
            </p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start group transform hover:-translate-y-1"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  {v.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-teal-600 transition-colors">{v.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-light">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 px-6 bg-white overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-slate-50/80 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div 
            initial={{opacity: 0, y: 30}}
            whileInView={{opacity: 1, y: 0}}
            viewport={{once: true}}
            transition={{duration: 0.6}}
            className="text-center mb-20"
          >
            <span className="inline-block text-emerald-600 font-bold uppercase tracking-wider text-sm mb-4">
              The People
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 tracking-tight">Meet the Team</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              We are a passionate collective of engineers, designers, and agricultural enthusiasts dedicated to reinventing the farm-to-table experience.
            </p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
            }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-10"
          >
            {team.map((member, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                className="group relative bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/15 transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
              >
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-400 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <div className="w-24 h-24 mx-auto bg-slate-50 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner group-hover:scale-110 transition-transform duration-500 ring-4 ring-white relative z-10">
                  {member.emoji}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2 relative z-10">{member.name}</h3>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold mb-4 text-sm tracking-wide uppercase relative z-10">{member.role}</p>
                <p className="text-slate-500 leading-relaxed font-light relative z-10">{member.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 relative overflow-hidden bg-slate-950 text-center">
        <div className="absolute -left-1/4 top-1/4 w-96 h-96 bg-emerald-500/30 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />
        <div className="absolute -right-1/4 bottom-1/4 w-96 h-96 bg-teal-500/30 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{opacity: 0, y: 40}}
          whileInView={{opacity: 1, y: 0}}
          viewport={{once: true}}
          transition={{duration: 0.6}}
          className="max-w-4xl mx-auto relative z-10 p-12 lg:p-20 bg-slate-900/50 backdrop-blur-2xl border border-slate-800 rounded-[3rem] shadow-2xl"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            Ready to Transform Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Farming Experience?</span> 🚀
          </h2>
          <p className="text-slate-400 text-lg md:text-xl mb-12 font-light max-w-2xl mx-auto">
            Join thousands of successful farmers and satisfied communities already thriving on PocketFarm. Your journey to smarter agriculture starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <NavLink
              to="/signup"
              className="btn-primary text-lg !py-4 !px-10 shadow-emerald-500/40 w-full sm:w-auto"
            >
              Get Started Free
            </NavLink>
            <NavLink
              to="/"
              className="bg-transparent border border-slate-700 text-white hover:bg-slate-800 hover:border-slate-600 font-medium px-10 py-4 rounded-xl transition-all duration-200 w-full sm:w-auto"
            >
              Explore Features
            </NavLink>
          </div>
        </motion.div>
      </section>
        </motion.div>
      </AnimatePresence>
    </LandingLayout>
  );
};

export default About;
