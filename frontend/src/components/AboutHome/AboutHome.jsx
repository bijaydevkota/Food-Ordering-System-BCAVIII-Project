import React from 'react';
import { aboutfeature } from '../../assets/dummydata';
import { FaInfoCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import AboutImage from '../../assets/image2.jpg';
import { motion } from 'framer-motion';

const AboutHome = () => {
  return (
    <section className="relative bg-gradient-to-b from-white via-[#FFF8F2] to-white text-gray-800 py-24 px-6 overflow-hidden">
      
      {/* Background Soft Circles */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-[#FF4C29]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#FFD369]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* LEFT: Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex-1 relative max-w-md w-full mx-auto"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative rounded-3xl overflow-hidden shadow-xl"
          >
            <img 
              src={AboutImage} 
              alt="About Us" 
              className="w-full rounded-3xl object-cover shadow-lg"
            />
            {/* subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/20 to-transparent rounded-3xl pointer-events-none"></div>
          </motion.div>
        </motion.div>

        {/* RIGHT: Text & Features */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex-1 space-y-8"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-5xl font-bold leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="block bg-gradient-to-r from-[#FF4C29] via-[#FF6B35] to-[#FFD369] bg-clip-text text-transparent">
              Bringing Flavors to Life
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-gray-600 text-lg sm:text-xl max-w-2xl leading-relaxed"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            At Zylux Eats, we deliver not just food, but joy and experiences. 
            Every dish is crafted to perfection and delivered fresh to your doorstep.
          </motion.p>

          {/* FEATURES GRID */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8"
          >
            {aboutfeature.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.03 }}
                className="flex flex-col items-center text-center space-y-3 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div className="text-3xl p-4 rounded-full bg-gradient-to-br from-[#FF4C29] to-[#FFD369] shadow-md">
                  <item.icon className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA BUTTON */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-10"
          >
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/about"
                className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF4C29] to-[#FFD369] hover:opacity-90 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all"
              >
                <FaInfoCircle className="text-lg" />
                <span>Learn More About Us</span>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default AboutHome;
