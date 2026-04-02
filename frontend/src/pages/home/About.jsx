import { NavLink } from 'react-router-dom';
import LandingLayout from '../../components/layout/LandingLayout';
import AnimatedCounter from '../../components/shared/AnimatedCounter';

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

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-700 to-emerald-600 py-24 px-6 text-center text-white">
        <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full mb-6 backdrop-blur-sm">
          Our Story
        </span>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          We're Building the <br />
          <span className="text-green-200">Future of Farming</span>
        </h1>
        <p className="text-green-100 text-xl max-w-2xl mx-auto mb-10">
          PocketFarm was born from a simple idea — every farmer deserves smart tools,
          and every family deserves access to fresh local produce.
        </p>
        <NavLink
          to="/signup"
          className="inline-block bg-white text-green-700 hover:bg-green-50 font-semibold px-8 py-3 rounded-lg shadow-md transition"
        >
          Join Us Today
        </NavLink>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              Our Mission
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mb-5 leading-snug">
              Empowering Farmers, <br />Connecting Communities
            </h2>
            <p className="text-gray-500 text-lg mb-5 leading-relaxed">
              PocketFarm gives farmers the power to digitize their operations — from
              managing plots and crops to receiving payments and handling subscriptions,
              all from a single dashboard.
            </p>
            <p className="text-gray-500 text-lg leading-relaxed">
              For subscribers, it means direct access to local farms — fresh, traceable,
              and affordable. No middlemen, just genuine connections between growers and consumers.
            </p>
          </div>
          <div className="bg-green-50 rounded-3xl p-10 text-center">
            <div className="text-7xl mb-4">🌾</div>
            <h3 className="text-2xl font-bold text-green-700 mb-2">Farm to Dashboard</h3>
            <p className="text-gray-500">
              Everything a farmer needs — plot management, subscriptions, earnings tracking — in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-green-700 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
          {stats.map((s, i) => (
            <div key={i} className="p-4">
              <p className="text-4xl font-bold mb-2">
                {s.prefix || ""}
                <AnimatedCounter target={s.target} suffix={s.suffix} duration={2000} />
              </p>
              <p className="text-green-200 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              What We Stand For
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Core Values</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Everything we build is guided by these principles.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 flex gap-5 items-start group"
              >
                <div className="text-4xl group-hover:scale-110 transition-transform">{v.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{v.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
              The People
            </span>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet the Team</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              A small but passionate team dedicated to making farming simpler and smarter.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-green-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                  {member.emoji}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-green-600 text-sm font-semibold mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-green-700 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">
            Be Part of the Journey 🚀
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Whether you're a farmer or a subscriber, PocketFarm has a place for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/signup"
              className="bg-white hover:bg-green-50 text-green-700 font-semibold px-8 py-3 rounded-lg shadow-md transition"
            >
              Get Started Free
            </NavLink>
            <NavLink
              to="/"
              className="border border-white text-white hover:bg-green-600 font-semibold px-8 py-3 rounded-lg transition"
            >
              Back to Home
            </NavLink>
          </div>
        </div>
      </section>

    </LandingLayout>
  );
};

export default About;
