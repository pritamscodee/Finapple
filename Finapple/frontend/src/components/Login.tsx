import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { useAuthStore } from "../Store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const msg = await login(email, password);
    setLoading(false);
    if (msg === "Login successfully done") {
      toast.success("Welcome back!");
      navigate("/layout");
    } else {
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 lg:py-12">
      <div className="max-w-7xl w-full mx-auto">
        <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-12">
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-md"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#7132f5] mb-4 shadow-md">
                  <span className="text-white font-bold text-3xl">F</span>
                </div>
                <h1
                  className="text-3xl font-bold text-[#101114] mb-2"
                  style={{
                    fontFamily: "IBM Plex Sans, sans-serif",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Welcome Back
                </h1>
                <p className="text-[#686b82]">
                  Sign in to your Finapple account
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8"
                style={{ boxShadow: "0 20px 35px -10px rgba(0,0,0,0.05)" }}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#101114] mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9497a9] w-5 h-5" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7132f5] focus:border-transparent transition-all bg-gray-50"
                        style={{
                          fontFamily: "Helvetica Neue, Helvetica, Arial",
                        }}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#101114] mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9497a9] w-5 h-5" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7132f5] focus:border-transparent transition-all bg-gray-50"
                        style={{
                          fontFamily: "Helvetica Neue, Helvetica, Arial",
                        }}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9497a9] hover:text-[#101114] transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#7132f5] text-white py-3.5 rounded-xl font-semibold hover:bg-[#5741d8] transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Signing in..." : "Sign In"}
                    {!loading && <ArrowRight className="w-5 h-5" />}
                  </motion.button>
                </form>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8 text-[#686b82]"
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-[#7132f5] hover:text-[#5741d8] font-medium transition-colors"
                >
                  Sign up free
                </Link>
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-center gap-2 mt-6 text-sm text-[#9497a9]"
              >
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>Protected by bank-level security</span>
              </motion.div>
            </motion.div>
          </div>

          <div className="hidden lg:flex flex-1 items-center justify-center">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-md"
            >
              <img
                src="/pic.svg"
                alt="Finapple illustration"
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
