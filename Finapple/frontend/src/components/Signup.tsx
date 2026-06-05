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
  LockKeyhole,
  Building2,
} from "lucide-react";
import { useAuthStore } from "../Store/authStore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    const msg = await register(
      formData.fullName,
      formData.email,
      formData.password,
    );
    setLoading(false);
    if (msg === "Registration Success") {
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } else {
      toast.error(msg);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                  <LockKeyhole className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#101114]">
                    Bank-level security
                  </h3>
                  <p className="text-sm text-[#6b6e85]">
                    Your data is always protected
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
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#7132f5] to-[#8b5cf6] text-white py-2.5 rounded-xl font-semibold hover:from-[#5a28cc] hover:to-[#7c3aed] transition-all flex items-center justify-center gap-2 shadow-md shadow-purple-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating account..." : "Create account"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </motion.button>
              </form>

              <p className="text-center mt-6 text-sm text-[#5b5e77]">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-[#7132f5] hover:text-[#5741d8] font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
