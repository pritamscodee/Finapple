import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield } from "lucide-react";
import { useAuthStore } from "../Store/authStore";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  onSwitchToSignup?: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isAuthenticated, user, login } = useAuthStore();
  const naviagte = useNavigate();
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const msg = await login(email, password);

    alert(msg);
    if (msg === "Login successfully done") {
      naviagte("/layout");
    }
    console.log("Login:", { email, password });
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
              {/* Logo & Heading */}
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

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-gray-300 text-[#7132f5] focus:ring-[#7132f5]"
                      />
                      <span className="text-sm text-[#686b82]">
                        Remember me
                      </span>
                    </label>
                    <a
                      href="#"
                      className="text-sm text-[#7132f5] hover:text-[#5741d8] transition-colors font-medium"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-[#7132f5] text-white py-3.5 rounded-xl font-semibold hover:bg-[#5741d8] transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </form>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-[#9497a9]">
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-[#101114]">
                      Google
                    </span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="text-sm font-medium text-[#101114]">
                      Facebook
                    </span>
                  </motion.button>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8 text-[#686b82]"
              >
                Don't have an account?{" "}
                <button
                  onClick={onSwitchToSignup}
                  className="text-[#7132f5] hover:text-[#5741d8] font-medium transition-colors"
                >
                  Sign up free
                </button>
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
            {!isAuthenticated ? (
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
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md"
              >
                <div className="bg-white border border-gray-100 shadow-xl rounded-2xl p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold text-[#101114]">
                    Login Successful
                  </h2>
                  <p className="text-[#686b82] text-sm mt-2">
                    Welcome back! You are now authenticated.
                  </p>
                  {user && (
                    <div className="mt-4 text-sm text-[#101114] bg-purple-50 rounded-xl p-3">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-[#686b82]">{user.email}</p>
                    </div>
                  )}
                  <button className="mt-5 w-full bg-[#7132f5] text-white py-2.5 rounded-xl hover:bg-[#5741d8] transition-colors">
                    Go to Dashboard
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
