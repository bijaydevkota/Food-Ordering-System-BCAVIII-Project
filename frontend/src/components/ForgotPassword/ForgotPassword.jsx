import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiArrowRight, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter PIN, 3: Reset Password
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestPin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/user/forgot-password', { email });
      if (response.data.success) {
        toast.success(response.data.message);
        setStep(2);
      } else {
        toast.error(response.data.message);
        if (response.data.needsVerification) {
          setTimeout(() => navigate('/verify-email', { state: { email } }), 2000);
        }
      }
    } catch (error) {
      toast.error('Failed to send PIN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPin = async (e) => {
    e.preventDefault();
    const pinString = pin.join('');
    if (pinString.length !== 6) {
      toast.error('Please enter complete 6-digit PIN');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/user/verify-reset-pin', { email, pin: pinString });
      if (response.data.success) {
        toast.success(response.data.message);
        setStep(3);
      } else {
        toast.error(response.data.message);
        if (response.data.expired) setPin(['', '', '', '', '', '']);
      }
    } catch (error) {
      toast.error('PIN verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return toast.error('Passwords do not match');
    if (newPassword.length < 8) return toast.error('Password must be at least 8 characters long');
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/user/reset-password', {
        email,
        pin: pin.join(''),
        newPassword
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePinChange = (index, value) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 5) document.getElementById(`pin-${index + 1}`)?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) document.getElementById(`pin-${index - 1}`)?.focus();
  };

  const handleResendPin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:4000/api/user/forgot-password', { email });
      if (response.data.success) {
        toast.success('New PIN sent to your email');
        setPin(['', '', '', '', '', '']);
        document.getElementById('pin-0')?.focus();
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error('Failed to resend PIN');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#FFF7E5] to-white p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF4C29]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD369]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 space-y-6 relative z-10"
      >
        {/* Step Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF4C29] to-[#FFD369] rounded-full flex items-center justify-center shadow-lg">
            {step === 1 && <FiMail className="text-white text-4xl" />}
            {step === 2 && <FiMail className="text-white text-4xl" />}
            {step === 3 && <FiLock className="text-white text-4xl" />}
          </div>
        </div>

        {/* Step Title & Subtitle */}
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#FF4C29] via-[#FF6B35] to-[#FFD369] bg-clip-text text-transparent mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {step === 1 ? 'Forgot Password?' : step === 2 ? 'Enter PIN' : 'Create New Password'}
          </h1>
          <p className="text-gray-600" style={{ fontFamily: "'Lato', sans-serif" }}>
            {step === 1 ? 'Enter your email to receive a reset PIN' : step === 2 ? `PIN sent to ${email}` : 'Your old password will be invalidated'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1 */}
          {step === 1 && (
            <motion.form
              key="step1"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onSubmit={handleRequestPin}
              className="space-y-6"
            >
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF4C29] text-base pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full py-3 px-10 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FFD369] focus:outline-none transition-all duration-300"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 bg-gradient-to-r from-[#FF4C29] to-[#FFD369] text-white font-bold rounded-2xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-[0_0_30px_rgba(255,211,105,0.5)]'}`}
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {loading ? 'Sending...' : <>Send PIN <FiArrowRight /></>}
              </motion.button>
            </motion.form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.form
              key="step2"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onSubmit={handleVerifyPin}
              className="space-y-6"
            >
              <div className="flex justify-center gap-2">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-xl text-[#FF4C29] focus:border-[#FFD369] focus:outline-none transition-all duration-300"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  />
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#FF4C29] to-[#FFD369] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Verify PIN
              </motion.button>
              <div className="text-center">
                <button type="button" onClick={handleResendPin} className="text-[#FF4C29] hover:text-[#FFD369] text-sm transition-colors">
                  Resend PIN
                </button>
              </div>
            </motion.form>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.form
              key="step3"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              onSubmit={handleResetPassword}
              className="space-y-6"
            >
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF4C29] text-base pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full py-3 px-10 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FFD369] focus:outline-none transition-all duration-300"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FF4C29] hover:text-[#FFD369] transition-colors">
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FF4C29] text-base pointer-events-none" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full py-3 px-10 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-[#FFD369] focus:outline-none transition-all duration-300"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FF4C29] hover:text-[#FFD369] transition-colors">
                  {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#FF4C29] to-[#FFD369] text-white font-bold rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all duration-300"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                Reset Password <FiArrowRight />
              </motion.button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Back to Login */}
        <div className="text-center pt-2">
          <Link to="/login" className="text-[#FF4C29] hover:text-[#FFD369] font-semibold transition-colors flex items-center justify-center gap-2">
            <FiArrowRight className="rotate-180" /> Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
