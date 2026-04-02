import { NavLink } from 'react-router-dom';
import LandingLayout from '../../components/layout/LandingLayout';

const Home = () => {
  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-6">
        <div className="max-w-4xl text-center">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full mb-6">
            🌾 Smart Farm Management
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-6 leading-tight">
            Your Personal Farm,<br /> Right in Your Pocket
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Manage plots, track crops, handle subscriptions and payments — all from one simple dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/signup"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Get Started Free
            </NavLink>
            <NavLink
              to="/signin"
              className="bg-white hover:bg-gray-100 text-green-700 border border-green-300 px-8 py-3 rounded-lg font-semibold shadow-md transition"
            >
              Login
            </NavLink>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why PocketFarm?</h2>
          <p className="text-gray-500">Everything you need to manage your farm, in one place.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            { icon: "🌱", title: "Manage Plots", desc: "Create, edit and monitor all your farm plots in real time." },
            { icon: "📋", title: "Subscriptions", desc: "Let subscribers book your plots with flexible subscription plans." },
            { icon: "💳", title: "Easy Payments", desc: "Collect payments online securely through Razorpay integration." },
          ].map((f, i) => (
            <div key={i} className="bg-green-50 rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-50 px-6">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Get started in minutes. No complicated setup — just sign up and start managing your farm.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector Line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-0.5 bg-green-200 z-0" />

          {[
            {
              step: "01",
              icon: "📝",
              title: "Create an Account",
              desc: "Sign up as a Farmer to list your plots, or as a Subscriber to browse and book available farm plots.",
            },
            {
              step: "02",
              icon: "🌾",
              title: "Set Up Your Plots",
              desc: "Farmers add their plot details — size, location, price, and crop type. Everything is managed from your dashboard.",
            },
            {
              step: "03",
              icon: "💰",
              title: "Manage & Earn",
              desc: "Subscribers book plots, payments are processed via Razorpay, and farmers track earnings all in one place.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="relative z-10 bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 text-center group"
            >
              {/* Step Badge */}
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white text-sm font-bold mb-5 group-hover:scale-110 transition-transform">
                {item.step}
              </div>
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-700 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Grow Smarter? 🌱
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join hundreds of farmers and subscribers already using PocketFarm.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <NavLink
              to="/signup"
              className="bg-white hover:bg-green-50 text-green-700 font-semibold px-8 py-3 rounded-lg shadow-md transition"
            >
              Get Started Free
            </NavLink>
            <NavLink
              to="/signin"
              className="border border-white text-white hover:bg-green-600 font-semibold px-8 py-3 rounded-lg transition"
            >
              Login
            </NavLink>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
};

export default Home;
