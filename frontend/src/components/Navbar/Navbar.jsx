import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiStar,
  FiPhone,
  FiShoppingCart,
  FiKey,
  FiPackage,
} from "react-icons/fi";
import { useCart } from "../../CartContext/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import NotificationBar from "../NotificationBar/NotificationBar";
import UserProfileDropdown from "../UserProfileDropdown/UserProfileDropdown";
import Logo from "../../assets/logo.png"; 

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("authToken") && localStorage.getItem("user"))
  );

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("authToken") && localStorage.getItem("user")));
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  const handleLogoClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsOpen(false);
  };

  const renderDesktopAuthButton = () => {
    return isAuthenticated ? (
      <UserProfileDropdown />
    ) : (
      <motion.button
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/login")}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-yellow-300 hover:from-pink-500 hover:to-yellow-400 text-gray-800 transition-all duration-300 shadow-lg"
      >
        <FiKey className="text-lg" />
        <span className="font-semibold">Login</span>
      </motion.button>
    );
  };

  const renderMobileAuthButton = () => {
    return isAuthenticated ? (
      <UserProfileDropdown />
    ) : (
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          navigate("/login");
          setIsOpen(false);
        }}
        className="w-full flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-400 to-yellow-300 text-gray-800 transition-all duration-300 shadow-lg"
      >
        <FiKey className="text-lg text-gray-800" />
        <span className="font-semibold">Login</span>
      </motion.button>
    );
  };

  const navLinks = [
    { name: "Home", to: "/", icon: <FiHome /> },
    { name: "Menu", to: "/menu", icon: <FiBook /> },
    { name: "About", to: "/about", icon: <FiStar /> },
    { name: "Contact", to: "/contact", icon: <FiPhone /> },
    ...(isAuthenticated ? [{ name: "My Orders", to: "/myorder", icon: <FiPackage /> }] : []),
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="backdrop-blur-xl bg-white/90 border-b border-gray-200 shadow-lg sticky top-0 z-50"
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-pink-400 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
         <motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.2, duration: 0.6 }}
  className="flex-shrink-0 flex items-center gap-3 group cursor-pointer"
  onClick={handleLogoClick}
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
  <div className="flex items-center gap-3">
             <img src={Logo} alt="Pet Puja Logo" className="w-32 h-32 object-contain" />
            
           </div>
    
</motion.div>


          {/* Desktop Menu */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="hidden lg:flex items-center gap-1 flex-1 justify-end text-gray-800"
          >
            {navLinks.map((link, index) => (
              <NavLink
                key={link.name}
                to={link.to}
                className={({ isActive }) =>
                  `group relative px-3 xl:px-4 py-2.5 flex items-center gap-2 rounded-2xl transition-all duration-300 text-sm xl:text-base ${
                    isActive
                      ? "backdrop-blur-xl bg-gradient-to-r from-pink-100 to-yellow-100 border border-pink-300 text-pink-600 shadow-md"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className={isActive ? "text-pink-500" : "text-pink-400"}>{link.icon}</span>
                    <span className="font-medium">{link.name}</span>
                  </>
                )}
              </NavLink>
            ))}

            <div className="flex items-center gap-3 ml-4">
              {/* Cart */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <NavLink
                  to="/cart"
                  className="relative p-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-2xl transition-all duration-300 flex items-center justify-center"
                >
                  <FiShoppingCart className="text-xl text-gray-700" />
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-400 to-yellow-300 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </NavLink>
              </motion.div>

              {/* Notification */}
              {isAuthenticated && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
                  <NotificationBar />
                </motion.div>
              )}

              {renderDesktopAuthButton()}
            </div>
          </motion.div>

          {/* Hamburger */}
          <motion.div className="lg:hidden flex items-center">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(!isOpen)}
              className="p-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-2xl transition-all duration-300"
            >
              <div className="space-y-1.5 w-6">
                <motion.span
                  animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                  className="block w-full h-0.5 bg-pink-400 rounded-full"
                />
                <motion.span
                  animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                  className="block w-full h-0.5 bg-pink-400 rounded-full"
                />
                <motion.span
                  animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  className="block w-full h-0.5 bg-pink-400 rounded-full"
                />
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-white/95 border-t border-gray-200 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={link.to}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-5 py-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-pink-100 to-yellow-100 border border-pink-300 text-pink-600"
                          : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                      }`
                    }
                  >
                    <span className="text-pink-400">{link.icon}</span>
                    <span className="font-medium text-gray-800">{link.name}</span>
                  </NavLink>
                </motion.div>
              ))}

              <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                {isAuthenticated && (
                  <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: navLinks.length * 0.1 }} className="px-5 py-3">
                    <NotificationBar />
                  </motion.div>
                )}

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navLinks.length + 1) * 0.1 }}>
                  <NavLink
                    to="/cart"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between px-5 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-700 rounded-2xl transition-all duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <FiShoppingCart className="text-pink-400" />
                      <span className="font-medium text-gray-800">Cart</span>
                    </div>
                    {totalItems > 0 && (
                      <span className="bg-gradient-to-r from-pink-400 to-yellow-300 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        {totalItems}
                      </span>
                    )}
                  </NavLink>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (navLinks.length + 2) * 0.1 }}>
                  {renderMobileAuthButton()}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
