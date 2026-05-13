import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Shield,
  Zap,
  TrendingUp,
  Lock,
  Globe,
  Clock,
} from "lucide-react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 lg:px-16 py-4 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 rounded-xl bg-[#7132f5] flex items-center justify-center">
            <span className="text-white font-bold text-xl">F</span>
          </div>
          <span className="text-[#101114] font-bold text-xl">Finapple</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="hidden md:flex items-center gap-8"
        >
          <a
            href="#"
            className="text-[#686b82] hover:text-[#101114] transition-colors"
          >
            Features
          </a>
          <a
            href="#"
            className="text-[#686b82] hover:text-[#101114] transition-colors"
          >
            Security
          </a>
          <a
            href="#"
            className="text-[#686b82] hover:text-[#101114] transition-colors"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-[#686b82] hover:text-[#101114] transition-colors"
          >
            About
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <Link
              to="/login"
              className="
      bg-white
      border-2 border-[#7132f5]
      text-[#7132f5] hover:text-[#5741d8] 
      active:bg-[#f5f3ff]
      transition-all
      font-medium
      px-5 py-3 sm:py-2.5
      text-center sm:text-left
      rounded-xl
      hover:border-[#5741d8] hover:bg-[#faf9ff]
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7132f5] focus-visible:ring-offset-2
      min-h-[44px] sm:min-h-0
    "
            >
              Log In
            </Link>

            <Link
              to="/signup"
              className="
      bg-[#7132f5] text-white 
      px-5 py-3 sm:py-2.5 
      rounded-xl 
      font-medium 
      hover:bg-[#5741d8] 
      active:bg-[#4829c0]
      transition-all
      text-center
      shadow-sm hover:shadow-md
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7132f5] focus-visible:ring-offset-2
      min-h-[44px] sm:min-h-0
    "
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      </nav>

      <section className="px-6 lg:px-16 pt-16 lg:pt-24 pb-20 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-[rgba(20,158,97,0.16)] text-[#026b3f] px-4 py-2 rounded-lg mb-6"
            >
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Trusted by 2M+ users</span>
            </motion.div>

            <h1
              className="text-5xl lg:text-6xl font-bold text-[#101114] leading-tight mb-6"
              style={{
                fontFamily: "IBM Plex Sans, sans-serif",
                letterSpacing: "-1px",
              }}
            >
              Smart Banking for
              <span className="text-[#7132f5]"> Modern Life</span>
            </h1>

            <p className="text-lg text-[#686b82] mb-8 leading-relaxed max-w-xl">
              Experience seamless transactions, real-time insights, and
              bank-grade security. Manage your finances with confidence and
              ease.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#7132f5] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#5741d8] transition-colors flex items-center justify-center gap-2"
              >
                Open Free Account
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-[#5741d8] text-[#5741d8] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[rgba(133,91,251,0.16)] transition-colors"
              >
                Watch Demo
              </motion.button>
            </div>

            <div className="flex items-center gap-6 text-sm text-[#9497a9]">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#149e61]" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#149e61]" />
                <span>24/7 support</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop"
                alt="Modern banking app"
                className="rounded-2xl shadow-2xl w-full"
                style={{ boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px" }}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg z-20"
              style={{ boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[rgba(20,158,97,0.16)] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-[#149e61]" />
                </div>
                <div>
                  <p className="text-sm text-[#9497a9]">Portfolio Growth</p>
                  <p className="text-lg font-bold text-[#101114]">+24.5%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-lg z-20"
              style={{ boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[rgba(113,50,245,0.16)] flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#7132f5]" />
                </div>
                <div>
                  <p className="text-sm text-[#9497a9]">Protected</p>
                  <p className="text-lg font-bold text-[#101114]">
                    $1M insured
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#f8f9fa] py-20 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className="text-4xl font-bold text-[#101114] mb-4"
              style={{
                fontFamily: "IBM Plex Sans, sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              Why Choose Finapple?
            </h2>
            <p className="text-lg text-[#686b82] max-w-2xl mx-auto">
              Built for the modern world, designed for your financial success
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Transfers",
                description:
                  "Send money instantly to anyone, anywhere. No waiting, no delays.",
                color: "text-[#7132f5]",
                bgColor: "bg-[rgba(113,50,245,0.16)]",
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Bank-Grade Security",
                description:
                  "256-bit encryption with jwt authentication protect your funds.",
                color: "text-[#149e61]",
                bgColor: "bg-[rgba(20,158,97,0.16)]",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Smart Analytics",
                description:
                  "AI-powered insights help you understand and optimize your spending.",
                color: "text-[#7132f5]",
                bgColor: "bg-[rgba(113,50,245,0.16)]",
              },
              {
                icon: <Lock className="w-8 h-8" />,
                title: "Secure Vault",
                description:
                  "Keep your document safe with our  vault feature.",
                color: "text-[#149e61]",
                bgColor: "bg-[rgba(20,158,97,0.16)]",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Global Access",
                description:
                  "Mark and process transactions as international with secure validation rules.",
                color: "text-[#7132f5]",
                bgColor: "bg-[rgba(113,50,245,0.16)]",
              },
              {
                icon: <Clock className="w-8 h-8" />,
                title: "24/7 Support",
                description: "Our team is always here to help, day or night.",
                color: "text-[#149e61]",
                bgColor: "bg-[rgba(20,158,97,0.16)]",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl hover:shadow-lg transition-shadow"
                style={{ boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px" }}
              >
                <div
                  className={`w-16 h-16 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}
                >
                  <div className={feature.color}>{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-[#101114] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[#686b82] leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#7132f5] rounded-3xl p-12 text-center text-white"
          >
            <h2
              className="text-4xl font-bold mb-4"
              style={{
                fontFamily: "IBM Plex Sans, sans-serif",
                letterSpacing: "-0.5px",
              }}
            >
              Ready to Transform Your Banking?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join millions of users who have already made the switch to smarter
              banking.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#7132f5] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Get Started Free
            </motion.button>
          </motion.div>
        </div>
      </section>

      <footer className="bg-[#101114] text-white py-16 px-6 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#7132f5] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="font-bold text-xl">Finapple</span>
              </div>
              <p className="text-[#9497a9] text-sm">
                Modern banking for the modern world. Secure, fast, and always
                available.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-[#9497a9] text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mobile App
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-[#9497a9] text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-[#9497a9] text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#dedee5] pt-8 text-center text-[#9497a9] text-sm">
            <p>&copy; 2025 Finapple. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
