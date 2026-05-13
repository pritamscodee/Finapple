import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ArrowRight,
  Shield,
  CheckCircle,
  Sparkles,
  CreditCard,
  LockKeyhole,
  Building2,
} from "lucide-react";
import { useAuthStore } from "../Store/authStore";
import { useNavigate } from "react-router-dom";

interface SignupProps {
  onSwitchToLogin?: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { register } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const msg = await register(
      formData.fullName,
      formData.email,
      formData.password,
    );

    alert(msg);

    if (msg === "Registration Success") {
      navigate("/login");
    }

    console.log("Signup:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#faf9ff] to-[#f3f0ff] flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex-1 space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[#7132f5] to-[#8b5cf6] shadow-lg shadow-purple-200"
              >
                <span className="text-white font-bold text-3xl">F</span>
              </motion.div>
              <h1 className="text-4xl lg:text-5xl font-bold text-[#101114] tracking-tight">
                Start your
                <br />
                <span className="bg-gradient-to-r from-[#7132f5] to-[#a78bfa] bg-clip-text text-transparent">
                  financial journey
                </span>
              </h1>
              <p className="text-lg text-[#5b5e77] leading-relaxed">
                Join thousands of users who trust us with their financial
                future. Get started today with a free account.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#101114]">Free forever</h3>
                  <p className="text-sm text-[#6b6e85]">
                    No monthly fees, no hidden costs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-[#7132f5]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#101114]">
                    Instant virtual card
                  </h3>
                  <p className="text-sm text-[#6b6e85]">
                    Start spending right away
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/60 backdrop-blur-sm border border-white/50 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <LockKeyhole className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#101114]">
                    Bank-level security
                  </h3>
                  <p className="text-sm text-[#6b6e85]">
                    Your money is always protected
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#7132f5]" />
                <span className="text-sm text-[#5b5e77]">256-bit SSL</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#7132f5]" />
                <span className="text-sm text-[#5b5e77]">FDIC Insured</span>
              </div>
              <div className="w-px h-4 bg-gray-200" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#7132f5]" />
                <span className="text-sm text-[#5b5e77]">24/7 Support</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl shadow-purple-100/50 border border-white/50 p-6 sm:p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#101114]">
                  Create account
                </h2>
                <p className="text-sm text-[#5b5e77] mt-1">
                  Get started in minutes
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#101114] mb-1.5">
                    Full name
                  </label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a3b7] group-focus-within:text-[#7132f5] transition-colors w-4 h-4" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7132f5]/20 focus:border-[#7132f5] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#101114] mb-1.5">
                    Email address
                  </label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a3b7] group-focus-within:text-[#7132f5] transition-colors w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7132f5]/20 focus:border-[#7132f5] focus:bg-white transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#101114] mb-1.5">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a3b7] group-focus-within:text-[#7132f5] transition-colors w-4 h-4" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7132f5]/20 focus:border-[#7132f5] focus:bg-white transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a3b7] hover:text-[#5b5e77] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#101114] mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a3b7] group-focus-within:text-[#7132f5] transition-colors w-4 h-4" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7132f5]/20 focus:border-[#7132f5] focus:bg-white transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a1a3b7] hover:text-[#5b5e77] transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-[#7132f5] focus:ring-[#7132f5]/20 focus:ring-offset-0"
                    required
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-[#5b5e77] leading-relaxed"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-[#7132f5] hover:text-[#5741d8] font-medium transition-colors"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-[#7132f5] hover:text-[#5741d8] font-medium transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#7132f5] to-[#8b5cf6] text-white py-2.5 rounded-xl font-semibold hover:from-[#5a28cc] hover:to-[#7c3aed] transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-200"
                >
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-[#a1a3b7]">
                    or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="text-sm font-medium text-[#101114]">
                    Facebook
                  </span>
                </motion.button>
              </div>

              <p className="text-center mt-6 text-sm text-[#5b5e77]">
                Already have an account?{" "}
                <button
                  onClick={onSwitchToLogin}
                  className="text-[#7132f5] hover:text-[#5741d8] font-semibold transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
