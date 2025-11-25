import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaArrowLeft, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const url = 'http://localhost:4000';

// Toast Component
const AwesomeToast = ({ message, icon, isError }) => (
  <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg animate-slide-in backdrop-blur-xl ${
    isError ? 'bg-red-600/90 border border-red-400' : 'bg-green-600/90 border border-green-400'
  } text-white`}>
    <span className="text-lg">{icon}</span>
    <span className="text-sm font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>{message}</span>
  </div>
);

const SignUP = () => {
  const [showToast, setShowToast] = useState({ visible: false, message: '', icon: null, isError: false });
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  useEffect(() => {
    if (showToast.visible && !showToast.isError && showToast.message === 'Sign up successfully') {
      const timer = setTimeout(() => {
        setShowToast({ visible: false, message: '', icon: null, isError: false });
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast, navigate]);

  const toggleShowPassword = () => setShowPassword(prev => !prev);
  const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/register`, formData);

      if (res.data.success && res.data.needsVerification) {
        setShowToast({
          visible: true,
          message: res.data.message || 'Check your email for verification PIN',
          icon: <FaCheckCircle />,
          isError: false
        });
        setTimeout(() => navigate('/verify-email', { state: { email: res.data.email } }), 2000);
        return;
      }

      if (res.data.success && res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        setShowToast({
          visible: true,
          message: 'Sign up successfully',
          icon: <FaCheckCircle />,
          isError: false
        });
        return;
      }

      throw new Error(res.data.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setShowToast({ visible: true, message: msg, icon: <FaCheckCircle />, isError: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#FFF7E5] to-white p-4 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF4C29]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD369]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {showToast.visible && <AwesomeToast message={showToast.message} icon={showToast.icon} isError={showToast.isError} />}

      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 space-y-6 relative z-10">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#FF4C29] via-[#FF6B35] to-[#FFD369] bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-300"
            required
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-300"
            required
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-300 pr-12"
              required
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 text-[#FF4C29] hover:text-[#FFD369] transition-colors"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#FF4C29] to-[#FFD369] hover:from-[#FF6B35] hover:to-[#FFD369] text-white font-bold rounded-2xl shadow-lg transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        {/* Back to Login */}
        <div className="mt-6 text-center text-gray-600">
          <Link
            to="/login"
            className="text-[#FF4C29] hover:text-[#FFD369] transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <FaArrowLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUP;
