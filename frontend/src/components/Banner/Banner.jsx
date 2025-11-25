import React, { useState } from 'react';
import { FaSearch, FaArrowRight } from "react-icons/fa";
import { bannerAssets } from '../../assets/dummydata';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Banner = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { bannerImage, bannerImage2 } = bannerAssets; // make sure bannerImage2 exists

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/menu', { state: { searchQuery: searchQuery.trim() } });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-white via-[#FDF7F2] to-white text-[#111] min-h-[90vh] flex items-center px-4 sm:px-8 py-16">

      {/* Background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-300/20 to-yellow-300/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between relative z-10 gap-12">

        {/* LEFT SIDE - Text + Search */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 text-center lg:text-left space-y-8"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Pet Puja <br />
            <span className="bg-gradient-to-r from-fuchsia-500 via-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,105,180,0.4)]">
              Remove your Hunger
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-600 text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Best cooks and best delivery guys all at your service. 
            <span className="text-orange-500 font-semibold"> Hot tasty food</span> will reach you in <span className="text-fuchsia-600 font-bold">60 minutes</span>.
          </motion.p>

          {/* Search Bar */}
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            onSubmit={handleSearch}
            className="relative max-w-md mx-auto lg:mx-0"
          >
            <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-500 text-lg pointer-events-none" />
              <input
                type="text"
                placeholder="Search your favorite dish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-4 pl-12 pr-16 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 focus:placeholder-orange-400"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <FaArrowRight className="text-sm" />
              </motion.button>
            </div>
          </motion.form>
        </motion.div>

        {/* RIGHT SIDE - Zigzag Images */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 relative min-h-[400px] sm:min-h-[500px]"
        >
          <div className="relative w-full flex flex-col gap-8 items-center justify-center">

            {/* Top Left Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="relative w-64 sm:w-72 md:w-80 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-4 shadow-xl hover:shadow-2xl"
            >
              <motion.img
                src={bannerImage}
                alt="Food 1"
                className="w-full rounded-2xl object-cover"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Bottom Right Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="relative w-64 sm:w-72 md:w-80 bg-white/70 backdrop-blur-xl border border-gray-200 rounded-3xl p-4 shadow-xl hover:shadow-2xl self-end"
            >
              <motion.img
                src={bannerImage2}
                alt="Food 2"
                className="w-full rounded-2xl object-cover"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Banner;
