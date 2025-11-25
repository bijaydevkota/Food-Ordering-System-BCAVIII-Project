import { BiChevronRight } from "react-icons/bi";
import { motion } from "framer-motion";
import { socialIcons } from "../../assets/dummydata";
import Logo from "../../assets/logo.png"; 

const Footer = () => {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Menu", link: "/menu" },
    { name: "About Us", link: "/about" },
    { name: "Contact", link: "/contact" },
  ];

  return (
    <footer className="relative bg-white text-gray-700 py-16 px-5 border-t border-gray-200 overflow-hidden">

      {/* Soft Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF4C29]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#FFD369]/20 rounded-full blur-3xl"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#6BCB77]/10 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">

        {/* Left Column: Logo & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3">
            <img src={Logo} alt="Pet Puja Logo" className="w-32 h-32 object-contain" />
           
          </div>
          <p className="text-gray-600 leading-relaxed" style={{ fontFamily: "'Lato', sans-serif" }}>
            Bringing delicious moments to your doorstep with love and care.
          </p>
        </motion.div>

        {/* Middle Column: Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Lato', sans-serif" }}>
            Quick Links
          </h3>

          <ul className="space-y-3">
            {navItems.map((item, index) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <a
                  href={item.link}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#FF4C29] transition-colors duration-300 group"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  <BiChevronRight className="text-sm group-hover:translate-x-1 transition-transform" />
                  {item.name}
                </a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Right Column: Social Icons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Lato', sans-serif" }}>
            Follow Us
          </h3>

          <div className="flex gap-4">
            {socialIcons.map((social, index) => (
              <motion.a
                key={social.label}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300"
                style={{
                  backgroundColor: `${social.color}15`,
                  border: `1px solid ${social.color}40`,
                }}
              >
                <social.icon className="text-xl" style={{ color: social.color }} />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: true }}
        className="border-t border-gray-200 mt-16 pt-8 text-center relative z-10"
      >
        <p className="text-gray-600 text-sm mb-2" style={{ fontFamily: "'Lato', sans-serif" }}>
          &copy; 2025 <span className="text-[#FF4C29] font-semibold">Pet Puja</span>. All Rights Reserved.
        </p>
        <p className="text-xs text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}>
          Designed & Developed by <span className="text-[#FF4C29]">Bijay Devkota</span> and <span className="text-[#FF4C29]">Ronish Prajapati</span>
        </p>
      </motion.div>
    </footer>
  );
};

export default Footer;
