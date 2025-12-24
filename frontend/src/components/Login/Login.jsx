import React, { useEffect, useState } from 'react';
import {
  FaArrowRight,
  FaCheckCircle,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
  FaUserPlus
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const url = 'http://localhost:4000';

const Login = ({ onLoginSuccess, onClose }) => {
  const [showToast, setShowToast] = useState({ visible: false, message: '', isError: false });
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('loginData');
    if (stored) setFormData(JSON.parse(stored));
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/user/login`, {
        email: formData.email,
        password: formData.password
      });

      if (res.status === 200 && res.data.success && res.data.token) {
        localStorage.setItem('authToken', res.data.token);
        const userInfo = {
          email: formData.email,
          token: res.data.token,
          username: res.data.user.username,
          profilePhoto: res.data.user.profilePhoto
        };
        localStorage.setItem('user', JSON.stringify(userInfo));

        formData.rememberMe
          ? localStorage.setItem('loginData', JSON.stringify(formData))
          : localStorage.removeItem('loginData');

        setShowToast({ visible: true, message: 'Login successful', isError: false });
        setTimeout(() => {
          setShowToast({ visible: false, message: '', isError: false });
          onLoginSuccess(res.data.token);
        }, 1500);
      } else if (!res.data.success && res.data.needsVerification) {
        setShowToast({ visible: true, message: res.data.message, isError: true });
        setTimeout(() => {
          navigate('/verify-email', { state: { email: res.data.email || formData.email } });
        }, 2000);
      } else if (!res.data.success && res.data.accountDeactivated) {
        setShowToast({ visible: true, message: res.data.message, isError: true });
      } else {
        throw new Error(res.data.message || 'Login Failed');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setShowToast({ visible: true, message: msg, isError: true });
    }
  };

  const handleChange = ({ target: { name, value, type, checked } }) =>
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

  const toggleShowPassword = () => setShowPassword(prev => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-[#FFF7E5] to-white p-4 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF4C29]/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD369]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      {/* Toast Message */}
      {showToast.visible && (
        <div
          className={`fixed top-4 right-4 z-50 transition-all duration-300`}
        >
          <div
            className={`px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold backdrop-blur-xl ${
              showToast.isError
                ? 'bg-red-600/90 text-white border border-red-400'
                : 'bg-green-600/90 text-white border border-green-400'
            }`}
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            <FaCheckCircle className="flex-shrink-0 text-lg" />
            <span>{showToast.message}</span>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl p-8 space-y-6 relative z-10">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-[#FF4C29] via-[#FF6B35] to-[#FFD369] bg-clip-text text-transparent" style={{ fontFamily: "'Playfair Display', serif" }}>
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative">
            <FaUser className="absolute top-1/2 transform -translate-y-1/2 left-4 text-[#FF4C29] pointer-events-none" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-300"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FaLock className="absolute top-1/2 transform -translate-y-1/2 left-4 text-[#FF4C29] pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFD369] transition-all duration-300"
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

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-[#FF4C29] border-[#FFD369] rounded focus:ring-[#FFD369]"
              />
              <span className="ml-3 text-gray-800" style={{ fontFamily: "'Lato', sans-serif" }}>Remember me</span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[#FF4C29] hover:text-[#FFD369] text-sm transition-colors"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-[#FF4C29] to-[#FFD369] hover:from-[#FF6B35] hover:to-[#FFD369] text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-lg hover:shadow-[0_8px_32px_rgba(255,76,41,0.4)] transition-all duration-300"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Sign In <FaArrowRight />
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center pt-2">
          <Link
            to="/signup"
            onClick={onClose}
            className="text-[#FF4C29] hover:text-[#FFD369] transition-colors flex items-center justify-center gap-2 font-semibold"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            <FaUserPlus /> Create new Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
